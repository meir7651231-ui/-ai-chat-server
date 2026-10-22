/* vr.h -- native SVG-subset rasterizer that emulates Chromium 141 / Skia CPU raster
 * (analytic anti-aliasing "AAA" scan converter, legacy ARGB32 blitters, raster-pipeline
 * gradients with dither).  Ported to C from Skia (BSD licence, see dl-skia sources). */
#ifndef VR_H
#define VR_H
#include <stdint.h>
#include <stddef.h>

typedef struct { float x, y; } Pt;

enum { V_MOVE = 0, V_LINE = 1, V_QUAD = 2, V_CONIC = 3, V_CUBIC = 4, V_CLOSE = 5 };
enum { FILL_WINDING = 0, FILL_EVENODD = 1 };

typedef struct {
    Pt *pts; int npts, cappts;
    uint8_t *verbs; int nverbs, capverbs;
    float *w; int nw, capw;
    int fill;                 /* FILL_WINDING / FILL_EVENODD */
    int convex;               /* -1 unknown, 0 concave, 1 convex */
    /* builder state */
    int needsMove; Pt lastMove; int lastMoveIndex;
} Path;

void path_init(Path *p);
void path_free(Path *p);
void path_reset(Path *p);
void path_move(Path *p, Pt a);
void path_line(Path *p, Pt a);
void path_quad(Path *p, Pt a, Pt b);
void path_conic(Path *p, Pt a, Pt b, float w);
void path_cubic(Path *p, Pt a, Pt b, Pt c);
void path_close(Path *p);
void path_add_rect(Path *p, float l, float t, float r, float b, int ccw, unsigned index);
void path_add_oval(Path *p, float l, float t, float r, float b, int ccw, unsigned index);
void path_add_rrect(Path *p, float l, float t, float r, float b, float rx, float ry, int ccw, unsigned index);
void path_svg_arc(Path *p, float rx, float ry, float angle, int large, int sweep, Pt end);
void path_append(Path *dst, const Path *src);
Pt path_last_pt(const Path *p);
int path_bounds(const Path *p, float *l, float *t, float *r, float *b);  /* 0 if empty */
int path_is_convex(Path *p);
int path_is_rect(const Path *p, float *l, float *t, float *r, float *b);
int path_segment_mask(const Path *p);

/* affine matrix  [sx kx tx; ky sy ty] */
typedef struct { float sx, kx, tx, ky, sy, ty; } Mat;
void mat_identity(Mat *m);
int mat_is_identity(const Mat *m);
int mat_is_translate(const Mat *m);
int mat_rect_stays_rect(const Mat *m);
void mat_concat(Mat *out, const Mat *a, const Mat *b);   /* out = a * b */
void mat_set_rotate(Mat *m, float deg);
void mat_map(const Mat *m, Pt *dst, const Pt *src, int n);
void path_transform(Path *p, const Mat *m);

/* geometry */
int chop_quad_at_y_extrema(const Pt src[3], Pt dst[5]);
int chop_cubic_at_y_extrema(const Pt src[4], Pt dst[10]);
int chop_quad_at_x_extrema(const Pt src[3], Pt dst[5]);
int chop_cubic_at_x_extrema(const Pt src[4], Pt dst[10]);
void chop_quad_at(const Pt src[3], Pt dst[5], float t);
void chop_cubic_at(const Pt src[4], Pt dst[7], float t);
int conic_to_quads(const Pt pts[3], float w, float tol, Pt *out /* >= 1+2*32 */);
int find_unit_quad_roots(float A, float B, float C, float roots[2]);

/* paint */
#define MAXSTOPS 32
typedef struct {
    int kind;                 /* 0 solid, 1 linear, 2 radial */
    uint8_t r, g, b;          /* solid */
    /* gradient: device-space -> unit matrix applied at evaluation */
    float x1, y1, x2, y2, cx, cy, rad;
    Mat gm;                   /* gradient-space matrix (gradientTransform/ bbox) */
    int nstops; float off[MAXSTOPS]; float col[MAXSTOPS][4];
    /* raster-pipeline program (vr_grad.c) */
    int mtype;                /* 0 identity, 1 translate, 2 scale+translate, 3 affine */
    float m[6];               /* sx kx tx ky sy ty */
    int radial, clampx, gtype; /* gtype: 0 two-stop, 1 evenly spaced, 2 general */
    int stopCount; float fac[4][MAXSTOPS + 4], bias[4][MAXSTOPS + 4], ts[MAXSTOPS + 4];
    float dither;             /* dither rate (0 = off) */
} Paint;
enum { GB_FULL = 0, GB_ANTIH = 1, GB_MASK = 2 };

typedef struct {
    int W, H;                 /* full device size */
    uint8_t *px;              /* RGB, 3 bytes per pixel, opaque; pixel (x,y) at px[3*((y-oy)*stride + x-ox)] */
    int ox, oy, stride;
    float tileX, tileY;       /* raster translate(-tileX, -tileY) applied to every CTM (cc tile origin) */
    int clipL, clipT, clipR, clipB;   /* current device clip (tile) */
} Canvas;

void grad_blend_span(const Paint *p, Canvas *c, int x, int y, int n, const uint8_t *cov, int mode, int constval);
int grad_setup(Paint *pt, int linear, float x1, float y1, float x2, float y2, float cx, float cy, float r,
               const Mat *ctm, const Mat *local, int localIsIdentity, int nstops, const float *off, const float (*col)[4]);

/* blitting / scan conversion */
void fill_path_aa(Canvas *c, Path *p, const Paint *paint);
void fill_rect_aa(Canvas *c, float l, float t, float r, float b, const Paint *paint);
void frame_rect_aa(Canvas *c, float l, float t, float r, float b, float sw, float sh, const Paint *paint);

/* stroking (SkStroke port) */
enum { CAP_BUTT = 0, CAP_ROUND = 1, CAP_SQUARE = 2 };
enum { JOIN_MITER = 0, JOIN_ROUND = 1, JOIN_BEVEL = 2 };
void stroke_path(const Path *src, float width, int cap, int join, float miter, float resScale, Path *dst);

/* render entry; vr_flags is set (bitmask) when the SVG used something not emulated exactly */
extern int vr_flags;
#define VR_FLAG_HAIRLINE 1
#define VR_FLAG_UNSUPPORTED 2
#define VR_FLAG_GRADIENT_APPROX 4

int vr_render_svg(const char *svg, int W, int H, uint8_t *out_rgb);

#endif
