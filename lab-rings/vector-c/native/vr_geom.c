/* vr_geom.c -- SkGeometry / SkMatrix / SkPath(Builder) subset, ported to C (float math kept
 * in the same evaluation order as Skia; build with -ffp-contract=off). */
#include "vr.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>

/* ------------------------------------------------------------------ helpers */
static int is_not_monotonic(float a, float b, float c) {
    float ab = a - b, bc = b - c;
    if (ab < 0) bc = -bc;
    return ab == 0 || bc < 0;
}

static int valid_unit_divide(float numer, float denom, float *ratio) {
    if (numer < 0) { numer = -numer; denom = -denom; }
    if (denom == 0 || numer == 0 || numer >= denom) return 0;
    float r = numer / denom;
    if (isnan(r)) return 0;
    if (r == 0) return 0;
    *ratio = r;
    return 1;
}

int find_unit_quad_roots(float A, float B, float C, float roots[2]) {
    if (A == 0) return valid_unit_divide(-C, B, roots);
    float *r = roots;
    double dr = (double)B * B - 4 * (double)A * C;
    if (dr < 0) return 0;
    dr = sqrt(dr);
    float R = (float)dr;
    if (!isfinite(R)) return 0;
    float Q = (B < 0) ? -(B - R) / 2 : -(B + R) / 2;
    r += valid_unit_divide(Q, A, r);
    r += valid_unit_divide(C, Q, r);
    if (r - roots == 2) {
        if (roots[0] > roots[1]) { float t = roots[0]; roots[0] = roots[1]; roots[1] = t; }
        else if (roots[0] == roots[1]) r -= 1;
    }
    return (int)(r - roots);
}

static inline Pt interp(Pt a, Pt b, float t) {
    Pt r; r.x = a.x + (b.x - a.x) * t; r.y = a.y + (b.y - a.y) * t; return r;
}

void chop_quad_at(const Pt src[3], Pt dst[5], float t) {
    Pt p0 = src[0], p1 = src[1], p2 = src[2];
    Pt p01 = interp(p0, p1, t), p12 = interp(p1, p2, t);
    dst[0] = p0; dst[1] = p01; dst[2] = interp(p01, p12, t); dst[3] = p12; dst[4] = p2;
}

int chop_quad_at_y_extrema(const Pt src[3], Pt dst[5]) {
    float a = src[0].y, b = src[1].y, c = src[2].y;
    if (is_not_monotonic(a, b, c)) {
        float tv;
        if (valid_unit_divide(a - b, a - b - b + c, &tv)) {
            chop_quad_at(src, dst, tv);
            dst[1].y = dst[3].y = dst[2].y;
            return 1;
        }
        b = fabsf(a - b) < fabsf(b - c) ? a : c;
    }
    dst[0].x = src[0].x; dst[0].y = a;
    dst[1].x = src[1].x; dst[1].y = b;
    dst[2].x = src[2].x; dst[2].y = c;
    return 0;
}

int chop_quad_at_x_extrema(const Pt src[3], Pt dst[5]) {
    float a = src[0].x, b = src[1].x, c = src[2].x;
    if (is_not_monotonic(a, b, c)) {
        float tv;
        if (valid_unit_divide(a - b, a - b - b + c, &tv)) {
            chop_quad_at(src, dst, tv);
            dst[1].x = dst[3].x = dst[2].x;
            return 1;
        }
        b = fabsf(a - b) < fabsf(b - c) ? a : c;
    }
    dst[0].x = a; dst[0].y = src[0].y;
    dst[1].x = b; dst[1].y = src[1].y;
    dst[2].x = c; dst[2].y = src[2].y;
    return 0;
}

static int find_cubic_extrema(float a, float b, float c, float d, float tv[2]) {
    float A = d - a + 3 * (b - c);
    float B = 2 * (a - b - b + c);
    float C = b - a;
    return find_unit_quad_roots(A, B, C, tv);
}

static inline float umix(float a, float b, float t) { return (b - a) * t + a; }
static inline Pt umixp(Pt a, Pt b, float t) { Pt r; r.x = umix(a.x, b.x, t); r.y = umix(a.y, b.y, t); return r; }

void chop_cubic_at(const Pt src[4], Pt dst[7], float t) {
    if (t == 1) {
        memcpy(dst, src, sizeof(Pt) * 4);
        dst[4] = dst[5] = dst[6] = src[3];
        return;
    }
    Pt p0 = src[0], p1 = src[1], p2 = src[2], p3 = src[3];
    Pt ab = umixp(p0, p1, t), bc = umixp(p1, p2, t), cd = umixp(p2, p3, t);
    Pt abc = umixp(ab, bc, t), bcd = umixp(bc, cd, t), abcd = umixp(abc, bcd, t);
    dst[0] = p0; dst[1] = ab; dst[2] = abc; dst[3] = abcd; dst[4] = bcd; dst[5] = cd; dst[6] = p3;
}

static void chop_cubic_at2(const Pt src[4], Pt dst[10], float t0, float t1) {
    if (t1 == 1) {
        chop_cubic_at(src, dst, t0);
        dst[7] = dst[8] = dst[9] = src[3];
        return;
    }
    Pt p0 = src[0], p1 = src[1], p2 = src[2], p3 = src[3];
    Pt ab0 = umixp(p0, p1, t0), bc0 = umixp(p1, p2, t0), cd0 = umixp(p2, p3, t0);
    Pt ab1 = umixp(p0, p1, t1), bc1 = umixp(p1, p2, t1), cd1 = umixp(p2, p3, t1);
    Pt abc0 = umixp(ab0, bc0, t0), bcd0 = umixp(bc0, cd0, t0);
    Pt abc1 = umixp(ab1, bc1, t1), bcd1 = umixp(bc1, cd1, t1);
    Pt abcd0 = umixp(abc0, bcd0, t0), abcd1 = umixp(abc1, bcd1, t1);
    Pt mid0 = umixp(abc0, bcd0, t1), mid1 = umixp(abc1, bcd1, t0);
    dst[0] = p0; dst[1] = ab0; dst[2] = abc0; dst[3] = abcd0;
    dst[4] = mid0; dst[5] = mid1;
    dst[6] = abcd1; dst[7] = bcd1; dst[8] = cd1; dst[9] = p3;
}

static void chop_cubic_at_n(const Pt src[4], Pt dst[], const float tv[], int n) {
    if (n == 0) { memcpy(dst, src, 4 * sizeof(Pt)); return; }
    if (n == 2) { chop_cubic_at2(src, dst, tv[0], tv[1]); return; }
    chop_cubic_at(src, dst, tv[0]);
}

int chop_cubic_at_y_extrema(const Pt src[4], Pt dst[10]) {
    float tv[2];
    int roots = find_cubic_extrema(src[0].y, src[1].y, src[2].y, src[3].y, tv);
    chop_cubic_at_n(src, dst, tv, roots);
    if (roots > 0) {
        dst[2].y = dst[4].y = dst[3].y;
        if (roots == 2) dst[5].y = dst[7].y = dst[6].y;
    }
    return roots;
}

int chop_cubic_at_x_extrema(const Pt src[4], Pt dst[10]) {
    float tv[2];
    int roots = find_cubic_extrema(src[0].x, src[1].x, src[2].x, src[3].x, tv);
    chop_cubic_at_n(src, dst, tv, roots);
    if (roots > 0) {
        dst[2].x = dst[4].x = dst[3].x;
        if (roots == 2) dst[5].x = dst[7].x = dst[6].x;
    }
    return roots;
}

/* ------------------------------------------------------------------ conics */
typedef struct { Pt p[3]; float w; } Conic;

static void conic_chop(const Conic *c, Conic dst[2]) {   /* SK_SUPPORT_LEGACY_CONIC_CHOP */
    float scale = 1.0f / (1.0f + c->w);
    float newW = sqrtf(0.5f + c->w * 0.5f);
    Pt p0 = c->p[0], p1 = c->p[1], p2 = c->p[2];
    float ww = c->w;
    Pt wp1 = { ww * p1.x, ww * p1.y };
    Pt m;
    m.x = (p0.x + (wp1.x + wp1.x) + p2.x) * scale * 0.5f;
    m.y = (p0.y + (wp1.y + wp1.y) + p2.y) * scale * 0.5f;
    if (!isfinite(m.x) || !isfinite(m.y)) {
        double w_d = c->w, w_2 = w_d * 2, sh = 1 / (1 + w_d) * 0.5;
        m.x = (float)((c->p[0].x + w_2 * c->p[1].x + c->p[2].x) * sh);
        m.y = (float)((c->p[0].y + w_2 * c->p[1].y + c->p[2].y) * sh);
    }
    dst[0].p[0] = c->p[0];
    dst[0].p[1].x = (p0.x + wp1.x) * scale; dst[0].p[1].y = (p0.y + wp1.y) * scale;
    dst[0].p[2] = dst[1].p[0] = m;
    dst[1].p[1].x = (wp1.x + p2.x) * scale; dst[1].p[1].y = (wp1.y + p2.y) * scale;
    dst[1].p[2] = c->p[2];
    dst[0].w = dst[1].w = newW;
}

static int conic_quad_pow2(const Conic *c, float tol) {
    if (tol < 0 || !isfinite(tol)) return 0;
    for (int i = 0; i < 3; i++) if (!isfinite(c->p[i].x) || !isfinite(c->p[i].y)) return 0;
    float a = c->w - 1;
    float k = a / (4 * (2 + a));
    float x = k * (c->p[0].x - 2 * c->p[1].x + c->p[2].x);
    float y = k * (c->p[0].y - 2 * c->p[1].y + c->p[2].y);
    float error = sqrtf(x * x + y * y);
    int pow2;
    for (pow2 = 0; pow2 < 5; ++pow2) {
        if (error <= tol) break;
        error *= 0.25f;
    }
    return pow2;
}

static int between(float a, float b, float c) { return (a - b) * (c - b) <= 0; }

static Pt *conic_subdivide(const Conic *src, Pt *pts, int level) {
    if (level == 0) {
        pts[0] = src->p[1]; pts[1] = src->p[2];
        return pts + 2;
    }
    Conic dst[2];
    conic_chop(src, dst);
    float startY = src->p[0].y, endY = src->p[2].y;
    if (between(startY, src->p[1].y, endY)) {
        float midY = dst[0].p[2].y;
        if (!between(startY, midY, endY)) {
            float closerY = fabsf(midY - startY) < fabsf(midY - endY) ? startY : endY;
            dst[0].p[2].y = dst[1].p[0].y = closerY;
        }
        if (!between(startY, dst[0].p[1].y, dst[0].p[2].y)) dst[0].p[1].y = startY;
        if (!between(dst[1].p[0].y, dst[1].p[1].y, endY)) dst[1].p[1].y = endY;
    }
    --level;
    pts = conic_subdivide(&dst[0], pts, level);
    return conic_subdivide(&dst[1], pts, level);
}

int conic_to_quads(const Pt in[3], float w, float tol, Pt *pts) {
    Conic c; c.p[0] = in[0]; c.p[1] = in[1]; c.p[2] = in[2]; c.w = w;
    int pow2 = conic_quad_pow2(&c, tol);
    pts[0] = c.p[0];
    if (pow2 == 5) {
        Conic dst[2];
        conic_chop(&c, dst);
        if (dst[0].p[1].x == dst[0].p[2].x && dst[0].p[1].y == dst[0].p[2].y &&
            dst[1].p[0].x == dst[1].p[1].x && dst[1].p[0].y == dst[1].p[1].y) {
            pts[1] = pts[2] = pts[3] = dst[0].p[1];
            pts[4] = dst[1].p[2];
            pow2 = 1;
            goto check;
        }
    }
    conic_subdivide(&c, pts + 1, pow2);
check:;
    int qc = 1 << pow2, pc = 2 * qc + 1;
    for (int i = 0; i < pc; i++) {
        if (!isfinite(pts[i].x) || !isfinite(pts[i].y)) {
            for (int j = 1; j < pc - 1; j++) pts[j] = c.p[1];
            break;
        }
    }
    return qc;
}

/* ------------------------------------------------------------------ matrix */
void mat_identity(Mat *m) { m->sx = 1; m->kx = 0; m->tx = 0; m->ky = 0; m->sy = 1; m->ty = 0; }
int mat_is_identity(const Mat *m) { return m->sx == 1 && m->kx == 0 && m->tx == 0 && m->ky == 0 && m->sy == 1 && m->ty == 0; }
int mat_is_translate(const Mat *m) { return m->sx == 1 && m->kx == 0 && m->ky == 0 && m->sy == 1; }
int mat_rect_stays_rect(const Mat *m) {
    if (m->kx == 0 && m->ky == 0) return m->sx != 0 && m->sy != 0;
    if (m->sx == 0 && m->sy == 0) return m->kx != 0 && m->ky != 0;
    return 0;
}
static double dmuladdmul(float a, float b, float c, float d) { return (double)a * b + (double)c * d; }
void mat_concat(Mat *out, const Mat *a, const Mat *b) {
    Mat t;
    if (mat_is_identity(a)) { *out = *b; return; }
    if (mat_is_identity(b)) { *out = *a; return; }
    if (a->kx == 0 && a->ky == 0 && b->kx == 0 && b->ky == 0) {
        t.sx = a->sx * b->sx; t.sy = a->sy * b->sy;
        t.tx = a->sx * b->tx + a->tx; t.ty = a->sy * b->ty + a->ty;
        t.kx = t.ky = 0;
        *out = t; return;
    }
    t.sx = (float)dmuladdmul(a->sx, b->sx, a->kx, b->ky);
    t.kx = (float)dmuladdmul(a->sx, b->kx, a->kx, b->sy);
    t.tx = (float)dmuladdmul(a->sx, b->tx, a->kx, b->ty) + a->tx;
    t.ky = (float)dmuladdmul(a->ky, b->sx, a->sy, b->ky);
    t.sy = (float)dmuladdmul(a->ky, b->kx, a->sy, b->sy);
    t.ty = (float)dmuladdmul(a->ky, b->tx, a->sy, b->ty) + a->ty;
    *out = t;
}
static float sin_snap(float r) { float v = sinf(r); return fabsf(v) <= 1.0f / (1 << 16) ? 0.0f : v; }
static float cos_snap(float r) { float v = cosf(r); return fabsf(v) <= 1.0f / (1 << 16) ? 0.0f : v; }
void mat_set_rotate(Mat *m, float deg) {
    float rad = deg * (3.14159265f / 180);
    float s = sin_snap(rad), c = cos_snap(rad);
    m->sx = c; m->kx = -s; m->tx = 0; m->ky = s; m->sy = c; m->ty = 0;
}
void mat_map(const Mat *m, Pt *dst, const Pt *src, int n) {
    for (int i = 0; i < n; i++) {
        float x = src[i].x, y = src[i].y;
        dst[i].x = x * m->sx + y * m->kx + m->tx;
        dst[i].y = y * m->sy + x * m->ky + m->ty;
    }
}

/* ------------------------------------------------------------------ path */
void path_init(Path *p) { memset(p, 0, sizeof *p); p->convex = -1; p->lastMoveIndex = -1; }
void path_free(Path *p) { free(p->pts); free(p->verbs); free(p->w); path_init(p); }
void path_reset(Path *p) {
    p->npts = p->nverbs = p->nw = 0; p->fill = 0; p->convex = -1; p->needsMove = 0;
    p->lastMove.x = p->lastMove.y = 0; p->lastMoveIndex = -1;
}
static void grow(void **buf, int *cap, int need, size_t el) {
    if (need <= *cap) return;
    int nc = *cap ? *cap : 16;
    while (nc < need) nc *= 2;
    *buf = realloc(*buf, nc * el); *cap = nc;
}
static void push_pt(Path *p, Pt a) { grow((void **)&p->pts, &p->cappts, p->npts + 1, sizeof(Pt)); p->pts[p->npts++] = a; }
static void push_verb(Path *p, int v) { grow((void **)&p->verbs, &p->capverbs, p->nverbs + 1, 1); p->verbs[p->nverbs++] = (uint8_t)v; }
static void push_w(Path *p, float w) { grow((void **)&p->w, &p->capw, p->nw + 1, sizeof(float)); p->w[p->nw++] = w; }

void path_move(Path *p, Pt a) {
    if (p->nverbs && p->verbs[p->nverbs - 1] == V_MOVE) {
        p->pts[p->npts - 1] = a;
    } else {
        p->lastMoveIndex = p->npts;
        push_pt(p, a); push_verb(p, V_MOVE);
        p->needsMove = 0;
    }
    p->convex = -1;
    p->lastMove = a;
}
static void ensure_move(Path *p) { if (p->needsMove) path_move(p, p->lastMove); }
void path_line(Path *p, Pt a) { ensure_move(p); push_pt(p, a); push_verb(p, V_LINE); p->convex = -1; }
void path_quad(Path *p, Pt a, Pt b) { ensure_move(p); push_pt(p, a); push_pt(p, b); push_verb(p, V_QUAD); p->convex = -1; }
void path_conic(Path *p, Pt a, Pt b, float w) { ensure_move(p); push_pt(p, a); push_pt(p, b); push_verb(p, V_CONIC); push_w(p, w); p->convex = -1; }
void path_cubic(Path *p, Pt a, Pt b, Pt c) { ensure_move(p); push_pt(p, a); push_pt(p, b); push_pt(p, c); push_verb(p, V_CUBIC); p->convex = -1; }
void path_close(Path *p) {
    if (p->nverbs && p->verbs[p->nverbs - 1] != V_CLOSE) {
        ensure_move(p);
        push_verb(p, V_CLOSE);
        p->needsMove = 1;
    }
}
Pt path_last_pt(const Path *p) { Pt z = {0, 0}; return p->npts ? p->pts[p->npts - 1] : z; }

void path_append(Path *dst, const Path *src) {
    int pi = 0, wi = 0;
    for (int i = 0; i < src->nverbs; i++) {
        switch (src->verbs[i]) {
            case V_MOVE: path_move(dst, src->pts[pi]); pi += 1; break;
            case V_LINE: path_line(dst, src->pts[pi]); pi += 1; break;
            case V_QUAD: path_quad(dst, src->pts[pi], src->pts[pi + 1]); pi += 2; break;
            case V_CONIC: path_conic(dst, src->pts[pi], src->pts[pi + 1], src->w[wi++]); pi += 2; break;
            case V_CUBIC: path_cubic(dst, src->pts[pi], src->pts[pi + 1], src->pts[pi + 2]); pi += 3; break;
            case V_CLOSE: path_close(dst); break;
        }
    }
}

static void rect_pts(float l, float t, float r, float b, Pt q[4]) {
    q[0].x = l; q[0].y = t; q[1].x = r; q[1].y = t; q[2].x = r; q[2].y = b; q[3].x = l; q[3].y = b;
}

void path_add_rect(Path *p, float l, float t, float r, float b, int ccw, unsigned index) {
    int wasEmpty = p->nverbs == 0;
    Pt q[4]; rect_pts(l, t, r, b, q);
    unsigned adv = ccw ? 3 : 1, cur = index % 4;
    path_move(p, q[cur]);
    for (int i = 0; i < 3; i++) { cur = (cur + adv) % 4; path_line(p, q[cur]); }
    path_close(p);
    if (wasEmpty) p->convex = 1;
}

void path_add_oval(Path *p, float l, float t, float r, float b, int ccw, unsigned index) {
    int wasEmpty = p->nverbs == 0;
    float cx = (float)(0.5 * ((double)l + r)), cy = (float)(0.5 * ((double)t + b));   /* sk_float_midpoint */
    Pt ov[4] = {{cx, t}, {r, cy}, {cx, b}, {l, cy}};
    Pt rc[4]; rect_pts(l, t, r, b, rc);
    unsigned adv = ccw ? 3 : 1;
    unsigned oc = index % 4, rcur = (index + (ccw ? 1 : 0)) % 4;
    path_move(p, ov[oc]);
    for (int i = 0; i < 4; i++) {
        rcur = (rcur + adv) % 4; oc = (oc + adv) % 4;
        path_conic(p, rc[rcur], ov[oc], 0.707106781f);
    }
    path_close(p);
    if (wasEmpty) p->convex = 1;
}

/* Blink FloatRoundedRect -> SkRRect::setRectRadii (uniform radii) -> addRRect */
static void adjust_radii(double limit, double scale, float *a, float *b) {
    *a = (float)((double)*a * scale);
    *b = (float)((double)*b * scale);
    if (*a + *b > limit) {
        float *mn = a, *mx = b;
        if (*mn > *mx) { float *t = mn; mn = mx; mx = t; }
        float nmin = *mn, nmax = (float)(limit - nmin);
        while (nmax + nmin > limit) nmax = nextafterf(nmax, 0.0f);
        *mx = nmax;
    }
}
static void flush_to_zero(float *a, float *b) { if (*a + *b == *a) *b = 0; else if (*a + *b == *b) *a = 0; }
void path_add_rrect(Path *p, float l, float t, float r, float b, float rx, float ry, int ccw, unsigned index) {
    if (!(r - l > 0 && b - t > 0)) return;
    if (rx <= 0 || ry <= 0) { path_add_rect(p, l, t, r, b, ccw, (index + 1) / 2); return; }
    float rad[4][2] = {{rx, ry}, {rx, ry}, {rx, ry}, {rx, ry}};
    double scale = 1.0, width = (double)r - (double)l, height = (double)b - (double)t;
    #define CMS(a1, a2, lim) if (((double)(a1) + (double)(a2)) > (lim)) { double q = (lim) / ((double)(a1) + (double)(a2)); if (q < scale) scale = q; }
    CMS(rad[0][0], rad[1][0], width); CMS(rad[1][1], rad[2][1], height);
    CMS(rad[2][0], rad[3][0], width); CMS(rad[3][1], rad[0][1], height);
    flush_to_zero(&rad[0][0], &rad[1][0]); flush_to_zero(&rad[1][1], &rad[2][1]);
    flush_to_zero(&rad[2][0], &rad[3][0]); flush_to_zero(&rad[3][1], &rad[0][1]);
    if (scale < 1.0) {
        adjust_radii(width, scale, &rad[0][0], &rad[1][0]); adjust_radii(height, scale, &rad[1][1], &rad[2][1]);
        adjust_radii(width, scale, &rad[2][0], &rad[3][0]); adjust_radii(height, scale, &rad[3][1], &rad[0][1]);
    }
    int square = 1, equal = 1;
    for (int i = 0; i < 4; i++) { if (rad[i][0] <= 0 || rad[i][1] <= 0) rad[i][0] = rad[i][1] = 0; else square = 0; }
    for (int i = 1; i < 4; i++) if (rad[i][0] != rad[i-1][0] || rad[i][1] != rad[i-1][1]) equal = 0;
    if (square) { path_add_rect(p, l, t, r, b, ccw, (index + 1) / 2); return; }
    if (equal && rad[0][0] >= 0.5f * (r - l) && rad[0][1] >= 0.5f * (b - t)) { path_add_oval(p, l, t, r, b, ccw, index / 2); return; }
    /* corner order: UL, UR, LR, LL */
    float ulx = rad[0][0], uly = rad[0][1], urx = rad[1][0], ury = rad[1][1];
    float lrx = rad[2][0], lry = rad[2][1], llx = rad[3][0], lly = rad[3][1];
    int wasEmpty = p->nverbs == 0;
    Pt rr[8] = {{l + ulx, t}, {r - urx, t}, {r, t + ury}, {r, b - lry}, {r - lrx, b}, {l + llx, b}, {l, b - lly}, {l, t + uly}};
    Pt rc[4]; rect_pts(l, t, r, b, rc);
    int startsWithConic = ((index & 1) == (ccw ? 0 : 1));
    unsigned adv8 = ccw ? 7 : 1, adv4 = ccw ? 3 : 1;
    unsigned ri = index % 8, ci = (index / 2 + (ccw ? 1 : 0)) % 4;
    const float wq = 0.707106781f;
    path_move(p, rr[ri]);
    if (startsWithConic) {
        for (int i = 0; i < 3; i++) {
            ci = (ci + adv4) % 4; ri = (ri + adv8) % 8;
            Pt c1 = rc[ci], e1 = rr[ri];
            path_conic(p, c1, e1, wq);
            ri = (ri + adv8) % 8;
            path_line(p, rr[ri]);
        }
        ci = (ci + adv4) % 4; ri = (ri + adv8) % 8;
        path_conic(p, rc[ci], rr[ri], wq);
    } else {
        for (int i = 0; i < 4; i++) {
            ri = (ri + adv8) % 8;
            path_line(p, rr[ri]);
            ci = (ci + adv4) % 4; ri = (ri + adv8) % 8;
            path_conic(p, rc[ci], rr[ri], wq);
        }
    }
    path_close(p);
    if (wasEmpty) p->convex = 1;
}

/* SkPathBuilder::arcTo(SVG) */
void path_svg_arc(Path *p, float radx, float rady, float angle, int large, int sweepCW, Pt endPt) {
    ensure_move(p);
    Pt src0 = path_last_pt(p), src1 = endPt;
    if (!radx || !rady) { path_line(p, endPt); return; }
    if (src0.x == src1.x && src0.y == src1.y) { path_line(p, endPt); return; }
    float rx = fabsf(radx), ry = fabsf(rady);
    Pt mpd = { (src0.x - src1.x) * 0.5f, (src0.y - src1.y) * 0.5f };
    Mat pt; mat_set_rotate(&pt, -angle);
    Pt tmp; mat_map(&pt, &tmp, &mpd, 1);
    float sqRx = rx * rx, sqRy = ry * ry, sqX = tmp.x * tmp.x, sqY = tmp.y * tmp.y;
    float radiiScale = sqX / sqRx + sqY / sqRy;
    if (radiiScale > 1) { radiiScale = sqrtf(radiiScale); rx *= radiiScale; ry *= radiiScale; }
    Mat sc = {1 / rx, 0, 0, 0, 1 / ry, 0}, rot; mat_set_rotate(&rot, -angle);
    if (sc.sx == 1 && sc.sy == 1) mat_identity(&sc);
    if (!mat_is_identity(&rot)) mat_concat(&pt, &sc, &rot); else pt = sc;
    Pt sp[2] = {src0, src1}, up[2];
    mat_map(&pt, up, sp, 2);
    Pt delta = { up[1].x - up[0].x, up[1].y - up[0].y };
    float d = delta.x * delta.x + delta.y * delta.y;
    float sfs = fmaxf(1 / d - 0.25f, 0.f);
    float sf = sqrtf(sfs);
    if ((!sweepCW) != (large != 0)) sf = -sf;
    delta.x *= sf; delta.y *= sf;
    Pt center = { up[0].x + up[1].x, up[0].y + up[1].y };
    center.x *= 0.5f; center.y *= 0.5f;
    center.x += -delta.y; center.y += delta.x;
    up[0].x -= center.x; up[0].y -= center.y; up[1].x -= center.x; up[1].y -= center.y;
    float theta1 = atan2f(up[0].y, up[0].x), theta2 = atan2f(up[1].y, up[1].x);
    float thetaArc = theta2 - theta1;
    const float PI = 3.14159265f;
    if (thetaArc < 0 && sweepCW) thetaArc += PI * 2;
    else if (thetaArc > 0 && !sweepCW) thetaArc -= PI * 2;
    if (fabsf(thetaArc) < (PI / (1000 * 1000))) { path_line(p, endPt); return; }
    mat_set_rotate(&rot, angle);
    Mat sc2 = {rx, 0, 0, 0, ry, 0};
    if (!(rx == 1 && ry == 1)) {    /* preScale: column multiply */
        Mat r2 = rot;
        r2.sx *= rx; r2.ky *= rx; r2.kx *= ry; r2.sy *= ry;
        pt = r2;
    } else pt = rot;
    (void)sc2;
    int segments = (int)ceilf(fabsf(thetaArc / (2 * PI / 3)));
    float thetaWidth = thetaArc / segments;
    float t = tanf(0.5f * thetaWidth);
    if (!isfinite(t)) return;
    float startTheta = theta1;
    float w = sqrtf(0.5f + cosf(thetaWidth) * 0.5f);
    #define ISINT(v) ((v) == floorf(v))
    int expectIntegers = fabsf(PI / 2 - fabsf(thetaWidth)) <= 1.0f / (1 << 12) &&
        ISINT(rx) && ISINT(ry) && ISINT(endPt.x) && ISINT(endPt.y);
    for (int i = 0; i < segments; ++i) {
        float endTheta = startTheta + thetaWidth;
        float sinE = sin_snap(endTheta), cosE = cos_snap(endTheta);
        Pt u[2];
        u[1].x = cosE + center.x; u[1].y = sinE + center.y;
        u[0] = u[1]; u[0].x += t * sinE; u[0].y += -t * cosE;
        Pt mp[2]; mat_map(&pt, mp, u, 2);
        if (expectIntegers) for (int k = 0; k < 2; k++) { mp[k].x = (float)floor((double)mp[k].x + 0.5); mp[k].y = (float)floor((double)mp[k].y + 0.5); }
        path_conic(p, mp[0], mp[1], w);
        startTheta = endTheta;
    }
    p->pts[p->npts - 1] = endPt;
}

int path_bounds(const Path *p, float *l, float *t, float *r, float *b) {
    if (p->npts == 0) { *l = *t = *r = *b = 0; return 0; }
    float L = p->pts[0].x, T = p->pts[0].y, R = L, B = T;
    for (int i = 1; i < p->npts; i++) {
        float x = p->pts[i].x, y = p->pts[i].y;
        if (x < L) L = x; if (x > R) R = x; if (y < T) T = y; if (y > B) B = y;
    }
    *l = L; *t = T; *r = R; *b = B;
    return 1;
}

int path_segment_mask(const Path *p) {
    int m = 0;
    for (int i = 0; i < p->nverbs; i++) {
        int v = p->verbs[i];
        if (v == V_LINE) m |= 1; else if (v == V_QUAD) m |= 2; else if (v == V_CONIC) m |= 4; else if (v == V_CUBIC) m |= 8;
    }
    return m;
}

static int axis_aligned(const Path *p) {
    for (int i = 1; i < p->npts; ++i)
        if (p->pts[i - 1].x != p->pts[i].x && p->pts[i - 1].y != p->pts[i].y) return 0;
    return 1;
}
void path_transform(Path *p, const Mat *m) {
    if (mat_is_identity(m)) return;
    /* SkPath::transform: a known-convex path stays convex only for axis-aligned paths under
       scale/translate; concave stays concave; unknown stays unknown */
    int scaleTranslate = m->kx == 0 && m->ky == 0;
    if (p->convex == 1 && (!scaleTranslate || !axis_aligned(p))) p->convex = -1;
    mat_map(m, p->pts, p->pts, p->npts);
    p->lastMove.x = p->lastMove.y = 0;
}

/* ---- convexity (SkPath::computeConvexity) */
typedef struct {
    Pt firstPt, firstVec, lastPt, lastVec;
    int expectedDir, firstDir, reversals, isFinite;
} Convexicator;
enum { DC_UNKNOWN, DC_LEFT, DC_RIGHT, DC_STRAIGHT, DC_BACKWARDS, DC_INVALID };
enum { FD_UNKNOWN, FD_CW, FD_CCW };

static void cx_setmove(Convexicator *c, Pt p) { c->firstPt = c->lastPt = p; c->expectedDir = DC_INVALID; }
static int cx_dirchange(Convexicator *c, Pt v) {
    float cross = c->lastVec.x * v.y - c->lastVec.y * v.x;
    if (!isfinite(cross)) return DC_UNKNOWN;
    if (cross == 0) return (c->lastVec.x * v.x + c->lastVec.y * v.y) < 0 ? DC_BACKWARDS : DC_STRAIGHT;
    return cross > 0 ? DC_RIGHT : DC_LEFT;
}
static int cx_addvec(Convexicator *c, Pt v) {
    int dir = cx_dirchange(c, v);
    switch (dir) {
        case DC_LEFT: case DC_RIGHT:
            if (c->expectedDir == DC_INVALID) {
                c->expectedDir = dir;
                c->firstDir = dir == DC_RIGHT ? FD_CW : FD_CCW;
            } else if (dir != c->expectedDir) {
                c->firstDir = FD_UNKNOWN;
                return 0;
            }
            c->lastVec = v;
            break;
        case DC_STRAIGHT: break;
        case DC_BACKWARDS: c->lastVec = v; return ++c->reversals < 3;
        case DC_UNKNOWN: return (c->isFinite = 0);
    }
    return 1;
}
static int cx_addpt(Convexicator *c, Pt p) {
    if (c->lastPt.x == p.x && c->lastPt.y == p.y) return 1;
    if (c->firstPt.x == c->lastPt.x && c->firstPt.y == c->lastPt.y && c->expectedDir == DC_INVALID &&
        c->lastVec.x == 0 && c->lastVec.y == 0) {
        c->lastVec.x = p.x - c->lastPt.x; c->lastVec.y = p.y - c->lastPt.y;
        c->firstVec = c->lastVec;
    } else {
        Pt v = { p.x - c->lastPt.x, p.y - c->lastPt.y };
        if (!cx_addvec(c, v)) return 0;
    }
    c->lastPt = p;
    return 1;
}
static int cx_close(Convexicator *c) { return cx_addpt(c, c->firstPt) && cx_addvec(c, c->firstVec); }

static int by_sign(const Pt *pts, int count) {
    if (count <= 3) return 1;
    const Pt *last = pts + count;
    Pt curr = *pts++, first = curr;
    int dxes = 0, dyes = 0, lastSx = 2, lastSy = 2;
    for (int outer = 0; outer < 2; ++outer) {
        while (pts != last) {
            float vx = pts->x - curr.x, vy = pts->y - curr.y;
            if (vx != 0 || vy != 0) {
                if (!isfinite(vx) || !isfinite(vy)) return -1;
                int sx = vx < 0, sy = vy < 0;
                dxes += (sx != lastSx); dyes += (sy != lastSy);
                if (dxes > 3 || dyes > 3) return 0;
                lastSx = sx; lastSy = sy;
            }
            curr = *pts++;
            if (outer) break;
        }
        pts = &first;
    }
    return 1;
}

static int compute_convexity(const Path *p) {
    for (int i = 0; i < p->npts; i++) if (!isfinite(p->pts[i].x) || !isfinite(p->pts[i].y)) return 0;
    int pointCount = p->npts;
    /* last moveTo index */
    int lastMove = -1, pi = 0;
    for (int i = 0; i < p->nverbs; i++) {
        int v = p->verbs[i];
        if (v == V_MOVE) { lastMove = pi; pi += 1; }
        else if (v == V_LINE) pi += 1; else if (v == V_QUAD || v == V_CONIC) pi += 2; else if (v == V_CUBIC) pi += 3;
    }
    if (lastMove >= 0) {
        if (lastMove == pointCount - 1) {
            int vi = p->nverbs - 1;
            while (vi > 0 && p->verbs[vi] == V_MOVE) { vi--; pointCount--; }
        } else if (lastMove != 0) {
            return 0;
        }
    }
    if (by_sign(p->pts, pointCount) != 1) return 0;
    int contourCount = 0, needsClose = 0;
    Convexicator st; memset(&st, 0, sizeof st); st.isFinite = 1; st.expectedDir = DC_INVALID;
    pi = 0;
    for (int i = 0; i < p->nverbs; i++) {
        int v = p->verbs[i];
        int npt = v == V_MOVE ? 1 : v == V_LINE ? 1 : (v == V_QUAD || v == V_CONIC) ? 2 : v == V_CUBIC ? 3 : 0;
        const Pt *pts = (v == V_MOVE) ? &p->pts[pi] : (pi > 0 ? &p->pts[pi - 1] : &p->pts[0]);
        if (contourCount == 0) {
            if (v == V_MOVE) cx_setmove(&st, pts[0]);
            else { contourCount++; needsClose = 1; }
        }
        if (contourCount == 1) {
            if (v == V_CLOSE || v == V_MOVE) {
                if (!cx_close(&st)) return 0;
                needsClose = 0;
                contourCount++;
            } else {
                for (int k = 1; k <= npt; ++k) if (!cx_addpt(&st, pts[k])) return 0;
            }
        } else if (contourCount > 1) {
            if (v != V_MOVE) return 0;
        }
        pi += npt;
    }
    if (needsClose && !cx_close(&st)) return 0;
    if (st.firstDir == FD_UNKNOWN) {
        float l, t, r, b; path_bounds(p, &l, &t, &r, &b);
        int empty = !(l < r && t < b);
        if (!empty) return st.reversals < 3 ? 1 : 0;
    }
    return 1;
}

int path_is_convex(Path *p) {
    if (p->convex < 0) p->convex = compute_convexity(p);
    return p->convex;
}

/* SkPathPriv::IsRectContour(allowPartial=false) */
static int rect_make_dir(float dx, float dy) { return ((0 != dx) << 0) | ((dx > 0 || dy > 0) << 1); }
int path_is_rect_ex(const Path *p, float *L, float *T, float *R, float *B, int *closedOut, int *ccwOut);
int path_is_rect(const Path *p, float *L, float *T, float *R, float *B) { return path_is_rect_ex(p, L, T, R, B, NULL, NULL); }
int path_is_rect_ex(const Path *p, float *L, float *T, float *R, float *B, int *closedOut, int *ccwOut) {
    if (p->npts < 4) return 0;
    int corners = 0;
    Pt lineStart = {0, 0}, firstCorner = {0, 0}, thirdCorner = {0, 0};
    const Pt *firstPt = NULL, *lastPt = NULL, *pts = p->pts;
    signed char dirs[5] = {-1, -1, -1, -1, -1};
    int closedOrMoved = 0, autoClose = 0;
    for (int vi = 0; vi < p->nverbs; vi++) {
        int verb = p->verbs[vi];
        switch (verb) {
            case V_CLOSE:
                autoClose = 1;
                /* fallthrough */
            case V_LINE: {
                if (verb != V_CLOSE) lastPt = pts;
                Pt lineEnd = verb == V_CLOSE ? *firstPt : *pts++;
                float dx = lineEnd.x - lineStart.x, dy = lineEnd.y - lineStart.y;
                if (dx && dy) return 0;
                if (!isfinite(dx) || !isfinite(dy)) return 0;
                if (lineStart.x == lineEnd.x && lineStart.y == lineEnd.y) break;
                int nd = rect_make_dir(dx, dy);
                if (corners == 0) { dirs[0] = nd; corners = 1; closedOrMoved = 0; lineStart = lineEnd; break; }
                if (closedOrMoved) return 0;
                if (autoClose && nd == dirs[0]) break;
                closedOrMoved = autoClose;
                if (dirs[corners - 1] == nd) {
                    if (corners == 3 && verb == V_LINE) thirdCorner = lineEnd;
                    lineStart = lineEnd; break;
                }
                dirs[corners++] = nd;
                switch (corners) {
                    case 2: firstCorner = lineStart; break;
                    case 3: if ((dirs[0] ^ dirs[2]) != 2) return 0; thirdCorner = lineEnd; break;
                    case 4: if ((dirs[1] ^ dirs[3]) != 2) return 0; break;
                    default: return 0;
                }
                lineStart = lineEnd;
                break;
            }
            case V_QUAD: case V_CONIC: case V_CUBIC: return 0;
            case V_MOVE:
                if (!corners) firstPt = pts;
                else {
                    float cx = firstPt->x - lastPt->x, cy = firstPt->y - lastPt->y;
                    if (cx && cy) return 0;
                }
                lineStart = *pts++;
                closedOrMoved = 1;
                break;
        }
    }
    if (corners < 3 || corners > 4) return 0;
    float cx = firstPt->x - lastPt->x, cy = firstPt->y - lastPt->y;
    if (cx && cy) return 0;
    *L = fminf(firstCorner.x, thirdCorner.x); *R = fmaxf(firstCorner.x, thirdCorner.x);
    *T = fminf(firstCorner.y, thirdCorner.y); *B = fmaxf(firstCorner.y, thirdCorner.y);
    if (closedOut) *closedOut = autoClose;
    if (ccwOut) *ccwOut = !(dirs[0] == ((dirs[1] + 1) & 3));
    return 1;
}
