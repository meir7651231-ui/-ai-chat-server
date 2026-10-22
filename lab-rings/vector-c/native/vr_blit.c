/* vr_blit.c -- real blitters (see vr_blit.h) */
#include "vr_blit.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>

void bl_init(Blitter *b, Canvas *c, const Paint *p, int clipwrap) {
    b->c = c; b->paint = p; b->clipwrap = clipwrap;
    b->black = (p->kind == 0 && p->r == 0 && p->g == 0 && p->b == 0);
    b->cl = c->clipL; b->ct = c->clipT; b->cr = c->clipR; b->cb = c->clipB;
    b->span = (p->kind != 0) ? (float *)malloc(sizeof(float) * 4 * (c->W + 64)) : NULL;
}
void bl_done(Blitter *b) { free(b->span); b->span = NULL; }

static inline uint8_t *PX(Blitter *b, int x, int y) { return b->c->px + 3 * ((size_t)(y - b->c->oy) * b->c->stride + (x - b->c->ox)); }

/* F1: d' = (c*(a+1))>>8 + (d*(256-a))>>8  (SkAlphaMulQ + Color32 / blit_mask_d32_a8 / blitV) */
static inline void f1(uint8_t *d, const Paint *p, int a) {
    unsigned s1 = a + 1, s2 = 256 - a;
    d[0] = (uint8_t)(((p->r * s1) >> 8) + ((d[0] * s2) >> 8));
    d[1] = (uint8_t)(((p->g * s1) >> 8) + ((d[1] * s2) >> 8));
    d[2] = (uint8_t)(((p->b * s1) >> 8) + ((d[2] * s2) >> 8));
}
/* F2: SkFastFourByteInterp (opaque blitAntiH2/V2) */
static inline void f2(uint8_t *d, const Paint *p, int a) {
    unsigned sc = a + (a >> 7), is = 256 - sc;
    d[0] = (uint8_t)((p->r * sc + is * d[0]) >> 8);
    d[1] = (uint8_t)((p->g * sc + is * d[1]) >> 8);
    d[2] = (uint8_t)((p->b * sc + is * d[2]) >> 8);
}
static inline void setc(uint8_t *d, const Paint *p) { d[0] = p->r; d[1] = p->g; d[2] = p->b; }

/* ---- raw (unclipped) operations of the device blitter */
static void raw_blitH(Blitter *b, int x, int y, int w) {
    if (b->paint->kind) { grad_blend_span(b->paint, b->c, x, y, w, NULL, GB_FULL, 255); return; }
    uint8_t *d = PX(b, x, y);
    for (int i = 0; i < w; i++, d += 3) setc(d, b->paint);
}
static void raw_blitV(Blitter *b, int x, int y, int h, int a) {
    if (a == 0) return;
    if (b->paint->kind) {
        for (int i = 0; i < h; i++) grad_blend_span(b->paint, b->c, x, y + i, 1, NULL, GB_MASK, a);
        return;
    }
    for (int i = 0; i < h; i++) {
        uint8_t *d = PX(b, x, y + i);
        if (a == 255) setc(d, b->paint); else f1(d, b->paint, a);
    }
}
static void raw_blitRect(Blitter *b, int x, int y, int w, int h) {
    for (int i = 0; i < h; i++) raw_blitH(b, x, y + i, w);
}
static void raw_blitAntiH(Blitter *b, int x, int y, const uint8_t *aa, int n) {
    if (b->paint->kind) { grad_blend_span(b->paint, b->c, x, y, n, aa, GB_ANTIH, 0); return; }
    uint8_t *d = PX(b, x, y);
    for (int i = 0; i < n; i++, d += 3) {
        int a = aa[i];
        if (a == 255) setc(d, b->paint); else if (a > 0) f1(d, b->paint, a);
    }
}
static void raw_blitAntiH2(Blitter *b, int x, int y, int a0, int a1) {
    if (b->paint->kind) { uint8_t aa[2] = {(uint8_t)a0, (uint8_t)a1}; grad_blend_span(b->paint, b->c, x, y, 2, aa, GB_MASK, 0); return; }
    uint8_t *d = PX(b, x, y);
    if (b->black) { f1(d, b->paint, a0); f1(d + 3, b->paint, a1); }
    else { f2(d, b->paint, a0); f2(d + 3, b->paint, a1); }
}
static void raw_blitAntiV2(Blitter *b, int x, int y, int a0, int a1) {
    if (b->paint->kind) {
        uint8_t aa0 = (uint8_t)a0, aa1 = (uint8_t)a1;
        grad_blend_span(b->paint, b->c, x, y, 1, &aa0, GB_MASK, 0);
        grad_blend_span(b->paint, b->c, x, y + 1, 1, &aa1, GB_MASK, 0);
        return;
    }
    uint8_t *d0 = PX(b, x, y), *d1 = PX(b, x, y + 1);
    if (b->black) { f1(d0, b->paint, a0); f1(d1, b->paint, a1); }
    else { f2(d0, b->paint, a0); f2(d1, b->paint, a1); }
}
static void raw_blitAntiRect(Blitter *b, int x, int y, int w, int h, int la, int ra) {
    /* SkBlitter default implementation */
    if (la > 0) raw_blitV(b, x, y, h, la);
    x++;
    if (w > 0) { raw_blitRect(b, x, y, w, h); x += w; }
    if (ra > 0) raw_blitV(b, x, y, h, ra);
}

/* ---- public operations (with SkRectClipBlitter semantics when clipwrap) */
void bl_blitH(Blitter *b, int x, int y, int w) {
    if (b->clipwrap) {
        if (y < b->ct || y >= b->cb) return;
        int r = x + w;
        if (x < b->cl) x = b->cl;
        if (r > b->cr) r = b->cr;
        if (r - x > 0) raw_blitH(b, x, y, r - x);
        return;
    }
    raw_blitH(b, x, y, w);
}
void bl_blitV(Blitter *b, int x, int y, int h, int a) {
    if (b->clipwrap) {
        if (x < b->cl || x >= b->cr) return;
        int y0 = y, y1 = y + h;
        if (y0 < b->ct) y0 = b->ct;
        if (y1 > b->cb) y1 = b->cb;
        if (y0 < y1) raw_blitV(b, x, y0, y1 - y0, a);
        return;
    }
    raw_blitV(b, x, y, h, a);
}
void bl_blitRect(Blitter *b, int x, int y, int w, int h) {
    if (b->clipwrap) {
        int l = x, t = y, r = x + w, bt = y + h;
        if (l < b->cl) l = b->cl; if (t < b->ct) t = b->ct; if (r > b->cr) r = b->cr; if (bt > b->cb) bt = b->cb;
        if (l < r && t < bt) raw_blitRect(b, l, t, r - l, bt - t);
        return;
    }
    raw_blitRect(b, x, y, w, h);
}
void bl_blitAntiRect(Blitter *b, int left, int y, int w, int h, int la, int ra) {
    if (b->clipwrap) {
        int l = left, t = y, r = left + w + 2, bt = y + h;
        if (l < b->cl) l = b->cl; if (t < b->ct) t = b->ct; if (r > b->cr) r = b->cr; if (bt > b->cb) bt = b->cb;
        if (!(l < r && t < bt)) return;
        if (l != left) la = 255;
        if (r != left + w + 2) ra = 255;
        if (la == 255 && ra == 255) raw_blitRect(b, l, t, r - l, bt - t);
        else if (r - l == 1) {
            if (l == left) raw_blitV(b, l, t, bt - t, la);
            else raw_blitV(b, l, t, bt - t, ra);
        } else raw_blitAntiRect(b, l, t, r - l - 2, bt - t, la, ra);
        return;
    }
    raw_blitAntiRect(b, left, y, w, h, la, ra);
}
void bl_blitAntiH(Blitter *b, int x, int y, const uint8_t *aa, int n) {
    if (b->clipwrap) {
        if (y < b->ct || y >= b->cb || x >= b->cr) return;
        int x0 = x, x1 = x + n;
        if (x1 <= b->cl) return;
        if (x0 < b->cl) { aa += b->cl - x0; x0 = b->cl; }
        if (x1 > b->cr) x1 = b->cr;
        raw_blitAntiH(b, x0, y, aa, x1 - x0);
        return;
    }
    raw_blitAntiH(b, x, y, aa, n);
}
void bl_blitAntiH2(Blitter *b, int x, int y, int a0, int a1) {
    if (b->clipwrap) {   /* SkRectClipBlitter uses SkBlitter's default (blitAntiH) */
        uint8_t aa[2] = {(uint8_t)a0, (uint8_t)a1};
        bl_blitAntiH(b, x, y, aa, 2);
        return;
    }
    raw_blitAntiH2(b, x, y, a0, a1);
}
void bl_blitAntiV2(Blitter *b, int x, int y, int a0, int a1) {
    if (b->clipwrap) {
        uint8_t a = (uint8_t)a0; bl_blitAntiH(b, x, y, &a, 1);
        a = (uint8_t)a1; bl_blitAntiH(b, x, y + 1, &a, 1);
        return;
    }
    raw_blitAntiV2(b, x, y, a0, a1);
}
void bl_blitMask(Blitter *b, const uint8_t *mask, int ms, int mx, int my, int cx0, int cy0, int cx1, int cy1) {
    if (b->clipwrap) {
        if (cx0 < b->cl) cx0 = b->cl; if (cy0 < b->ct) cy0 = b->ct;
        if (cx1 > b->cr) cx1 = b->cr; if (cy1 > b->cb) cy1 = b->cb;
        if (!(cx0 < cx1 && cy0 < cy1)) return;
    }
    for (int y = cy0; y < cy1; y++) {
        const uint8_t *m = mask + (size_t)(y - my) * ms + (cx0 - mx);
        if (b->paint->kind) { grad_blend_span(b->paint, b->c, cx0, y, cx1 - cx0, m, GB_MASK, 0); continue; }
        uint8_t *d = PX(b, cx0, y);
        for (int x = cx0; x < cx1; x++, d += 3, m++) f1(d, b->paint, *m);
    }
}

static inline int scalar_to_alpha(float a) {
    int al = (uint8_t)(a * 255);
    return al > 247 ? 0xFF : al < 8 ? 0 : al;
}
void bl_blitFatAntiRect(Blitter *b, float l, float t, float r, float bb) {
    int L = (int)floorf(l), T = (int)floorf(t), R = (int)ceilf(r), B = (int)ceilf(bb);
    int bw = R - L, bh = B - T;
    if (bh == 0) return;
    float pL = L + 1 - l, pR = r - (R - 1), pT = T + 1 - t, pB = bb - (B - 1);
    if (bh == 1) pT = bb - t;
    uint8_t *al = (uint8_t *)malloc(bw);
    int amid = scalar_to_alpha(pT);
    al[0] = (uint8_t)scalar_to_alpha(pL * pT);
    for (int i = 1; i < bw - 1; i++) al[i] = (uint8_t)amid;
    al[bw - 1] = (uint8_t)scalar_to_alpha(pR * pT);
    bl_blitAntiH(b, L, T, al, bw);
    if (bh > 2) bl_blitAntiRect(b, L, T + 1, bw - 2, bh - 2, scalar_to_alpha(pL), scalar_to_alpha(pR));
    if (bh > 1) {
        amid = scalar_to_alpha(pB);
        al[0] = (uint8_t)scalar_to_alpha(pL * pB);
        for (int i = 1; i < bw - 1; i++) al[i] = (uint8_t)amid;
        al[bw - 1] = (uint8_t)scalar_to_alpha(pR * pB);
        bl_blitAntiH(b, L, B - 1, al, bw);
    }
    free(al);
}
