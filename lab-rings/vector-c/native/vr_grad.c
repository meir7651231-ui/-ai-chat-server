/* vr_grad.c -- SkLinearGradient / SkRadialGradient through Skia's raster pipeline as Chromium
 * runs it on x86-64 with AVX2+FMA (SKRP_CPU_HSW, highp because Blink always dithers gradients):
 *   seed_shader, matrix_{translate,scale_translate,2x3}, [xy_to_radius], [clamp_x_1],
 *   evenly_spaced_2_stop_gradient | evenly_spaced_gradient | gradient, dither(1/255), clamp_01,
 *   then (blend Src since opaque) store_8888 | load_8888_dst + lerp_1_float/lerp_u8 + store_8888.
 * mad() is a fused multiply-add on that target, so fmaf() is used exactly where Skia uses mad(). */
#include "vr.h"
#include <math.h>
#include <string.h>
#include <stdint.h>

/* tunables (exposed for calibration experiments) */
int vr_grad_color_div = 1;      /* stop colours: 1 = c/255.0f (Blink Color::toSkColor4f), 0 = c*(1/255.0f) */
int vr_grad_dither = 1;         /* Blink: "gradients are always dithered" */
int vr_grad_radius_fma = 0;
int vr_dbg_x = -1, vr_dbg_y = -1;
#include <stdio.h>
     /* xy_to_radius: 0 = sqrt(x*x + y*y), 1 = sqrt(fma(x,x,y*y)) (fp-contract) */

/* ------------------------------------------------------------------ SkMatrix subset (float, Skia order) */
typedef struct { float sx, kx, tx, ky, sy, ty; } M;
static int m_type(const M *m) {   /* 0 identity, 1 translate, 2 scale(+translate), 3 affine */
    if (m->kx != 0 || m->ky != 0) return 3;
    if (m->sx != 1 || m->sy != 1) return 2;
    if (m->tx != 0 || m->ty != 0) return 1;
    return 0;
}
static float muladdmul(float a, float b, float c, float d) { return (float)((double)a * b + (double)c * d); }
static M m_concat(const M *a, const M *b) {   /* a * b  (SkMatrix::setConcat, non-perspective) */
    int ta = m_type(a), tb = m_type(b);
    M t;
    if (ta == 0) return *b;
    if (tb == 0) return *a;
    if (ta < 3 && tb < 3) {
        t.sx = a->sx * b->sx; t.sy = a->sy * b->sy;
        t.tx = a->sx * b->tx + a->tx; t.ty = a->sy * b->ty + a->ty;
        t.kx = t.ky = 0;
        return t;
    }
    t.sx = muladdmul(a->sx, b->sx, a->kx, b->ky);
    t.kx = muladdmul(a->sx, b->kx, a->kx, b->sy);
    t.tx = muladdmul(a->sx, b->tx, a->kx, b->ty) + a->tx;
    t.ky = muladdmul(a->ky, b->sx, a->sy, b->ky);
    t.sy = muladdmul(a->ky, b->kx, a->sy, b->sy);
    t.ty = muladdmul(a->ky, b->tx, a->sy, b->ty) + a->ty;
    return t;
}
static int m_invert(const M *m, M *inv) {
    int ty = m_type(m);
    if (ty == 0) { *inv = *m; return 1; }
    if (ty < 3) {
        if (ty == 2) {
            float isx = 1.f / m->sx, isy = 1.f / m->sy;
            if (!isfinite(isx) || !isfinite(isy)) return 0;
            float itx = -m->tx * isx, ity = -m->ty * isy;
            if (!isfinite(itx) || !isfinite(ity)) return 0;
            M r = {isx, 0, itx, 0, isy, ity}; *inv = r; return 1;
        }
        if (!isfinite(m->tx) || !isfinite(m->ty)) return 0;
        M r = {1, 0, -m->tx, 0, 1, -m->ty}; *inv = r; return 1;
    }
    double det = (double)m->sx * m->sy - (double)m->kx * m->ky;
    if (fabsf((float)det) <= (1.0f / 4096) * (1.0f / 4096) * (1.0f / 4096)) return 0;
    double invDet = 1.0 / det;
    M r;
    r.sx = (float)(m->sy * invDet);
    r.kx = (float)(-m->kx * invDet);
    r.tx = (float)(((double)m->kx * m->ty - (double)m->sy * m->tx) * invDet);
    r.ky = (float)(-m->ky * invDet);
    r.sy = (float)(m->sx * invDet);
    r.ty = (float)(((double)m->ky * m->tx - (double)m->sx * m->ty) * invDet);
    if (!isfinite(r.sx) || !isfinite(r.kx) || !isfinite(r.tx) || !isfinite(r.ky) || !isfinite(r.sy) || !isfinite(r.ty)) return 0;
    *inv = r; return 1;
}
static void m_post_translate(M *m, float dx, float dy) { m->tx += dx; m->ty += dy; }
static void m_post_scale(M *m, float sx, float sy) {
    if (sx == 1 && sy == 1) return;
    M s = {sx, 0, 0, 0, sy, 0};
    *m = m_concat(&s, m);
}
static float sk_len(float dx, float dy) {
    float mag2 = dx * dx + dy * dy;
    if (isfinite(mag2)) return sqrtf(mag2);
    double xx = dx, yy = dy; return (float)sqrt(xx * xx + yy * yy);
}
/* SkLinearGradient pts_to_unit_matrix */
static M pts_to_unit(float x0, float y0, float x1, float y1) {
    float vx = x1 - x0, vy = y1 - y0;
    float mag = sk_len(vx, vy);
    float inv = mag ? 1.0f / mag : 0;
    vx = vx * inv; vy = vy * inv;
    /* setSinCos(sin=-vy, cos=vx, px=x0, py=y0) */
    float sinV = -vy, cosV = vx, omc = 1 - cosV;
    M m;
    m.sx = cosV; m.kx = -sinV; m.tx = sinV * y0 + omc * x0;
    m.ky = sinV; m.sy = cosV; m.ty = -sinV * x0 + omc * y0;
    m_post_translate(&m, -x0, -y0);
    m_post_scale(&m, inv, inv);
    return m;
}
static M rad_to_unit(float cx, float cy, float r) {
    float inv = 1.0f / r;
    M m = {1, 0, -cx, 0, 1, -cy};
    m_post_scale(&m, inv, inv);
    return m;
}
static int nearly_equal(float a, float b, float tol) { return fabsf(a - b) <= tol; }

int grad_setup(Paint *pt, int linear, float x1, float y1, float x2, float y2, float cx, float cy, float r,
               const Mat *ctm, const Mat *local, int localIsIdentity, int nstops, const float *off, const float (*col)[4]) {
    memset(pt, 0, sizeof *pt);
    /* stop colours (opaque only; caller flags others) */
    float C[MAXSTOPS + 2][4], pos[MAXSTOPS + 2];
    int n = 0;
    for (int i = 0; i < nstops && n < MAXSTOPS; i++) {
        for (int k = 0; k < 3; k++) {
            float v = col[i][k];   /* = byte/255.0f from the parser; recompute from the byte */
            int byte = (int)lrintf(v * 255.0f);
            C[n][k] = vr_grad_color_div ? (float)byte / 255.0f : (float)byte * (1 / 255.0f);
        }
        C[n][3] = col[i][3];
        pos[n] = off[i];
        n++;
    }
    if (n == 0) return 0;
    /* Blink Gradient::FillSkiaStops */
    float P2[MAXSTOPS + 4], C2[MAXSTOPS + 4][4]; int m = 0;
    if (pos[0] > 0) { P2[m] = 0; memcpy(C2[m], C[0], sizeof C2[m]); m++; }
    for (int i = 0; i < n; i++) { P2[m] = pos[i]; memcpy(C2[m], C[i], sizeof C2[m]); m++; }
    if (P2[m - 1] < 1) { P2[m] = 1; memcpy(C2[m], C2[m - 1], sizeof C2[m]); m++; }
    if (m == 1) { pt->kind = 0; pt->r = (uint8_t)lrintf(C2[0][0] * 255); pt->g = (uint8_t)lrintf(C2[0][1] * 255); pt->b = (uint8_t)lrintf(C2[0][2] * 255); return 1; }
    /* degenerate geometry -> SkGradientBaseShader::MakeDegenerateGradient (clamp: last colour) */
    const float kDegenerate = 1.0f / (1 << 15);
    if (linear ? fabsf(sk_len(x2 - x1, y2 - y1)) <= kDegenerate : fabsf(r) <= kDegenerate) {
        if (!linear && r < 0) return 0;
        pt->kind = 0;
        pt->r = (uint8_t)lrintf(C2[m - 1][0] * 255); pt->g = (uint8_t)lrintf(C2[m - 1][1] * 255); pt->b = (uint8_t)lrintf(C2[m - 1][2] * 255);
        vr_flags |= VR_FLAG_GRADIENT_APPROX;
        return 1;
    }
    /* SkGradientBaseShader ctor: implicit stops, monotonic pin, uniform detection, dedupe */
    int firstImplicit = P2[0] > 0, lastImplicit = P2[m - 1] != 1;
    int count = m + firstImplicit + lastImplicit;
    float FC[MAXSTOPS + 6][4], FP[MAXSTOPS + 6];
    int ci = 0;
    if (firstImplicit) memcpy(FC[ci++], C2[0], sizeof FC[0]);
    for (int i = 0; i < m; i++) memcpy(FC[ci + i], C2[i], sizeof FC[0]);
    if (lastImplicit) memcpy(FC[ci + m], C2[m - 1], sizeof FC[0]);
    int usePositions = 1;
    {
        float prev = 0; int pi = 0;
        FP[pi++] = prev;
        int startIndex = firstImplicit ? 0 : 1;
        int cnt = m + lastImplicit;
        int uniform = 1;
        float uniformStep = P2[startIndex] - prev;
        for (int i = startIndex; i < cnt; i++) {
            float curr = 1.0f;
            if (i != m) {
                curr = P2[i] < prev ? prev : (P2[i] > 1.0f ? 1.0f : P2[i]);   /* SkTPin(pos, prev, 1) */
                if (curr == 1.0f && lastImplicit) lastImplicit = 0;
            }
            uniform &= nearly_equal(uniformStep, curr - prev, 1.0f / (1 << 12));
            FP[pi++] = prev = curr;
        }
        if (uniform) usePositions = 0;
        else {
            /* dedupe (clamp tile mode) */
            int i = 0, ded = 0;
            for (int j = 1; j <= count; j++) {
                if (j == count || FP[i] != FP[j]) {
                    int dup = j - i > 1;
                    FP[ded] = FP[i]; memcpy(FC[ded], FC[i], sizeof FC[0]); ded++;
                    if (dup) { FP[ded] = FP[j - 1]; memcpy(FC[ded], FC[j - 1], sizeof FC[0]); ded++; }
                    i = j;
                }
            }
            count = ded;
        }
    }
    /* stages */
    pt->kind = linear ? 1 : 2;
    pt->radial = !linear;
    pt->clampx = !usePositions;
    pt->dither = vr_grad_dither ? 1 / 255.0f : 0.0f;
    if (!usePositions && count == 2) {
        pt->gtype = 0;
        for (int k = 0; k < 4; k++) { pt->fac[k][0] = FC[1][k] - FC[0][k]; pt->bias[k][0] = FC[0][k]; }
    } else if (!usePositions) {
        pt->gtype = 1;
        float gapCount = (float)(count - 1);
        for (int i = 0; i < count - 1; i++) {
            for (int k = 0; k < 4; k++) {
                float f = (FC[i + 1][k] - FC[i][k]) * gapCount;
                pt->fac[k][i] = f;
                pt->bias[k][i] = FC[i][k] - f * ((float)i / gapCount);
            }
        }
        for (int k = 0; k < 4; k++) { pt->fac[k][count - 1] = 0; pt->bias[k][count - 1] = FC[count - 1][k]; }
        pt->stopCount = count;
    } else {
        pt->gtype = 2;
        int firstStop, lastStop;
        if (count > 2) {
            firstStop = memcmp(FC[0], FC[1], sizeof FC[0]) ? 0 : 1;
            lastStop = memcmp(FC[count - 2], FC[count - 1], sizeof FC[0]) ? count - 1 : count - 2;
        } else { firstStop = 0; lastStop = 1; }
        int sc = 0;
        float t_l = FP[firstStop];
        float *c_l = FC[firstStop];
        for (int k = 0; k < 4; k++) { pt->fac[k][sc] = 0; pt->bias[k][sc] = c_l[k]; }
        sc++;
        for (int i = firstStop; i < lastStop; i++) {
            float t_r = FP[i + 1];
            float *c_r = FC[i + 1];
            if (t_l < t_r) {
                float c_scale = 1.0f / (t_r - t_l);
                if (isfinite(c_scale)) {
                    for (int k = 0; k < 4; k++) {
                        float f = (c_r[k] - c_l[k]) * c_scale;
                        pt->fac[k][sc] = f;
                        pt->bias[k][sc] = c_l[k] - f * t_l;
                    }
                    pt->ts[sc] = t_l;
                    sc++;
                }
            }
            t_l = t_r; c_l = c_r;
        }
        pt->ts[sc] = t_l;
        for (int k = 0; k < 4; k++) { pt->fac[k][sc] = 0; pt->bias[k][sc] = c_l[k]; }
        sc++;
        pt->stopCount = sc;
    }
    /* matrix: total = ptsToUnit * inverse(CTM * local) */
    M cm = {ctm->sx, ctm->kx, ctm->tx, ctm->ky, ctm->sy, ctm->ty};
    M tot = cm;
    if (!localIsIdentity) { M lm = {local->sx, local->kx, local->tx, local->ky, local->sy, local->ty}; tot = m_concat(&cm, &lm); }
    M inv;
    if (!m_invert(&tot, &inv)) return 0;
    M p2u = linear ? pts_to_unit(x1, y1, x2, y2) : rad_to_unit(cx, cy, r);
    M fin = m_concat(&p2u, &inv);
    pt->mtype = m_type(&fin);
    pt->m[0] = fin.sx; pt->m[1] = fin.kx; pt->m[2] = fin.tx; pt->m[3] = fin.ky; pt->m[4] = fin.sy; pt->m[5] = fin.ty;
    return 1;
}

/* the pipeline math, compiled for baseline x86-64 (fmaf libcall) and for FMA hardware (same results,
 * fmaf is exact either way); dispatched at run time */
#include <immintrin.h>
#define SFX(n) n##_base
#define ROUND_NE(s) lrintf(s)
#include "vr_grad_body.h"
#undef SFX
#undef ROUND_NE
#pragma GCC push_options
#pragma GCC target("fma,avx2")
#define SFX(n) n##_fma
#define ROUND_NE(s) _mm_cvtss_si32(_mm_set_ss(s))
#include "vr_grad_body.h"
#undef SFX
#undef ROUND_NE

/* 8 pixels at once (the HSW pipeline's own width); bit-identical to shade_fma per lane */
static inline __m256 mx0(__m256 v) { return _mm256_max_ps(_mm256_setzero_ps(), v); }     /* max(0, v) */
static inline __m256 mn(__m256 v, float m) { return _mm256_min_ps(v, _mm256_set1_ps(m)); } /* min(v, m) */
static void shade8_avx2(const Paint *p, int x, int y, float *sr, float *sg, float *sb) {
    const __m256 iota = _mm256_setr_ps(0.5f, 1.5f, 2.5f, 3.5f, 4.5f, 5.5f, 6.5f, 7.5f);
    __m256 X = _mm256_add_ps(_mm256_set1_ps((float)x), iota), Y = _mm256_set1_ps((float)y + 0.5f), R, G;
    switch (p->mtype) {
        case 0: R = X; G = Y; break;
        case 1: R = _mm256_add_ps(X, _mm256_set1_ps(p->m[2])); G = _mm256_add_ps(Y, _mm256_set1_ps(p->m[5])); break;
        case 2: R = _mm256_fmadd_ps(X, _mm256_set1_ps(p->m[0]), _mm256_set1_ps(p->m[2]));
                G = _mm256_fmadd_ps(Y, _mm256_set1_ps(p->m[4]), _mm256_set1_ps(p->m[5])); break;
        default:
            R = _mm256_fmadd_ps(X, _mm256_set1_ps(p->m[0]), _mm256_fmadd_ps(Y, _mm256_set1_ps(p->m[1]), _mm256_set1_ps(p->m[2])));
            G = _mm256_fmadd_ps(X, _mm256_set1_ps(p->m[3]), _mm256_fmadd_ps(Y, _mm256_set1_ps(p->m[4]), _mm256_set1_ps(p->m[5])));
    }
    __m256 t = R;
    if (p->radial) t = vr_grad_radius_fma ? _mm256_sqrt_ps(_mm256_fmadd_ps(R, R, _mm256_mul_ps(G, G)))
                                          : _mm256_sqrt_ps(_mm256_add_ps(_mm256_mul_ps(R, R), _mm256_mul_ps(G, G)));
    if (p->clampx) t = mn(mx0(t), 1.0f);
    __m256 c[3];
    if (p->gtype == 0) {
        for (int k = 0; k < 3; k++) c[k] = _mm256_fmadd_ps(t, _mm256_set1_ps(p->fac[k][0]), _mm256_set1_ps(p->bias[k][0]));
    } else {
        __m256i idx;
        if (p->gtype == 1) idx = _mm256_cvttps_epi32(_mm256_mul_ps(t, _mm256_set1_ps((float)(p->stopCount - 1))));
        else {
            idx = _mm256_setzero_si256();
            for (int i = 1; i < p->stopCount; i++)
                idx = _mm256_sub_epi32(idx, _mm256_castps_si256(_mm256_cmp_ps(t, _mm256_set1_ps(p->ts[i]), _CMP_GE_OQ)));
        }
        for (int k = 0; k < 3; k++)
            c[k] = _mm256_fmadd_ps(t, _mm256_i32gather_ps(p->fac[k], idx, 4), _mm256_i32gather_ps(p->bias[k], idx, 4));
    }
    if (p->dither > 0) {
        __m256i ux = _mm256_add_epi32(_mm256_set1_epi32(x), _mm256_setr_epi32(0, 1, 2, 3, 4, 5, 6, 7));
        __m256i uy = _mm256_xor_si256(_mm256_set1_epi32(y), ux);
        __m256i one = _mm256_set1_epi32(1), two = _mm256_set1_epi32(2), four = _mm256_set1_epi32(4);
        __m256i M = _mm256_or_si256(
            _mm256_or_si256(_mm256_slli_epi32(_mm256_and_si256(uy, one), 5), _mm256_slli_epi32(_mm256_and_si256(ux, one), 4)),
            _mm256_or_si256(
                _mm256_or_si256(_mm256_slli_epi32(_mm256_and_si256(uy, two), 2), _mm256_slli_epi32(_mm256_and_si256(ux, two), 1)),
                _mm256_or_si256(_mm256_srli_epi32(_mm256_and_si256(uy, four), 1), _mm256_srli_epi32(_mm256_and_si256(ux, four), 2))));
        __m256 d = _mm256_fmadd_ps(_mm256_cvtepi32_ps(M), _mm256_set1_ps(2 / 128.0f), _mm256_set1_ps(-63 / 128.0f));
        __m256 rate = _mm256_set1_ps(p->dither);
        for (int k = 0; k < 3; k++) c[k] = mx0(mn(_mm256_fmadd_ps(d, rate, c[k]), 1.0f));
    }
    _mm256_storeu_ps(sr, mn(mx0(c[0]), 1.0f));
    _mm256_storeu_ps(sg, mn(mx0(c[1]), 1.0f));
    _mm256_storeu_ps(sb, mn(mx0(c[2]), 1.0f));
}
static void grad_blend_span_avx2(const Paint *p, Canvas *c, int x, int y, int n, const uint8_t *cov, int mode, int constval) {
    uint8_t *d = c->px + 3 * ((size_t)(y - c->oy) * c->stride + (x - c->ox));
    float sr[8], sg[8], sb[8];
    for (int i0 = 0; i0 < n; i0 += 8) {
        int nn = n - i0 < 8 ? n - i0 : 8;
        if (mode == GB_ANTIH) {   /* skip all-zero chunks quickly */
            int any = 0;
            for (int j = 0; j < nn; j++) any |= cov[i0 + j];
            if (!any) { d += 3 * nn; continue; }
        }
        shade8_avx2(p, x + i0, y, sr, sg, sb);
        if (mode == GB_FULL) {   /* to_unorm for 8 pixels at once (same ops as to_unorm_fma) */
            int32_t q[3][8];
            const float *src[3] = {sr, sg, sb};
            for (int k = 0; k < 3; k++) {
                __m256 v = _mm256_fmadd_ps(_mm256_loadu_ps(src[k]), _mm256_set1_ps(255.0f), _mm256_setzero_ps());
                v = mn(mx0(v), 255.0f);
                _mm256_storeu_si256((__m256i *)q[k], _mm256_cvtps_epi32(v));
            }
            for (int j = 0; j < nn; j++, d += 3) { d[0] = (uint8_t)q[0][j]; d[1] = (uint8_t)q[1][j]; d[2] = (uint8_t)q[2][j]; }
            continue;
        }
        for (int j = 0; j < nn; j++, d += 3) {
            int a;
            if (mode == GB_FULL) a = 256;
            else a = cov ? cov[i0 + j] : constval;
            if (mode == GB_ANTIH) { if (a == 0) continue; if (a == 255) a = 256; }
            float s[3] = {sr[j], sg[j], sb[j]};
            if (a == 256) { d[0] = to_unorm_fma(s[0]); d[1] = to_unorm_fma(s[1]); d[2] = to_unorm_fma(s[2]); continue; }
            float cf = (float)a * (1 / 255.0f);
            for (int k = 0; k < 3; k++) {
                float dv = (float)d[k] * (1 / 255.0f);
                d[k] = to_unorm_fma(fmaf(s[k] - dv, cf, dv));
            }
        }
    }
}
#pragma GCC pop_options

int vr_use_fma = -1;
void grad_blend_span(const Paint *p, Canvas *c, int x, int y, int n, const uint8_t *cov, int mode, int constval) {
    if (vr_use_fma < 0) { __builtin_cpu_init(); vr_use_fma = (__builtin_cpu_supports("fma") && __builtin_cpu_supports("avx2")) ? 2 : 0; }
    if (vr_use_fma == 2) grad_blend_span_avx2(p, c, x, y, n, cov, mode, constval);
    else if (vr_use_fma) grad_blend_span_fma(p, c, x, y, n, cov, mode, constval);
    else grad_blend_span_base(p, c, x, y, n, cov, mode, constval);
}
