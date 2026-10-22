/* vr_aaa.c -- Skia analytic anti-aliasing (SkScan_AAAPath.cpp, SkAnalyticEdge.cpp,
 * SkEdgeBuilder.cpp) ported to C. */
#include "vr.h"
#include "vr_blit.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "invtable.h"

typedef int32_t SkFixed;
typedef int32_t SkFDot6;
#define SK_Fixed1 (1 << 16)
#define SK_FixedHalf (1 << 15)
#define SK_MaxS32 0x7FFFFFFF
#define SK_MinS32 (-SK_MaxS32)
#define kDefaultAccuracy 2

static inline int32_t lsh(int32_t v, int s) { return (int32_t)((uint32_t)v << s); }
static inline SkFixed FixedMul(SkFixed a, SkFixed b) { return (SkFixed)(((int64_t)a * b) >> 16); }
static inline SkFixed FDot6ToFixed(SkFDot6 x) { return lsh(x, 10); }
#define FixedToFDot6(x) ((x) >> 10)
#define FixedRoundToInt(x) (((x) + SK_FixedHalf) >> 16)
#define FixedCeilToInt(x) (((x) + SK_Fixed1 - 1) >> 16)
#define FixedFloorToInt(x) ((x) >> 16)
static inline SkFixed FixedRoundToFixed(SkFixed x) { return (SkFixed)((uint32_t)(x + SK_FixedHalf) & 0xFFFF0000u); }
static inline SkFixed FixedCeilToFixed(SkFixed x) { return (SkFixed)((uint32_t)(x + SK_Fixed1 - 1) & 0xFFFF0000u); }
static inline SkFixed FixedFloorToFixed(SkFixed x) { return (SkFixed)((uint32_t)x & 0xFFFF0000u); }
#define IntToFixed(n) ((SkFixed)((uint32_t)(n) << 16))
#define FDot6Round(x) (((x) + 32) >> 6)
static inline int32_t iabs(int32_t v) { return v < 0 ? -v : v; }
static inline SkFixed FixedDiv(int32_t numer, int32_t denom) {
    int64_t v = ((int64_t)(uint64_t)((int64_t)numer << 16)) / denom;
    if (v > SK_MaxS32) v = SK_MaxS32; if (v < SK_MinS32) v = SK_MinS32;
    return (SkFixed)v;
}
static inline SkFixed FDot6Div(SkFDot6 a, SkFDot6 b) {
    if (a == (int16_t)a) return lsh(a, 16) / b;
    return FixedDiv(a, b);
}
static inline int32_t sat_add(int32_t a, int32_t b) { int64_t s = (int64_t)a + b; if (s > SK_MaxS32) s = SK_MaxS32; if (s < INT32_MIN) s = INT32_MIN; return (int32_t)s; }
static inline int32_t sat_sub(int32_t a, int32_t b) { int64_t s = (int64_t)a - b; if (s > SK_MaxS32) s = SK_MaxS32; if (s < INT32_MIN) s = INT32_MIN; return (int32_t)s; }
static inline int clz32(uint32_t x) { return x ? __builtin_clz(x) : 32; }

static inline SkFixed quick_inverse(SkFDot6 x) {
    const int kLast = 1024;
    if (x > 0) return -kInvTable[kLast - x];
    return kInvTable[kLast + x];
}
static inline SkFixed quick_div(SkFDot6 a, SkFDot6 b) {
    const int kMinBits = 3, kMaxBits = 31;
    const int kMaxAbsA = 1 << (kMaxBits - (22 - kMinBits));
    SkFDot6 abs_a = iabs(a), abs_b = iabs(b);
    if (abs_b >= (1 << kMinBits) && abs_b < 1024 && abs_a < kMaxAbsA) {
        return (a * quick_inverse(b)) >> 6;
    }
    return FDot6Div(a, b);
}
static inline SkFixed SnapY(SkFixed y) {
    return (SkFixed)((((uint32_t)y + (SK_Fixed1 >> (kDefaultAccuracy + 1))) >> (16 - kDefaultAccuracy)) << (16 - kDefaultAccuracy));
}

/* ------------------------------------------------------------------ edges */
enum { E_LINE = 0, E_QUAD = 1, E_CUBIC = 2 };
typedef struct Edge {
    struct Edge *fNext, *fPrev;
    SkFixed fX, fDX, fUpperX, fY, fUpperY, fLowerY, fDY;
    int8_t fEdgeType, fCurveCount; uint8_t fCurveShift; int8_t fWinding;
    /* quad */
    SkFixed fQx, fQy, fQDx, fQDy, fQDDx, fQDDy, fQLastX, fQLastY, fSnappedX, fSnappedY;
    /* cubic */
    SkFixed fCx, fCy, fCDx, fCDy, fCDDx, fCDDy, fCDDDx, fCDDDy, fCLastX, fCLastY, fCSnappedY;
    uint8_t fCubicDShift;
} Edge;

static int edge_set_line(Edge *e, Pt p0, Pt p1) {
    const int mult = 1 << kDefaultAccuracy;
    SkFixed x0 = FDot6ToFixed((SkFDot6)((p0.x * mult) * 64)) >> kDefaultAccuracy;
    SkFixed y0 = SnapY(FDot6ToFixed((SkFDot6)((p0.y * mult) * 64)) >> kDefaultAccuracy);
    SkFixed x1 = FDot6ToFixed((SkFDot6)((p1.x * mult) * 64)) >> kDefaultAccuracy;
    SkFixed y1 = SnapY(FDot6ToFixed((SkFDot6)((p1.y * mult) * 64)) >> kDefaultAccuracy);
    int winding = 1;
    if (y0 > y1) { SkFixed t = x0; x0 = x1; x1 = t; t = y0; y0 = y1; y1 = t; winding = -1; }
    SkFDot6 dy = FixedToFDot6(y1 - y0);
    if (dy == 0) return 0;
    SkFDot6 dx = FixedToFDot6(x1 - x0);
    SkFixed slope = quick_div(dx, dy);
    SkFixed absSlope = iabs(slope);
    e->fX = x0; e->fDX = slope; e->fUpperX = x0; e->fY = y0; e->fUpperY = y0; e->fLowerY = y1;
    e->fDY = (dx == 0 || slope == 0) ? SK_MaxS32 : absSlope < 1024 ? quick_inverse(absSlope) : iabs(quick_div(dy, dx));
    e->fEdgeType = E_LINE; e->fCurveCount = 0; e->fWinding = (int8_t)winding; e->fCurveShift = 0;
    return 1;
}

static int edge_update_line(Edge *e, SkFixed x0, SkFixed y0, SkFixed x1, SkFixed y1, SkFixed slope) {
    if (y0 > y1) { SkFixed t = x0; x0 = x1; x1 = t; t = y0; y0 = y1; y1 = t; e->fWinding = (int8_t)-e->fWinding; }
    SkFDot6 dx = FixedToFDot6(x1 - x0), dy = FixedToFDot6(y1 - y0);
    if (dy == 0) return 0;
    SkFDot6 absSlope = iabs(FixedToFDot6(slope));
    e->fX = x0; e->fDX = slope; e->fUpperX = x0; e->fY = y0; e->fUpperY = y0; e->fLowerY = y1;
    e->fDY = (dx == 0 || slope == 0) ? SK_MaxS32 : absSlope < 1024 ? quick_inverse(absSlope) : iabs(quick_div(dy, dx));
    return 1;
}

#define MAX_COEFF_SHIFT 6
static inline SkFDot6 cheap_distance(SkFDot6 dx, SkFDot6 dy) {
    dx = iabs(dx); dy = iabs(dy);
    if (dx > dy) dx += dy >> 1; else dx = dy + (dx >> 1);
    return dx;
}
static inline int diff_to_shift(SkFDot6 dx, SkFDot6 dy, int shiftAA) {
    SkFDot6 dist = cheap_distance(dx, dy);
    dist = (dist + (1 << (2 + shiftAA))) >> (3 + shiftAA);
    return (32 - clz32((uint32_t)dist)) >> 1;
}
static inline SkFixed FDot6ToFixedDiv2(SkFDot6 v) { return lsh(v, 16 - 6 - 1); }

static int quad_update(Edge *e);
static int cubic_update(Edge *e);

static int quad_set(Edge *e, const Pt pts[3]) {
    int shift = kDefaultAccuracy;
    float scale = (float)(1 << (shift + 6));
    SkFDot6 x0 = (int)(pts[0].x * scale), y0 = (int)(pts[0].y * scale);
    SkFDot6 x1 = (int)(pts[1].x * scale), y1 = (int)(pts[1].y * scale);
    SkFDot6 x2 = (int)(pts[2].x * scale), y2 = (int)(pts[2].y * scale);
    int winding = 1;
    if (y0 > y2) { SkFDot6 t = x0; x0 = x2; x2 = t; t = y0; y0 = y2; y2 = t; winding = -1; }
    int top = FDot6Round(y0), bot = FDot6Round(y2);
    if (top == bot) return 0;
    {
        SkFDot6 dx = (lsh(x1, 1) - x0 - x2) >> 2;
        SkFDot6 dy = (lsh(y1, 1) - y0 - y2) >> 2;
        shift = diff_to_shift(dx, dy, shift);
    }
    if (shift == 0) shift = 1; else if (shift > MAX_COEFF_SHIFT) shift = MAX_COEFF_SHIFT;
    e->fWinding = (int8_t)winding;
    e->fCurveCount = (int8_t)(1 << shift);
    e->fCurveShift = (uint8_t)(shift - 1);
    SkFixed A = FDot6ToFixedDiv2(x0 - x1 - x1 + x2);
    SkFixed B = FDot6ToFixed(x1 - x0);
    e->fQx = FDot6ToFixed(x0); e->fQDx = B + (A >> shift); e->fQDDx = A >> (shift - 1);
    A = FDot6ToFixedDiv2(y0 - y1 - y1 + y2);
    B = FDot6ToFixed(y1 - y0);
    e->fQy = FDot6ToFixed(y0); e->fQDy = B + (A >> shift); e->fQDDy = A >> (shift - 1);
    e->fQLastX = FDot6ToFixed(x2); e->fQLastY = FDot6ToFixed(y2);
    /* setQuadratic */
    e->fQx >>= kDefaultAccuracy; e->fQy >>= kDefaultAccuracy;
    e->fQDx >>= kDefaultAccuracy; e->fQDy >>= kDefaultAccuracy;
    e->fQDDx >>= kDefaultAccuracy; e->fQDDy >>= kDefaultAccuracy;
    e->fQLastX >>= kDefaultAccuracy; e->fQLastY >>= kDefaultAccuracy;
    e->fQy = SnapY(e->fQy); e->fQLastY = SnapY(e->fQLastY);
    e->fEdgeType = E_QUAD;
    e->fSnappedX = e->fQx; e->fSnappedY = e->fQy;
    return quad_update(e);
}

static int quad_update(Edge *e) {
    int success = 0, count = e->fCurveCount;
    SkFixed oldx = e->fQx, oldy = e->fQy, dx = e->fQDx, dy = e->fQDy;
    SkFixed newx = 0, newy = 0, newSnappedX = 0, newSnappedY = 0;
    int shift = e->fCurveShift;
    do {
        SkFixed slope;
        if (--count > 0) {
            newx = oldx + (dx >> shift);
            newy = oldy + (dy >> shift);
            if (iabs(dy >> shift) >= SK_Fixed1 * 2 && ((int64_t)iabs(dy) << 6) > iabs(dx)) {
                SkFDot6 diffY = FixedToFDot6(newy - e->fSnappedY);
                slope = diffY ? quick_div(FixedToFDot6(newx - e->fSnappedX), diffY) : SK_MaxS32;
                newSnappedY = e->fQLastY < FixedRoundToFixed(newy) ? e->fQLastY : FixedRoundToFixed(newy);
                newSnappedX = newx - FixedMul(slope, newy - newSnappedY);
            } else {
                SkFixed sy = SnapY(newy);
                newSnappedY = e->fQLastY < sy ? e->fQLastY : sy;
                newSnappedX = newx;
                SkFDot6 diffY = FixedToFDot6(newSnappedY - e->fSnappedY);
                slope = diffY ? quick_div(FixedToFDot6(newx - e->fSnappedX), diffY) : SK_MaxS32;
            }
            dx += e->fQDDx; dy += e->fQDDy;
        } else {
            newx = e->fQLastX; newy = e->fQLastY;
            newSnappedY = newy; newSnappedX = newx;
            SkFDot6 diffY = FixedToFDot6(newy - e->fSnappedY);
            slope = diffY ? quick_div(FixedToFDot6(newx - e->fSnappedX), diffY) : SK_MaxS32;
        }
        if (slope < SK_MaxS32) success = edge_update_line(e, e->fSnappedX, e->fSnappedY, newSnappedX, newSnappedY, slope);
        oldx = newx; oldy = newy;
    } while (count > 0 && !success);
    e->fQx = newx; e->fQy = newy; e->fQDx = dx; e->fQDy = dy;
    e->fSnappedX = newSnappedX; e->fSnappedY = newSnappedY;
    e->fCurveCount = (int8_t)count;
    return success;
}

static SkFDot6 cubic_delta_from_line(SkFDot6 a, SkFDot6 b, SkFDot6 c, SkFDot6 d) {
    SkFDot6 oneThird = (a * 8 - b * 15 + 6 * c + d) * 19 >> 9;
    SkFDot6 twoThird = (a + 6 * b - c * 15 + d * 8) * 19 >> 9;
    SkFDot6 A = iabs(oneThird), B = iabs(twoThird);
    return A > B ? A : B;
}

static int cubic_set(Edge *e, const Pt pts[4]) {
    int shift = kDefaultAccuracy;
    float scale = (float)(1 << (shift + 6));
    SkFDot6 x0 = (int)(pts[0].x * scale), y0 = (int)(pts[0].y * scale);
    SkFDot6 x1 = (int)(pts[1].x * scale), y1 = (int)(pts[1].y * scale);
    SkFDot6 x2 = (int)(pts[2].x * scale), y2 = (int)(pts[2].y * scale);
    SkFDot6 x3 = (int)(pts[3].x * scale), y3 = (int)(pts[3].y * scale);
    int winding = 1;
    if (y0 > y3) {
        SkFDot6 t;
        t = x0; x0 = x3; x3 = t; t = x1; x1 = x2; x2 = t;
        t = y0; y0 = y3; y3 = t; t = y1; y1 = y2; y2 = t;
        winding = -1;
    }
    int top = FDot6Round(y0), bot = FDot6Round(y3);
    if (top == bot) return 0;
    {
        SkFDot6 dx = cubic_delta_from_line(x0, x1, x2, x3);
        SkFDot6 dy = cubic_delta_from_line(y0, y1, y2, y3);
        shift = diff_to_shift(dx, dy, 2) + 1;
    }
    if (shift > MAX_COEFF_SHIFT) shift = MAX_COEFF_SHIFT;
    int upShift = 6, downShift = shift + upShift - 10;
    if (downShift < 0) { downShift = 0; upShift = 10 - shift; }
    e->fWinding = (int8_t)winding;
    e->fEdgeType = E_CUBIC;
    e->fCurveCount = (int8_t)lsh(-1, shift);
    e->fCurveShift = (uint8_t)shift;
    e->fCubicDShift = (uint8_t)downShift;
    SkFixed B = lsh(3 * (x1 - x0), upShift);
    SkFixed C = lsh(3 * (x0 - x1 - x1 + x2), upShift);
    SkFixed D = lsh(x3 + 3 * (x1 - x2) - x0, upShift);
    e->fCx = FDot6ToFixed(x0);
    e->fCDx = B + (C >> shift) + (D >> 2 * shift);
    e->fCDDx = 2 * C + (3 * D >> (shift - 1));
    e->fCDDDx = 3 * D >> (shift - 1);
    B = lsh(3 * (y1 - y0), upShift);
    C = lsh(3 * (y0 - y1 - y1 + y2), upShift);
    D = lsh(y3 + 3 * (y1 - y2) - y0, upShift);
    e->fCy = FDot6ToFixed(y0);
    e->fCDy = B + (C >> shift) + (D >> 2 * shift);
    e->fCDDy = 2 * C + (3 * D >> (shift - 1));
    e->fCDDDy = 3 * D >> (shift - 1);
    e->fCLastX = FDot6ToFixed(x3); e->fCLastY = FDot6ToFixed(y3);
    /* setCubic */
    e->fCx >>= kDefaultAccuracy; e->fCy >>= kDefaultAccuracy;
    e->fCDx >>= kDefaultAccuracy; e->fCDy >>= kDefaultAccuracy;
    e->fCDDx >>= kDefaultAccuracy; e->fCDDy >>= kDefaultAccuracy;
    e->fCDDDx >>= kDefaultAccuracy; e->fCDDDy >>= kDefaultAccuracy;
    e->fCLastX >>= kDefaultAccuracy; e->fCLastY >>= kDefaultAccuracy;
    e->fCy = SnapY(e->fCy);
    e->fCSnappedY = e->fCy;
    e->fCLastY = SnapY(e->fCLastY);
    e->fEdgeType = E_CUBIC;
    return cubic_update(e);
}

static int cubic_update(Edge *e) {
    int success, count = e->fCurveCount;
    SkFixed oldx = e->fCx, oldy = e->fCy, newx, newy;
    const int ddshift = e->fCurveShift, dshift = e->fCubicDShift;
    do {
        if (++count < 0) {
            newx = oldx + (e->fCDx >> dshift);
            e->fCDx += e->fCDDx >> ddshift;
            e->fCDDx += e->fCDDDx;
            newy = oldy + (e->fCDy >> dshift);
            e->fCDy += e->fCDDy >> ddshift;
            e->fCDDy += e->fCDDDy;
        } else {
            newx = e->fCLastX; newy = e->fCLastY;
        }
        if (newy < oldy) newy = oldy;
        SkFixed newSnappedY = SnapY(newy);
        if (e->fCLastY < newSnappedY) { newSnappedY = e->fCLastY; count = 0; }
        SkFixed slope = FixedToFDot6(newSnappedY - e->fCSnappedY) == 0 ? SK_MaxS32
                        : FDot6Div(FixedToFDot6(newx - oldx), FixedToFDot6(newSnappedY - e->fCSnappedY));
        success = edge_update_line(e, oldx, e->fCSnappedY, newx, newSnappedY, slope);
        oldx = newx; oldy = newy;
        e->fCSnappedY = newSnappedY;
    } while (count < 0 && !success);
    e->fCx = newx; e->fCy = newy;
    e->fCurveCount = (int8_t)count;
    return success;
}

static inline int edge_update(Edge *e) {
    if (e->fCurveCount < 0) return cubic_update(e);
    if (e->fCurveCount > 0) return quad_update(e);
    return 0;
}
static inline void goY(Edge *e, SkFixed y) {
    if (y == e->fY + SK_Fixed1) { e->fX = e->fX + e->fDX; e->fY = y; }
    else if (y != e->fY) { e->fX = e->fUpperX + FixedMul(e->fDX, y - e->fUpperY); e->fY = y; }
}
static inline void goYs(Edge *e, SkFixed y, int yShift) { e->fY = y; e->fX += e->fDX >> yShift; }
static inline void quad_keep(Edge *e) { e->fSnappedX = e->fX; e->fSnappedY = e->fY; }
static inline void cubic_keep(Edge *e) { e->fCx = e->fX; e->fCSnappedY = e->fY; }

/* ------------------------------------------------------------------ edge builder */
typedef struct { Edge *e; int n, cap; Edge **list; int nl, capl; } EdgeList;

static Edge *el_new(EdgeList *L) {
    if (L->n == L->cap) {
        /* edges are referenced by pointer: allocate in chunks that never move */
        int nc = L->cap ? L->cap * 2 : 64;
        (void)nc;
    }
    Edge *e = (Edge *)calloc(1, sizeof(Edge));
    return e;
}
static void el_push(EdgeList *L, Edge *e) {
    if (L->nl == L->capl) { L->capl = L->capl ? L->capl * 2 : 64; L->list = (Edge **)realloc(L->list, L->capl * sizeof(Edge *)); }
    L->list[L->nl++] = e;
}
static void el_free(EdgeList *L) { for (int i = 0; i < L->nl; i++) free(L->list[i]); free(L->list); }

enum { kNo_Combine, kPartial_Combine, kTotal_Combine };
static int combine_vertical(const Edge *edge, Edge *last) {
#define APPROX(a, b) (iabs((a) - (b)) < 0x100)
    if (last->fEdgeType != E_LINE || last->fDX || edge->fX != last->fX) return kNo_Combine;
    if (edge->fWinding == last->fWinding) {
        if (edge->fLowerY == last->fUpperY) { last->fUpperY = edge->fUpperY; last->fY = last->fUpperY; return kPartial_Combine; }
        if (APPROX(edge->fUpperY, last->fLowerY)) { last->fLowerY = edge->fLowerY; return kPartial_Combine; }
        return kNo_Combine;
    }
    if (APPROX(edge->fUpperY, last->fUpperY)) {
        if (APPROX(edge->fLowerY, last->fLowerY)) return kTotal_Combine;
        if (edge->fLowerY < last->fLowerY) { last->fUpperY = edge->fLowerY; last->fY = last->fUpperY; return kPartial_Combine; }
        last->fUpperY = last->fLowerY; last->fY = last->fUpperY; last->fLowerY = edge->fLowerY; last->fWinding = edge->fWinding;
        return kPartial_Combine;
    }
    if (APPROX(edge->fLowerY, last->fLowerY)) {
        if (edge->fUpperY > last->fUpperY) { last->fLowerY = edge->fUpperY; return kPartial_Combine; }
        last->fLowerY = last->fUpperY; last->fUpperY = edge->fUpperY; last->fY = last->fUpperY; last->fWinding = edge->fWinding;
        return kPartial_Combine;
    }
    return kNo_Combine;
}

static void add_line(EdgeList *L, const Pt pts[2]) {
    Edge *e = el_new(L);
    if (edge_set_line(e, pts[0], pts[1])) {
        int combine = (e->fDX == 0 && e->fEdgeType == E_LINE && L->nl) ? combine_vertical(e, L->list[L->nl - 1]) : kNo_Combine;
        switch (combine) {
            case kTotal_Combine: free(L->list[--L->nl]); free(e); break;
            case kPartial_Combine: free(e); break;
            case kNo_Combine: el_push(L, e); break;
        }
    } else free(e);
}
static void add_quad(EdgeList *L, const Pt pts[3]) {
    Edge *e = el_new(L);
    if (quad_set(e, pts)) el_push(L, e); else free(e);
}
static void add_cubic(EdgeList *L, const Pt pts[4]) {
    Edge *e = el_new(L);
    if (cubic_set(e, pts)) el_push(L, e); else free(e);
}
static void handle_quad(EdgeList *L, const Pt pts[3]) {
    Pt mono[5];
    int n = chop_quad_at_y_extrema(pts, mono);
    for (int i = 0; i <= n; i++) add_quad(L, &mono[i * 2]);
}

/* SkPathEdgeIter-driven edge emission; `clip` != NULL -> SkEdgeClipper path */
typedef void (*EdgeFn)(void *ctx, int verb, const Pt *pts, float w);
static void iterate_edges(const Path *p, EdgeFn fn, void *ctx) {
    int pi = 0, wi = 0, needsClose = 0;
    Pt moveTo = {0, 0}, last = {0, 0};
    for (int i = 0; i <= p->nverbs; i++) {
        int v = i < p->nverbs ? p->verbs[i] : -1;
        if (v == -1 || v == V_MOVE || v == V_CLOSE) {
            if (needsClose) { Pt q[2] = {last, moveTo}; fn(ctx, V_LINE, q, 0); needsClose = 0; }
            if (v == V_MOVE) { moveTo = last = p->pts[pi]; pi += 1; }
            continue;
        }
        Pt q[4]; q[0] = last;
        int n = v == V_LINE ? 1 : (v == V_QUAD || v == V_CONIC) ? 2 : 3;
        for (int k = 0; k < n; k++) q[k + 1] = p->pts[pi + k];
        pi += n;
        float w = v == V_CONIC ? p->w[wi++] : 0;
        fn(ctx, v, q, w);
        last = q[n];
        needsClose = 1;
    }
}

static void build_cb(void *ctx, int verb, const Pt *pts, float w) {
    EdgeList *L = (EdgeList *)ctx;
    switch (verb) {
        case V_LINE: add_line(L, pts); break;
        case V_QUAD: handle_quad(L, pts); break;
        case V_CONIC: {
            Pt q[1 + 2 * 32];
            int nq = conic_to_quads(pts, w, 0.25f, q);
            for (int i = 0; i < nq; i++) handle_quad(L, &q[2 * i]);
            break;
        }
        case V_CUBIC: {
            Pt mono[10];
            int n = chop_cubic_at_y_extrema(pts, mono);
            for (int i = 0; i <= n; i++) add_cubic(L, &mono[i * 3]);
            break;
        }
    }
}

/* clipped edge building (SkEdgeClipper) lives in vr_clip.c */
void clip_path_edges(const Path *p, float cl, float ct, float cr, float cb, int canCullToTheRight,
                     void (*emit)(void *ctx, int verb, const Pt *pts), void *ctx);
static void build_clip_cb(void *ctx, int verb, const Pt *pts) {
    EdgeList *L = (EdgeList *)ctx;
    if (verb == V_LINE) add_line(L, pts);
    else if (verb == V_QUAD) add_quad(L, pts);
    else if (verb == V_CUBIC) add_cubic(L, pts);
}

static int build_edges(Path *p, const int *clip, EdgeList *L) {
    if (clip) {
        int canCull = !path_is_convex(p);
        if ((path_segment_mask(p) & ~1) == 0) {
            /* buildPoly: lines only, clipped with SkLineClipper */
            clip_path_edges(p, (float)clip[0], (float)clip[1], (float)clip[2], (float)clip[3], canCull, build_clip_cb, L);
        } else {
            clip_path_edges(p, (float)clip[0], (float)clip[1], (float)clip[2], (float)clip[3], canCull, build_clip_cb, L);
        }
    } else {
        iterate_edges(p, build_cb, L);
    }
    return L->nl;
}

/* ------------------------------------------------------------------ additive blitters */
enum { AB_MASK = 0, AB_RLE = 1, AB_SAFERLE = 2 };
typedef struct {
    int mode;
    Blitter *real;
    /* mask */
    uint8_t *mstore; uint8_t *mimg; int mL, mT, mW, mH, mRB;
    int clipL, clipT, clipR, clipB;
    /* RLE */
    uint8_t *alpha; int fLeft, fWidth, fTop, fCurrY;
} Additive;

static inline uint8_t catch_overflow(int a) { return (uint8_t)(a - (a >> 8)); }
static inline void add_alpha(uint8_t *a, int d) { *a = catch_overflow(*a + d); }
static inline void safely_add_alpha(uint8_t *a, int d) { int s = *a + d; *a = (uint8_t)(s > 255 ? 255 : s); }

static uint8_t *mask_row(Additive *ab, int y) { return ab->mimg + (size_t)(y - ab->mT) * ab->mRB - ab->mL; }

static void rle_flush(Additive *ab) {
    if (ab->fCurrY >= ab->fTop) {
        int any = 0;
        for (int x = 0; x < ab->fWidth; x++) {
            uint8_t a = ab->alpha[x];
            a = a > 247 ? 0xFF : a < 8 ? 0x00 : a;
            ab->alpha[x] = a;
            if (a) any = 1;
        }
        if (any) bl_blitAntiH(ab->real, ab->fLeft, ab->fCurrY, ab->alpha, ab->fWidth);
        memset(ab->alpha, 0, ab->fWidth);
        ab->fCurrY = ab->fTop - 1;
    }
}
static inline void rle_checkY(Additive *ab, int y) { if (y != ab->fCurrY) { rle_flush(ab); ab->fCurrY = y; } }
static inline void flush_if_y_changed(Additive *ab, SkFixed y, SkFixed nextY) {
    if (ab->mode != AB_MASK && FixedFloorToInt(y) != FixedFloorToInt(nextY)) rle_flush(ab);
}

/* AdditiveBlitter::blitAntiH(x, y, antialias[], len) */
static void ab_antiH_arr(Additive *ab, int x, int y, const uint8_t *aa, int len) {
    if (ab->mode == AB_MASK) return;   /* never called for the mask blitter */
    rle_checkY(ab, y);
    x -= ab->fLeft;
    if (x < 0) { len += x; aa -= x; x = 0; }
    if (len > ab->fWidth - x) len = ab->fWidth - x;
    for (int i = 0; i < len; i++) {
        if (ab->mode == AB_RLE) add_alpha(&ab->alpha[x + i], aa[i]);
        else safely_add_alpha(&ab->alpha[x + i], aa[i]);
    }
}
/* blitAntiH(x, y, alpha) */
static void ab_antiH1(Additive *ab, int x, int y, int alpha) {
    if (ab->mode == AB_MASK) { add_alpha(&mask_row(ab, y)[x], alpha); return; }
    rle_checkY(ab, y);
    x -= ab->fLeft;
    if (x >= 0 && x + 1 <= ab->fWidth) {
        if (ab->mode == AB_RLE) add_alpha(&ab->alpha[x], alpha);
        else safely_add_alpha(&ab->alpha[x], alpha);
    }
}
/* blitAntiH(x, y, width, alpha) */
static void ab_antiHw(Additive *ab, int x, int y, int width, int alpha) {
    if (ab->mode == AB_MASK) { uint8_t *row = mask_row(ab, y); for (int i = 0; i < width; i++) add_alpha(&row[x + i], alpha); return; }
    rle_checkY(ab, y);
    x -= ab->fLeft;
    if (x >= 0 && x + width <= ab->fWidth) {
        for (int i = 0; i < width; i++) {
            if (ab->mode == AB_RLE) add_alpha(&ab->alpha[x + i], alpha);
            else safely_add_alpha(&ab->alpha[x + i], alpha);
        }
    }
}
/* getRealBlitter()->... : for the mask blitter these write into the mask */
static void rb_blitV(Additive *ab, int x, int y, int h, int alpha) {
    if (ab->mode == AB_MASK) {
        if (alpha == 0) return;
        uint8_t *row = mask_row(ab, y);
        for (int i = 0; i < h; i++) { row[x] = (uint8_t)alpha; row += ab->mRB; }
        return;
    }
    bl_blitV(ab->real, x, y, h, alpha);
}
static void rb_blitRect(Additive *ab, int x, int y, int w, int h) {
    if (ab->mode == AB_MASK) {
        uint8_t *row = mask_row(ab, y);
        for (int i = 0; i < h; i++) { memset(row + x, 0xFF, w); row += ab->mRB; }
        return;
    }
    bl_blitRect(ab->real, x, y, w, h);
}
static void rb_blitAntiRect(Additive *ab, int x, int y, int w, int h, int la, int ra) {
    if (ab->mode == AB_MASK) {
        rb_blitV(ab, x, y, h, la);
        rb_blitV(ab, x + 1 + w, y, h, ra);
        rb_blitRect(ab, x + 1, y, w, h);
        return;
    }
    bl_blitAntiRect(ab->real, x, y, w, h, la, ra);
}

/* ------------------------------------------------------------------ alpha helpers */
static inline uint8_t trapezoid_to_alpha(SkFixed l1, SkFixed l2) { SkFixed area = (l1 + l2) / 2; return (uint8_t)(area >> 8); }
static inline uint8_t partial_triangle_to_alpha(SkFixed a, SkFixed b) {
    SkFixed area = (a >> 11) * (a >> 11) * (b >> 11);
    return (uint8_t)((area >> 8) & 0xFF);
}
static inline uint8_t partial_alpha_h(int alpha, SkFixed partialHeight) { return (uint8_t)FixedRoundToInt(alpha * partialHeight); }
static inline uint8_t partial_alpha_a(int alpha, int fullAlpha) { return (uint8_t)((alpha * fullAlpha) >> 8); }
static inline uint8_t fixed_to_alpha(SkFixed f) { return partial_alpha_h(0xFF, f); }
static SkFixed approximate_intersection(SkFixed l1, SkFixed r1, SkFixed l2, SkFixed r2) {
    if (l1 > r1) { SkFixed t = l1; l1 = r1; r1 = t; }
    if (l2 > r2) { SkFixed t = l2; l2 = r2; r2 = t; }
    return ((l1 > l2 ? l1 : l2) + (r1 < r2 ? r1 : r2)) / 2;
}

static void compute_alpha_above_line(uint8_t *alphas, SkFixed l, SkFixed r, SkFixed dY, int fullAlpha) {
    int R = FixedCeilToInt(r);
    if (R == 0) return;
    else if (R == 1) alphas[0] = partial_alpha_a(((R << 17) - l - r) >> 9, fullAlpha);
    else {
        SkFixed first = SK_Fixed1 - l, last = r - ((R - 1) << 16);
        SkFixed firstH = FixedMul(first, dY);
        alphas[0] = (uint8_t)(FixedMul(first, firstH) >> 9);
        SkFixed alpha16 = sat_add(firstH, dY >> 1);
        for (int i = 1; i < R - 1; ++i) { alphas[i] = (uint8_t)(alpha16 >> 8); alpha16 = sat_add(alpha16, dY); }
        alphas[R - 1] = (uint8_t)(fullAlpha - partial_triangle_to_alpha(last, dY));
    }
}
static void compute_alpha_below_line(uint8_t *alphas, SkFixed l, SkFixed r, SkFixed dY, int fullAlpha) {
    int R = FixedCeilToInt(r);
    if (R == 0) return;
    else if (R == 1) alphas[0] = partial_alpha_a(trapezoid_to_alpha(l, r), fullAlpha);
    else {
        SkFixed first = SK_Fixed1 - l, last = r - ((R - 1) << 16);
        SkFixed lastH = FixedMul(last, dY);
        alphas[R - 1] = (uint8_t)(FixedMul(last, lastH) >> 9);
        SkFixed alpha16 = sat_add(lastH, dY >> 1);
        for (int i = R - 2; i > 0; i--) { alphas[i] = (uint8_t)((alpha16 >> 8) & 0xFF); alpha16 = sat_add(alpha16, dY); }
        alphas[0] = (uint8_t)(fullAlpha - partial_triangle_to_alpha(first, dY));
    }
}

static void blit_single_alpha(Additive *ab, int y, int x, int alpha, int fullAlpha, uint8_t *maskRow, int noReal) {
    if (maskRow) {
        if (fullAlpha == 0xFF && !noReal) maskRow[x] = (uint8_t)alpha;
        else safely_add_alpha(&maskRow[x], partial_alpha_a(alpha, fullAlpha));
    } else {
        if (fullAlpha == 0xFF && !noReal) bl_blitV(ab->real, x, y, 1, alpha);
        else ab_antiH1(ab, x, y, partial_alpha_a(alpha, fullAlpha));
    }
}
static void blit_two_alphas(Additive *ab, int y, int x, int a1, int a2, int fullAlpha, uint8_t *maskRow, int noReal) {
    if (maskRow) { safely_add_alpha(&maskRow[x], a1); safely_add_alpha(&maskRow[x + 1], a2); }
    else {
        if (fullAlpha == 0xFF && !noReal) bl_blitAntiH2(ab->real, x, y, a1, a2);
        else { ab_antiH1(ab, x, y, a1); ab_antiH1(ab, x + 1, y, a2); }
    }
}
static void blit_full_alpha(Additive *ab, int y, int x, int len, int fullAlpha, uint8_t *maskRow, int noReal) {
    if (maskRow) { for (int i = 0; i < len; ++i) safely_add_alpha(&maskRow[x + i], fullAlpha); }
    else {
        if (fullAlpha == 0xFF && !noReal) bl_blitH(ab->real, x, y, len);
        else ab_antiHw(ab, x, y, len, fullAlpha);
    }
}

static void blit_aaa_trapezoid_row(Additive *ab, int y, SkFixed ul, SkFixed ur, SkFixed ll, SkFixed lr,
                                   SkFixed lDY, SkFixed rDY, int fullAlpha, uint8_t *maskRow, int noReal) {
    int L = FixedFloorToInt(ul), R = FixedCeilToInt(lr);
    int len = R - L;
    if (len == 1) {
        uint8_t alpha = trapezoid_to_alpha(ur - ul, lr - ll);
        blit_single_alpha(ab, y, L, alpha, fullAlpha, maskRow, noReal);
        return;
    }
    uint8_t qbuf[2 * 64];
    uint8_t *alphas = len + 1 <= 64 ? qbuf : (uint8_t *)malloc(2 * (len + 1));
    uint8_t *temp = alphas + len + 1;
    for (int i = 0; i < len; ++i) alphas[i] = (uint8_t)fullAlpha;
    int uL = FixedFloorToInt(ul), lL = FixedCeilToInt(ll);
    if (uL + 2 == lL) {
        SkFixed first = IntToFixed(uL) + SK_Fixed1 - ul, second = ll - ul - first;
        uint8_t a1 = (uint8_t)(fullAlpha - partial_triangle_to_alpha(first, lDY));
        uint8_t a2 = partial_triangle_to_alpha(second, lDY);
        alphas[0] = alphas[0] > a1 ? alphas[0] - a1 : 0;
        alphas[1] = alphas[1] > a2 ? alphas[1] - a2 : 0;
    } else {
        compute_alpha_below_line(temp + uL - L, ul - IntToFixed(uL), ll - IntToFixed(uL), lDY, fullAlpha);
        for (int i = uL; i < lL; ++i) {
            if (alphas[i - L] > temp[i - L]) alphas[i - L] -= temp[i - L]; else alphas[i - L] = 0;
        }
    }
    int uR = FixedFloorToInt(ur), lR = FixedCeilToInt(lr);
    if (uR + 2 == lR) {
        SkFixed first = IntToFixed(uR) + SK_Fixed1 - ur, second = lr - ur - first;
        uint8_t a1 = partial_triangle_to_alpha(first, rDY);
        uint8_t a2 = (uint8_t)(fullAlpha - partial_triangle_to_alpha(second, rDY));
        alphas[len - 2] = alphas[len - 2] > a1 ? alphas[len - 2] - a1 : 0;
        alphas[len - 1] = alphas[len - 1] > a2 ? alphas[len - 1] - a2 : 0;
    } else {
        compute_alpha_above_line(temp + uR - L, ur - IntToFixed(uR), lr - IntToFixed(uR), rDY, fullAlpha);
        for (int i = uR; i < lR; ++i) {
            if (alphas[i - L] > temp[i - L]) alphas[i - L] -= temp[i - L]; else alphas[i - L] = 0;
        }
    }
    if (maskRow) { for (int i = 0; i < len; ++i) safely_add_alpha(&maskRow[L + i], alphas[i]); }
    else {
        if (fullAlpha == 0xFF && !noReal) bl_blitAntiH(ab->real, L, y, alphas, len);
        else ab_antiH_arr(ab, L, y, alphas, len);
    }
    if (alphas != qbuf) free(alphas);
}

static void blit_trapezoid_row(Additive *ab, int y, SkFixed ul, SkFixed ur, SkFixed ll, SkFixed lr,
                               SkFixed lDY, SkFixed rDY, int fullAlpha, uint8_t *maskRow, int noReal) {
    if (ul > ur) return;
    if (ll > lr) ll = lr = approximate_intersection(ul, ll, ur, lr);
    if (ul == ur && ll == lr) return;
    if (ul > ll) { SkFixed t = ul; ul = ll; ll = t; }
    if (ur > lr) { SkFixed t = ur; ur = lr; lr = t; }
    SkFixed joinLeft = FixedCeilToFixed(ll), joinRite = FixedFloorToFixed(ur);
    if (joinLeft <= joinRite) {
        if (ul < joinLeft) {
            int len = FixedCeilToInt(joinLeft - ul);
            if (len == 1) {
                uint8_t alpha = trapezoid_to_alpha(joinLeft - ul, joinLeft - ll);
                blit_single_alpha(ab, y, ul >> 16, alpha, fullAlpha, maskRow, noReal);
            } else if (len == 2) {
                SkFixed first = joinLeft - SK_Fixed1 - ul, second = ll - ul - first;
                uint8_t a1 = partial_triangle_to_alpha(first, lDY);
                uint8_t a2 = (uint8_t)(fullAlpha - partial_triangle_to_alpha(second, lDY));
                blit_two_alphas(ab, y, ul >> 16, a1, a2, fullAlpha, maskRow, noReal);
            } else {
                blit_aaa_trapezoid_row(ab, y, ul, joinLeft, ll, joinLeft, lDY, SK_MaxS32, fullAlpha, maskRow, noReal);
            }
        }
        if (joinLeft < joinRite) {
            blit_full_alpha(ab, y, FixedFloorToInt(joinLeft), FixedFloorToInt(joinRite - joinLeft), fullAlpha, maskRow, noReal);
        }
        if (lr > joinRite) {
            int len = FixedCeilToInt(lr - joinRite);
            if (len == 1) {
                uint8_t alpha = trapezoid_to_alpha(ur - joinRite, lr - joinRite);
                blit_single_alpha(ab, y, joinRite >> 16, alpha, fullAlpha, maskRow, noReal);
            } else if (len == 2) {
                SkFixed first = joinRite + SK_Fixed1 - ur, second = lr - ur - first;
                uint8_t a1 = (uint8_t)(fullAlpha - partial_triangle_to_alpha(first, rDY));
                uint8_t a2 = partial_triangle_to_alpha(second, rDY);
                blit_two_alphas(ab, y, joinRite >> 16, a1, a2, fullAlpha, maskRow, noReal);
            } else {
                blit_aaa_trapezoid_row(ab, y, joinRite, ur, joinRite, lr, SK_MaxS32, rDY, fullAlpha, maskRow, noReal);
            }
        }
    } else {
        blit_aaa_trapezoid_row(ab, y, ul, ur, ll, lr, lDY, rDY, fullAlpha, maskRow, noReal);
    }
}

/* ------------------------------------------------------------------ edge list helpers */
static int compare_edges(const void *pa, const void *pb) {
    const Edge *a = *(const Edge *const *)pa, *b = *(const Edge *const *)pb;
    if (a->fUpperY != b->fUpperY) return a->fUpperY < b->fUpperY ? -1 : 1;
    if (a->fX != b->fX) return a->fX < b->fX ? -1 : 1;
    if (a->fDX != b->fDX) return a->fDX < b->fDX ? -1 : 1;
    return 0;
}
/* SkTQSort (introsort: insertion sort <= 32, Lomuto partition on the middle element, heap sort at depth 0) --
 * not stable, so the order of equal-key edges must follow Skia exactly */
static inline int edge_less(const Edge *a, const Edge *b) {
    if (a->fUpperY != b->fUpperY) return a->fUpperY < b->fUpperY;
    if (a->fX != b->fX) return a->fX < b->fX;
    return a->fDX < b->fDX;
}
static void ins_sort(Edge **left, int count) {
    Edge **right = left + count - 1;
    for (Edge **next = left + 1; next <= right; ++next) {
        if (!edge_less(*next, *(next - 1))) continue;
        Edge *insert = *next; Edge **hole = next;
        do { *hole = *(hole - 1); --hole; } while (left < hole && edge_less(insert, *(hole - 1)));
        *hole = insert;
    }
}
static void heap_sift_down(Edge **a, size_t root, size_t bottom) {
    Edge *x = a[root - 1]; size_t child = root << 1;
    while (child <= bottom) {
        if (child < bottom && edge_less(a[child - 1], a[child])) ++child;
        if (edge_less(x, a[child - 1])) { a[root - 1] = a[child - 1]; root = child; child = root << 1; }
        else break;
    }
    a[root - 1] = x;
}
static void heap_sift_up(Edge **a, size_t root, size_t bottom) {
    Edge *x = a[root - 1]; size_t start = root, j = root << 1;
    while (j <= bottom) {
        if (j < bottom && edge_less(a[j - 1], a[j])) ++j;
        a[root - 1] = a[j - 1]; root = j; j = root << 1;
    }
    j = root >> 1;
    while (j >= start) {
        if (edge_less(a[j - 1], x)) { a[root - 1] = a[j - 1]; root = j; j = root >> 1; }
        else break;
    }
    a[root - 1] = x;
}
static void heap_sort(Edge **a, size_t count) {
    for (size_t i = count >> 1; i > 0; --i) heap_sift_down(a, i, count);
    for (size_t i = count - 1; i > 0; --i) { Edge *t = a[0]; a[0] = a[i]; a[i] = t; heap_sift_up(a, 1, i); }
}
static Edge **qs_partition(Edge **left, int count, Edge **pivot) {
    Edge **right = left + count - 1;
    Edge *pv = *pivot, *t;
    t = *pivot; *pivot = *right; *right = t;
    Edge **np = left;
    while (left < right) {
        if (edge_less(*left, pv)) { t = *left; *left = *np; *np = t; np += 1; }
        left += 1;
    }
    t = *np; *np = *right; *right = t;
    return np;
}
static void intro_sort(int depth, Edge **left, int count) {
    for (;;) {
        if (count <= 32) { ins_sort(left, count); return; }
        if (depth == 0) { heap_sort(left, (size_t)count); return; }
        --depth;
        Edge **middle = left + ((count - 1) >> 1);
        Edge **pivot = qs_partition(left, count, middle);
        int pc = (int)(pivot - left);
        intro_sort(depth, left, pc);
        left += pc + 1;
        count -= pc + 1;
    }
}
static void sk_tqsort(Edge **list, int n) {
    if (n <= 1) return;
    unsigned v = (unsigned)(n - 1) - 1;
    int depth = 2 * (32 - (v ? __builtin_clz(v) : 32));
    intro_sort(depth, list, n);
}
static inline void remove_edge(Edge *e) { e->fPrev->fNext = e->fNext; e->fNext->fPrev = e->fPrev; }
static inline void insert_edge_after(Edge *e, Edge *after) {
    e->fPrev = after; e->fNext = after->fNext; after->fNext->fPrev = e; after->fNext = e;
}
static void backward_insert_edge_based_on_x(Edge *e) {
    SkFixed x = e->fX;
    Edge *prev = e->fPrev;
    while (prev->fPrev && prev->fX > x) prev = prev->fPrev;
    if (prev->fNext != e) { remove_edge(e); insert_edge_after(e, prev); }
}
static Edge *backward_insert_start(Edge *prev, SkFixed x) {
    while (prev->fPrev && prev->fX > x) prev = prev->fPrev;
    return prev;
}

static int is_smooth_enough1(Edge *thisE, Edge *nextE, int stop_y) {
    (void)stop_y;
    if (thisE->fCurveCount < 0) {
        int ddshift = thisE->fCurveShift;
        return iabs(thisE->fCDx) >> 1 >= iabs(thisE->fCDDx) >> ddshift &&
               iabs(thisE->fCDy) >> 1 >= iabs(thisE->fCDDy) >> ddshift &&
               (thisE->fCDy - (thisE->fCDDy >> ddshift)) >> thisE->fCubicDShift >= SK_Fixed1;
    } else if (thisE->fCurveCount > 0) {
        return iabs(thisE->fQDx) >> 1 >= iabs(thisE->fQDDx) &&
               iabs(thisE->fQDy) >> 1 >= iabs(thisE->fQDDy) &&
               (thisE->fQDy - thisE->fQDDy) >> thisE->fCurveShift >= SK_Fixed1;
    }
    return iabs(sat_sub(nextE->fDX, thisE->fDX)) <= SK_Fixed1 && nextE->fLowerY - nextE->fUpperY >= SK_Fixed1;
}
static int is_smooth_enough(Edge *leftE, Edge *riteE, Edge *currE, int stop_y) {
    if (currE->fUpperY >= lsh(stop_y, 16)) return 0;
    if (leftE->fLowerY + SK_Fixed1 < riteE->fLowerY) return is_smooth_enough1(leftE, currE, stop_y);
    else if (leftE->fLowerY > riteE->fLowerY + SK_Fixed1) return is_smooth_enough1(riteE, currE, stop_y);
    Edge *nextCurrE = currE->fNext;
    if (nextCurrE->fUpperY >= stop_y << 16) return 0;
    if (nextCurrE->fUpperX < currE->fUpperX) { Edge *t = currE; currE = nextCurrE; nextCurrE = t; }
    return is_smooth_enough1(leftE, currE, stop_y) && is_smooth_enough1(riteE, nextCurrE, stop_y);
}

static void aaa_walk_convex_edges(Edge *prevHead, Additive *ab, int start_y, int stop_y,
                                  SkFixed leftBound, SkFixed riteBound, int isUsingMask) {
    (void)start_y;
    Edge *leftE = prevHead->fNext, *riteE = leftE->fNext, *currE = riteE->fNext;
    SkFixed y = leftE->fUpperY > riteE->fUpperY ? leftE->fUpperY : riteE->fUpperY;
    for (;;) {
        while (leftE->fLowerY <= y) {
            if (!edge_update(leftE)) {
                if (FixedFloorToInt(currE->fUpperY) >= stop_y) goto END_WALK;
                leftE = currE; currE = currE->fNext;
            }
        }
        while (riteE->fLowerY <= y) {
            if (!edge_update(riteE)) {
                if (FixedFloorToInt(currE->fUpperY) >= stop_y) goto END_WALK;
                riteE = currE; currE = currE->fNext;
            }
        }
        if (FixedFloorToInt(y) >= stop_y) break;
        goY(leftE, y); goY(riteE, y);
        if (leftE->fX > riteE->fX || (leftE->fX == riteE->fX && leftE->fDX > riteE->fDX)) { Edge *t = leftE; leftE = riteE; riteE = t; }
        SkFixed local_bot_fixed = leftE->fLowerY < riteE->fLowerY ? leftE->fLowerY : riteE->fLowerY;
        if (is_smooth_enough(leftE, riteE, currE, stop_y)) local_bot_fixed = FixedCeilToFixed(local_bot_fixed);
        if (local_bot_fixed > IntToFixed(stop_y)) local_bot_fixed = IntToFixed(stop_y);
        SkFixed left = leftBound > leftE->fX ? leftBound : leftE->fX;
        SkFixed dLeft = leftE->fDX;
        SkFixed rite = riteBound < riteE->fX ? riteBound : riteE->fX;
        SkFixed dRite = riteE->fDX;
        if (0 == (dLeft | dRite)) {
            int fullLeft = FixedCeilToInt(left), fullRite = FixedFloorToInt(rite);
            SkFixed partialLeft = IntToFixed(fullLeft) - left, partialRite = rite - IntToFixed(fullRite);
            int fullTop = FixedCeilToInt(y), fullBot = FixedFloorToInt(local_bot_fixed);
            SkFixed partialTop = IntToFixed(fullTop) - y, partialBot = local_bot_fixed - IntToFixed(fullBot);
            if (fullTop > fullBot) { partialTop -= (SK_Fixed1 - partialBot); partialBot = 0; }
            if (fullRite >= fullLeft) {
                if (partialTop > 0) {
                    if (partialLeft > 0) ab_antiH1(ab, fullLeft - 1, fullTop - 1, fixed_to_alpha(FixedMul(partialTop, partialLeft)));
                    ab_antiHw(ab, fullLeft, fullTop - 1, fullRite - fullLeft, fixed_to_alpha(partialTop));
                    if (partialRite > 0) ab_antiH1(ab, fullRite, fullTop - 1, fixed_to_alpha(FixedMul(partialTop, partialRite)));
                    flush_if_y_changed(ab, y, y + partialTop);
                }
                if (fullBot > fullTop && (fullRite > fullLeft || fixed_to_alpha(partialLeft) > 0 || fixed_to_alpha(partialRite) > 0)) {
                    rb_blitAntiRect(ab, fullLeft - 1, fullTop, fullRite - fullLeft, fullBot - fullTop,
                                    fixed_to_alpha(partialLeft), fixed_to_alpha(partialRite));
                }
                if (partialBot > 0) {
                    if (partialLeft > 0) ab_antiH1(ab, fullLeft - 1, fullBot, fixed_to_alpha(FixedMul(partialBot, partialLeft)));
                    ab_antiHw(ab, fullLeft, fullBot, fullRite - fullLeft, fixed_to_alpha(partialBot));
                    if (partialRite > 0) ab_antiH1(ab, fullRite, fullBot, fixed_to_alpha(FixedMul(partialBot, partialRite)));
                }
            } else {
                SkFixed width = rite - left;
                if (width > 0) {
                    if (partialTop > 0) {
                        ab_antiHw(ab, fullLeft - 1, fullTop - 1, 1, fixed_to_alpha(FixedMul(partialTop, width)));
                        flush_if_y_changed(ab, y, y + partialTop);
                    }
                    if (fullBot > fullTop) rb_blitV(ab, fullLeft - 1, fullTop, fullBot - fullTop, fixed_to_alpha(width));
                    if (partialBot > 0) ab_antiHw(ab, fullLeft - 1, fullBot, 1, fixed_to_alpha(FixedMul(partialBot, width)));
                }
            }
            y = local_bot_fixed;
        } else {
            const SkFixed kSnapDigit = SK_Fixed1 >> 4, kSnapHalf = kSnapDigit >> 1;
            const SkFixed kSnapMask = (-1 ^ (kSnapDigit - 1));
            left += kSnapHalf; rite += kSnapHalf;
            int count = FixedCeilToInt(local_bot_fixed) - FixedFloorToInt(y);
            uint8_t *maskRow = isUsingMask ? mask_row(ab, y >> 16) : NULL;
            if (count > 1) {
                if ((int)(y & 0xFFFF0000) != y) {
                    count--;
                    SkFixed nextY = FixedCeilToFixed(y + 1), dY = nextY - y;
                    SkFixed nextLeft = left + FixedMul(dLeft, dY), nextRite = rite + FixedMul(dRite, dY);
                    blit_trapezoid_row(ab, y >> 16, left & kSnapMask, rite & kSnapMask, nextLeft & kSnapMask,
                                       nextRite & kSnapMask, leftE->fDY, riteE->fDY, partial_alpha_h(0xFF, dY), maskRow, 0);
                    flush_if_y_changed(ab, y, nextY);
                    left = nextLeft; rite = nextRite; y = nextY;
                }
                while (count > 1) {
                    count--;
                    if (isUsingMask) maskRow = mask_row(ab, y >> 16);
                    SkFixed nextY = y + SK_Fixed1, nextLeft = left + dLeft, nextRite = rite + dRite;
                    blit_trapezoid_row(ab, y >> 16, left & kSnapMask, rite & kSnapMask, nextLeft & kSnapMask,
                                       nextRite & kSnapMask, leftE->fDY, riteE->fDY, 0xFF, maskRow, 0);
                    flush_if_y_changed(ab, y, nextY);
                    left = nextLeft; rite = nextRite; y = nextY;
                }
            }
            if (isUsingMask) maskRow = mask_row(ab, y >> 16);
            SkFixed dY = local_bot_fixed - y;
            SkFixed nextLeft = left + FixedMul(dLeft, dY), nextRite = rite + FixedMul(dRite, dY);
            if (nextLeft < leftBound + kSnapHalf) nextLeft = leftBound + kSnapHalf;
            if (nextRite > riteBound + kSnapHalf) nextRite = riteBound + kSnapHalf;
            blit_trapezoid_row(ab, y >> 16, left & kSnapMask, rite & kSnapMask, nextLeft & kSnapMask,
                               nextRite & kSnapMask, leftE->fDY, riteE->fDY, partial_alpha_h(0xFF, dY), maskRow, 0);
            flush_if_y_changed(ab, y, local_bot_fixed);
            left = nextLeft; rite = nextRite; y = local_bot_fixed;
            left -= kSnapHalf; rite -= kSnapHalf;
        }
        leftE->fX = left; riteE->fX = rite;
        leftE->fY = riteE->fY = y;
    }
END_WALK:;
}

static inline void update_next_next_y(SkFixed y, SkFixed nextY, SkFixed *nextNextY) {
    *nextNextY = y > nextY && y < *nextNextY ? y : *nextNextY;
}
static inline void check_intersection(const Edge *e, SkFixed nextY, SkFixed *nextNextY) {
    if (e->fPrev->fPrev && e->fPrev->fX + e->fPrev->fDX > e->fX + e->fDX) *nextNextY = nextY + (SK_Fixed1 >> kDefaultAccuracy);
}
static inline void check_intersection_fwd(const Edge *e, SkFixed nextY, SkFixed *nextNextY) {
    if (e->fNext->fNext && e->fX + e->fDX > e->fNext->fX + e->fNext->fDX) *nextNextY = nextY + (SK_Fixed1 >> kDefaultAccuracy);
}
static void insert_new_edges(Edge *newEdge, SkFixed y, SkFixed *nextNextY) {
    if (newEdge->fUpperY > y) { update_next_next_y(newEdge->fUpperY, y, nextNextY); return; }
    Edge *prev = newEdge->fPrev;
    if (prev->fX <= newEdge->fX) {
        while (newEdge->fUpperY <= y) {
            check_intersection(newEdge, y, nextNextY);
            update_next_next_y(newEdge->fLowerY, y, nextNextY);
            newEdge = newEdge->fNext;
        }
        update_next_next_y(newEdge->fUpperY, y, nextNextY);
        return;
    }
    Edge *start = backward_insert_start(prev, newEdge->fX);
    do {
        Edge *next = newEdge->fNext;
        do {
            if (start->fNext == newEdge) goto nextEdge;
            Edge *after = start->fNext;
            if (after->fX >= newEdge->fX) break;
            start = after;
        } while (1);
        remove_edge(newEdge);
        insert_edge_after(newEdge, start);
    nextEdge:
        check_intersection(newEdge, y, nextNextY);
        check_intersection_fwd(newEdge, y, nextNextY);
        update_next_next_y(newEdge->fLowerY, y, nextNextY);
        start = newEdge;
        newEdge = next;
    } while (newEdge->fUpperY <= y);
    update_next_next_y(newEdge->fUpperY, y, nextNextY);
}

static int edges_too_close(Edge *prev, Edge *next, SkFixed lowerY) {
    const SkFixed SLACK = SK_Fixed1;
    return next && prev && next->fUpperY < lowerY && prev->fX + SLACK >= next->fX - iabs(next->fDX);
}
static int edges_too_close_i(int prevRite, SkFixed ul, SkFixed ll) {
    return prevRite > FixedFloorToInt(ul) || prevRite > FixedFloorToInt(ll);
}

static void aaa_walk_edges(Edge *prevHead, Edge *nextTail, int fillType, Additive *ab, int start_y, int stop_y,
                           SkFixed leftClip, SkFixed rightClip, int isUsingMask, int forceRLE, int skipIntersect) {
    prevHead->fX = prevHead->fUpperX = leftClip;
    nextTail->fX = nextTail->fUpperX = rightClip;
    SkFixed y = prevHead->fNext->fUpperY > IntToFixed(start_y) ? prevHead->fNext->fUpperY : IntToFixed(start_y);
    SkFixed nextNextY = SK_MaxS32;
    {
        Edge *edge;
        for (edge = prevHead->fNext; edge->fUpperY <= y; edge = edge->fNext) {
            goY(edge, y);
            update_next_next_y(edge->fLowerY, y, &nextNextY);
        }
        update_next_next_y(edge->fUpperY, y, &nextNextY);
    }
    int windingMask = (fillType == FILL_EVENODD) ? 1 : -1;
    const int isInverse = 0;
    while (1) {
        int w = 0;
        int in_interval = isInverse;
        SkFixed prevX = prevHead->fX;
        SkFixed nextY = nextNextY < FixedCeilToFixed(y + 1) ? nextNextY : FixedCeilToFixed(y + 1);
        Edge *currE = prevHead->fNext, *leftE = prevHead;
        SkFixed left = leftClip, leftDY = 0;
        int prevRite = FixedFloorToInt(leftClip);
        nextNextY = SK_MaxS32;
        int yShift = 0;
        if ((nextY - y) & (SK_Fixed1 >> 2)) { yShift = 2; nextY = y + (SK_Fixed1 >> 2); }
        else if ((nextY - y) & (SK_Fixed1 >> 1)) { yShift = 1; }
        int fullAlpha = fixed_to_alpha(nextY - y);
        uint8_t *maskRow = isUsingMask ? mask_row(ab, FixedFloorToInt(y)) : NULL;
        int noRealBlitter = forceRLE;
        while (currE->fUpperY <= y) {
            w += currE->fWinding;
            int prev_in_interval = in_interval;
            in_interval = (!(w & windingMask)) == isInverse;
            int isLeft = in_interval && !prev_in_interval;
            int isRite = !in_interval && prev_in_interval;
            if (isRite) {
                SkFixed rite = currE->fX;
                goYs(currE, nextY, yShift);
                SkFixed nextLeft = leftClip > leftE->fX ? leftClip : leftE->fX;
                rite = rightClip < rite ? rightClip : rite;
                SkFixed nextRite = rightClip < currE->fX ? rightClip : currE->fX;
                blit_trapezoid_row(ab, y >> 16, left, rite, nextLeft, nextRite, leftDY, currE->fDY, fullAlpha, maskRow,
                                   noRealBlitter || (fullAlpha == 0xFF && (edges_too_close_i(prevRite, left, leftE->fX) ||
                                                                          edges_too_close(currE, currE->fNext, nextY))));
                SkFixed mx = rite > currE->fX ? rite : currE->fX;
                prevRite = FixedCeilToInt(mx);
            } else {
                if (isLeft) {
                    left = currE->fX > leftClip ? currE->fX : leftClip;
                    leftDY = currE->fDY;
                    leftE = currE;
                }
                goYs(currE, nextY, yShift);
            }
            Edge *next = currE->fNext;
            SkFixed newX;
            while (currE->fLowerY <= nextY) {
                if (currE->fCurveCount < 0) { cubic_keep(currE); if (!cubic_update(currE)) break; }
                else if (currE->fCurveCount > 0) { quad_keep(currE); if (!quad_update(currE)) break; }
                else break;
            }
            if (currE->fLowerY <= nextY) {
                remove_edge(currE);
            } else {
                update_next_next_y(currE->fLowerY, nextY, &nextNextY);
                newX = currE->fX;
                if (newX < prevX) backward_insert_edge_based_on_x(currE);
                else prevX = newX;
                if (!skipIntersect) check_intersection(currE, nextY, &nextNextY);
            }
            currE = next;
        }
        if (in_interval) {
            SkFixed nl = leftClip > leftE->fX ? leftClip : leftE->fX;
            blit_trapezoid_row(ab, y >> 16, left, rightClip, nl, rightClip, leftDY, 0, fullAlpha, maskRow,
                               noRealBlitter || (fullAlpha == 0xFF && edges_too_close(leftE->fPrev, leftE, nextY)));
        }
        if (forceRLE) flush_if_y_changed(ab, y, nextY);
        y = nextY;
        if (y >= IntToFixed(stop_y)) break;
        insert_new_edges(currE, y, &nextNextY);
    }
}

static void aaa_fill_path(Path *path, const int clipRect[4], Additive *ab, int start_y, int stop_y,
                          int pathContainedInClip, int isUsingMask, int forceRLE, int irL, int irR) {
    EdgeList L; memset(&L, 0, sizeof L);
    int count = build_edges(path, pathContainedInClip ? NULL : clipRect, &L);
    if (count == 0) { el_free(&L); return; }
    sk_tqsort(L.list, count);
    for (int i = 1; i < count; ++i) { L.list[i - 1]->fNext = L.list[i]; L.list[i]->fPrev = L.list[i - 1]; }
    Edge *edge = L.list[0], *last = L.list[count - 1];
    Edge head, tail; memset(&head, 0, sizeof head); memset(&tail, 0, sizeof tail);
    head.fPrev = NULL; head.fNext = edge; head.fUpperY = head.fLowerY = SK_MinS32;
    head.fX = SK_MinS32; head.fDX = 0; head.fDY = SK_MaxS32; head.fUpperX = SK_MinS32;
    edge->fPrev = &head;
    tail.fPrev = last; tail.fNext = NULL; tail.fUpperY = tail.fLowerY = SK_MaxS32;
    tail.fX = SK_MaxS32; tail.fDX = 0; tail.fDY = SK_MaxS32; tail.fUpperX = SK_MaxS32;
    last->fNext = &tail;
    if (!pathContainedInClip && start_y < clipRect[1]) start_y = clipRect[1];
    if (!pathContainedInClip && stop_y > clipRect[3]) stop_y = clipRect[3];
    SkFixed leftBound = IntToFixed(clipRect[0]), rightBound = IntToFixed(clipRect[2]);
    if (isUsingMask) {
        if (IntToFixed(irL) > leftBound) leftBound = IntToFixed(irL);
        if (IntToFixed(irR) < rightBound) rightBound = IntToFixed(irR);
    }
    if (path_is_convex(path) && count >= 2) {
        aaa_walk_convex_edges(&head, ab, start_y, stop_y, leftBound, rightBound, isUsingMask);
    } else {
        int skipIntersect = path->npts > (stop_y - start_y) * 2;
        aaa_walk_edges(&head, &tail, path->fill, ab, start_y, stop_y, leftBound, rightBound, isUsingMask, forceRLE, skipIntersect);
    }
    el_free(&L);
}

int vr_force_convex = -1;   /* debug: -1 auto, 0 concave, 1 convex */
/* SkScan::AntiFillPath -> AAAFillPath */
void fill_path_aa(Canvas *c, Path *path, const Paint *paint) {
    float bl, bt, br, bb;
    if (vr_force_convex >= 0) path->convex = vr_force_convex;
    if (!path_bounds(path, &bl, &bt, &br, &bb)) return;
    for (int i = 0; i < path->npts; i++) if (!isfinite(path->pts[i].x) || !isfinite(path->pts[i].y)) return;
    int irL = (int)floorf(bl), irT = (int)floorf(bt), irR = (int)ceilf(br), irB = (int)ceilf(bb);
    if (irL >= irR || irT >= irB) return;
    int clip[4] = {c->clipL, c->clipT, c->clipR, c->clipB};
    int cl = irL > clip[0] ? irL : clip[0], ct = irT > clip[1] ? irT : clip[1];
    int cr = irR < clip[2] ? irR : clip[2], cb = irB < clip[3] ? irB : clip[3];
    if (cl >= cr || ct >= cb) return;
    int contained = irL >= clip[0] && irT >= clip[1] && irR <= clip[2] && irB <= clip[3];
    /* SkScanClipper: a wrapper blitter only when horizontally clipped */
    int hclip = !contained && (clip[0] > irL || clip[2] < irR);
    Blitter real; bl_init(&real, c, paint, hclip);
    Additive ab; memset(&ab, 0, sizeof ab); ab.real = &real;
    int w = irR - irL;
    int64_t rb = (w + 3) & ~3;
    int canMask = w <= 32 && rb * (irB - irT) <= 1024;
    if (canMask) {
        float rl, rt, rr, rbt;
        if (path_is_rect(path, &rl, &rt, &rr, &rbt)) {
            /* try_blit_fat_anti_rect */
            float il = rl > clip[0] ? rl : clip[0], it = rt > clip[1] ? rt : clip[1];
            float ir = rr < clip[2] ? rr : clip[2], ib = rbt < clip[3] ? rbt : clip[3];
            if (!(il < ir && it < ib)) { bl_done(&real); return; }
            int bw = (int)ceilf(ir) - (int)floorf(il);
            if (bw >= 3) { bl_blitFatAntiRect(&real, il, it, ir, ib); bl_done(&real); return; }
        }
        ab.mode = AB_MASK;
        ab.mL = irL; ab.mT = irT; ab.mW = w; ab.mH = irB - irT; ab.mRB = w;
        ab.mstore = (uint8_t *)calloc((size_t)ab.mRB * ab.mH + 4, 1);
        ab.mimg = ab.mstore + 1;
        aaa_fill_path(path, clip, &ab, irT, irB, contained, 1, 0, irL, irR);
        /* ~MaskAdditiveBlitter: blitMask(fMask, fClipRect = ir ∩ clip) */
        bl_blitMask(&real, ab.mimg, ab.mRB, irL, irT, cl, ct, cr, cb);
        free(ab.mstore);
    } else {
        ab.mode = path_is_convex(path) ? AB_RLE : AB_SAFERLE;
        ab.fLeft = cl; ab.fWidth = cr - cl; ab.fTop = ct; ab.fCurrY = ct - 1;
        ab.alpha = (uint8_t *)calloc(ab.fWidth + 2, 1);
        aaa_fill_path(path, clip, &ab, irT, irB, contained, 0, 0, irL, irR);
        rle_flush(&ab);
        free(ab.alpha);
    }
    bl_done(&real);
}
