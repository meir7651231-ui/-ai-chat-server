/* vr_blit.h -- "real" blitter: legacy SkARGB32 (opaque/black) for solid colours and the
 * raster-pipeline blitter (dithered gradient shader) for gradients; optional SkRectClipBlitter. */
#ifndef VR_BLIT_H
#define VR_BLIT_H
#include "vr.h"

typedef struct {
    Canvas *c;
    const Paint *paint;
    int black;            /* SkARGB32_Black_Blitter */
    int clipwrap;         /* SkRectClipBlitter wrapper active */
    int cl, ct, cr, cb;   /* clip rect (device) */
    /* shader scratch */
    float *span;          /* 4*W floats */
} Blitter;

void bl_init(Blitter *b, Canvas *c, const Paint *p, int clipwrap);
void bl_done(Blitter *b);
void bl_blitH(Blitter *b, int x, int y, int w);
void bl_blitV(Blitter *b, int x, int y, int h, int alpha);
void bl_blitRect(Blitter *b, int x, int y, int w, int h);
void bl_blitAntiRect(Blitter *b, int x, int y, int w, int h, int la, int ra);
/* runs: per-pixel alpha array of length n starting at x */
void bl_blitAntiH(Blitter *b, int x, int y, const uint8_t *aa, int n);
void bl_blitAntiH2(Blitter *b, int x, int y, int a0, int a1);
void bl_blitAntiV2(Blitter *b, int x, int y, int a0, int a1);
/* A8 mask blit: mask rows (row stride ms) covering [mx, mx+mw) x [my, my+mh), clip to (cx0..cx1, cy0..cy1) */
void bl_blitMask(Blitter *b, const uint8_t *mask, int ms, int mx, int my, int cx0, int cy0, int cx1, int cy1);
void bl_blitFatAntiRect(Blitter *b, float l, float t, float r, float bb);
#endif
