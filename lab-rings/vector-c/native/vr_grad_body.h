/* shading + blending template, included by vr_grad.c twice (plain x86-64 and FMA/AVX2 target) */
static inline float SFX(clamp01)(float v) { v = 0.0f > v ? 0.0f : v; return v < 1.0f ? v : 1.0f; }   /* min(max(0,v),1), maxps/minps operand order */

static inline void SFX(shade)(const Paint *p, int x, int y, float out[3]) {
    float X = (float)x + 0.5f, Y = (float)y + 0.5f;
    float R, G;
    switch (p->mtype) {
        case 0: R = X; G = Y; break;
        case 1: R = X + p->m[2]; G = Y + p->m[5]; break;
        case 2: R = fmaf(X, p->m[0], p->m[2]); G = fmaf(Y, p->m[4], p->m[5]); break;
        default:
            R = fmaf(X, p->m[0], fmaf(Y, p->m[1], p->m[2]));
            G = fmaf(X, p->m[3], fmaf(Y, p->m[4], p->m[5]));
    }
    float t = R;
    if (p->radial) t = vr_grad_radius_fma ? sqrtf(fmaf(R, R, G * G)) : sqrtf(R * R + G * G);
    if (p->clampx) t = SFX(clamp01)(t);
    float c[3];
    if (p->gtype == 0) {
        for (int k = 0; k < 3; k++) c[k] = fmaf(t, p->fac[k][0], p->bias[k][0]);
    } else {
        int idx;
        if (p->gtype == 1) {
            float f = t * (float)(p->stopCount - 1);
            idx = (int)f;                    /* trunc_ (cvttps) */
        } else {
            idx = 0;
            for (int i = 1; i < p->stopCount; i++) idx += t >= p->ts[i];
        }
        for (int k = 0; k < 3; k++) c[k] = fmaf(t, p->fac[k][idx], p->bias[k][idx]);
    }
    if (p->dither > 0) {
        unsigned ux = (unsigned)x, uy = (unsigned)y ^ (unsigned)x;
        unsigned M = (uy & 1) << 5 | (ux & 1) << 4 | (uy & 2) << 2 | (ux & 2) << 1 | (uy & 4) >> 1 | (ux & 4) >> 2;
        float d = fmaf((float)(int)M, 2 / 128.0f, -63 / 128.0f);
        for (int k = 0; k < 3; k++) {
            float v = fmaf(d, p->dither, c[k]);
            v = v < 1.0f ? v : 1.0f;          /* min(r, a), a == 1 */
            c[k] = 0.0f > v ? 0.0f : v;       /* max(0, .) */
        }
    }
    for (int k = 0; k < 3; k++) out[k] = SFX(clamp01)(c[k]);
}
static inline uint8_t SFX(to_unorm)(float v) {
    float s = fmaf(v, 255.0f, 0.0f);
    s = 0.0f > s ? 0.0f : s;           /* max(0, .) */
    s = s < 255.0f ? s : 255.0f;       /* min(., 255) */
    return (uint8_t)ROUND_NE(s);       /* cvtps2dq: round to nearest even */
}

static void SFX(grad_blend_span)(const Paint *p, Canvas *c, int x, int y, int n, const uint8_t *cov, int mode, int constval) {
    uint8_t *d = c->px + 3 * ((size_t)(y - c->oy) * c->stride + (x - c->ox));
    for (int i = 0; i < n; i++, d += 3) {
        int a;
        if (mode == GB_FULL) a = 256;
        else a = cov ? cov[i] : constval;
        if (mode == GB_ANTIH) { if (a == 0) continue; if (a == 255) a = 256; }
        float s[3];
        SFX(shade)(p, x + i, y, s);
        if (a == 256) { d[0] = SFX(to_unorm)(s[0]); d[1] = SFX(to_unorm)(s[1]); d[2] = SFX(to_unorm)(s[2]); continue; }
        float cf = (float)a * (1 / 255.0f);
        for (int k = 0; k < 3; k++) {
            float dv = (float)d[k] * (1 / 255.0f);
            d[k] = SFX(to_unorm)(fmaf(s[k] - dv, cf, dv));
        }
    }
}
