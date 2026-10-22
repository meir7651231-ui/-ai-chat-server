/* vr_rect.c -- SkScan::AntiFillRect / AntiFrameRect (SkScan_Antihair.cpp) */
#include "vr.h"
#include "vr_blit.h"
#include <math.h>
#include <stdlib.h>

typedef int FDot8;
static inline int32_t f2fixed(float x) {   /* sk_float_saturate2int(x * 65536) */
    float v = x * 65536.0f;
    if (v >= 2147483520.0f) return 0x7FFFFF80; if (v <= -2147483520.0f) return -0x7FFFFF80;
    return (int32_t)v;
}
static inline FDot8 fixed_to_fdot8(int32_t x) { return (x + 0x80) >> 8; }
#define SkAlphaMul(v, a) (((v) * (a)) >> 8)

static void call_hline(Blitter *b, int x, int y, int count, int alpha) {
    uint8_t aa[256];
    while (count > 0) {
        int n = count > 100 ? 100 : count;
        for (int i = 0; i < n; i++) aa[i] = (uint8_t)alpha;
        bl_blitAntiH(b, x, y, aa, n);
        x += n; count -= n;
    }
}
static void do_scanline(FDot8 L, int top, FDot8 R, int alpha, Blitter *b) {
    if ((L >> 8) == ((R - 1) >> 8)) { bl_blitV(b, L >> 8, top, 1, SkAlphaMul(alpha, R - L)); return; }
    int left = L >> 8;
    if (L & 0xFF) { bl_blitV(b, left, top, 1, SkAlphaMul(alpha, 256 - (L & 0xFF))); left += 1; }
    int rite = R >> 8, width = rite - left;
    if (width > 0) call_hline(b, left, top, width, alpha);
    if (R & 0xFF) bl_blitV(b, rite, top, 1, SkAlphaMul(alpha, R & 0xFF));
}
static void antifilldot8(FDot8 L, FDot8 T, FDot8 R, FDot8 B, Blitter *b, int fillInner) {
    if (L >= R || T >= B) return;
    int top = T >> 8;
    if (top == ((B - 1) >> 8)) { do_scanline(L, top, R, B - T - 1, b); return; }
    if (T & 0xFF) { do_scanline(L, top, R, 256 - (T & 0xFF), b); top += 1; }
    int bot = B >> 8, height = bot - top;
    if (height > 0) {
        int left = L >> 8;
        if (left == ((R - 1) >> 8)) bl_blitV(b, left, top, height, R - L - 1);
        else {
            if (L & 0xFF) { bl_blitV(b, left, top, height, 256 - (L & 0xFF)); left += 1; }
            int rite = R >> 8, width = rite - left;
            if (width > 0 && fillInner) bl_blitRect(b, left, top, width, height);
            if (R & 0xFF) bl_blitV(b, rite, top, height, R & 0xFF);
        }
    }
    if (B & 0xFF) do_scanline(L, bot, R, B & 0xFF, b);
}

void fill_rect_aa(Canvas *c, float l, float t, float r, float bb, const Paint *paint) {
    /* SkScan::AntiFillRect(origR, clip): newR = clip ∩ r */
    float cl = (float)c->clipL, ct = (float)c->clipT, cr = (float)c->clipR, cb = (float)c->clipB;
    float L = l > cl ? l : cl, T = t > ct ? t : ct, R = r < cr ? r : cr, B = bb < cb ? bb : cb;
    if (!(L < R && T < B)) return;
    Blitter b; bl_init(&b, c, paint, 0);
    antifilldot8(fixed_to_fdot8(f2fixed(L)), fixed_to_fdot8(f2fixed(T)), fixed_to_fdot8(f2fixed(R)),
                 fixed_to_fdot8(f2fixed(B)), &b, 1);
    bl_done(&b);
}

/* ---- AntiFrameRect */
static inline FDot8 s2fdot8(float x) { return (int)(x * 256); }
static inline int FDot8Floor(FDot8 x) { return x >> 8; }
static inline int FDot8Ceil(FDot8 x) { return (x + 0xFF) >> 8; }
static inline int mul_div255_round(int a, int b) { unsigned prod = (unsigned)(a * b + 128); return (int)((prod + (prod >> 8)) >> 8); }
static inline int inv_alpha_mul(int a, int b) { return (uint8_t)(a + b - mul_div255_round(a, b)); }
static void fillcheckrect(int L, int T, int R, int B, Blitter *b) { if (L < R && T < B) bl_blitRect(b, L, T, R - L, B - T); }
static void inner_scanline(FDot8 L, int top, FDot8 R, int alpha, Blitter *b) {
    if ((L >> 8) == ((R - 1) >> 8)) {
        FDot8 wc = R - L; wc = wc - (wc >> 8);
        bl_blitV(b, L >> 8, top, 1, inv_alpha_mul(alpha, wc));
        return;
    }
    int left = L >> 8;
    if (L & 0xFF) { bl_blitV(b, left, top, 1, inv_alpha_mul(alpha, L & 0xFF)); left += 1; }
    int rite = R >> 8, width = rite - left;
    if (width > 0) call_hline(b, left, top, width, alpha);
    if (R & 0xFF) bl_blitV(b, rite, top, 1, inv_alpha_mul(alpha, ~R & 0xFF));
}
static void innerstrokedot8(FDot8 L, FDot8 T, FDot8 R, FDot8 B, Blitter *b) {
    int top = T >> 8;
    if (top == ((B - 1) >> 8)) {
        int alpha = 256 - (B - T);
        if (alpha) inner_scanline(L, top, R, alpha, b);
        return;
    }
    if (T & 0xFF) { inner_scanline(L, top, R, T & 0xFF, b); top += 1; }
    int bot = B >> 8, height = bot - top;
    if (height > 0) {
        if (L & 0xFF) bl_blitV(b, L >> 8, top, height, L & 0xFF);
        if (R & 0xFF) bl_blitV(b, R >> 8, top, height, ~R & 0xFF);
    }
    if (B & 0xFF) inner_scanline(L, bot, R, ~B & 0xFF, b);
}
static void align_thin_stroke(FDot8 *e1, FDot8 *e2) {
    if (FDot8Floor(*e1) == FDot8Floor(*e2)) { *e2 -= (*e1 & 0xFF); *e1 &= ~0xFF; }
}
void frame_rect_aa(Canvas *c, float rl, float rt, float rr, float rb, float sw, float sh, const Paint *paint) {
    float rx = sw * 0.5f, ry = sh * 0.5f;
    FDot8 outerL = s2fdot8(rl - rx), outerT = s2fdot8(rt - ry), outerR = s2fdot8(rr + rx), outerB = s2fdot8(rb + ry);
    int oL = FDot8Floor(outerL), oT = FDot8Floor(outerT), oR = FDot8Ceil(outerR), oB = FDot8Ceil(outerB);
    if (oR <= c->clipL || oL >= c->clipR || oB <= c->clipT || oT >= c->clipB) return;
    int contained = oL >= c->clipL && oT >= c->clipT && oR <= c->clipR && oB <= c->clipB;
    Blitter b; bl_init(&b, c, paint, !contained);
    rx = sw - rx; ry = sh - ry;
    FDot8 innerL = s2fdot8(rl + rx), innerT = s2fdot8(rt + ry), innerR = s2fdot8(rr - rx), innerB = s2fdot8(rb - ry);
    if (sw < 1 || sh < 1) {
        align_thin_stroke(&outerL, &innerL); align_thin_stroke(&outerT, &innerT);
        align_thin_stroke(&innerR, &outerR); align_thin_stroke(&innerB, &outerB);
    }
    antifilldot8(outerL, outerT, outerR, outerB, &b, 0);
    int L = FDot8Ceil(outerL), T = FDot8Ceil(outerT), R = FDot8Floor(outerR), B = FDot8Floor(outerB);
    if (innerL >= innerR || innerT >= innerB) {
        fillcheckrect(L, T, R, B, &b);
    } else {
        int iL = FDot8Floor(innerL), iT = FDot8Floor(innerT), iR = FDot8Ceil(innerR), iB = FDot8Ceil(innerB);
        fillcheckrect(L, T, R, iT, &b);
        fillcheckrect(L, iT, iL, iB, &b);
        fillcheckrect(iR, iT, R, iB, &b);
        fillcheckrect(L, iB, R, B, &b);
        innerstrokedot8(innerL, innerT, innerR, innerB, &b);
    }
    bl_done(&b);
}
