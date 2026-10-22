/* vr_stroke.c -- SkStroke / SkStrokerPriv port (Skia @ Chromium 141), float math in Skia's
 * evaluation order (build with -ffp-contract=off). */
#include "vr.h"
#include <math.h>
#include <string.h>
#include <stdlib.h>

#define NEARLY_ZERO (1.0f / (1 << 12))
#define ROOT2OVER2 0.707106781f
#define SQRT2 1.41421356f

static inline Pt P(float x, float y) { Pt r = {x, y}; return r; }
static inline Pt add(Pt a, Pt b) { return P(a.x + b.x, a.y + b.y); }
static inline Pt sub(Pt a, Pt b) { return P(a.x - b.x, a.y - b.y); }
static inline Pt neg(Pt a) { return P(-a.x, -a.y); }
static inline Pt scl(Pt a, float s) { return P(a.x * s, a.y * s); }
static inline float dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }
static inline float cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
static inline int peq(Pt a, Pt b) { return a.x == b.x && a.y == b.y; }
static inline int isfin2(float a, float b) { return isfinite(a) && isfinite(b); }
static inline int nearly_zero(float x, float tol) { return fabsf(x) <= tol; }
static inline int can_normalize(float dx, float dy) { return isfin2(dx, dy) && (dx != 0 || dy != 0); }
static inline float dist_sqd(Pt a, Pt b) { float dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
static inline float len_sqd(Pt a) { return dot(a, a); }

/* SkPoint::setLength (set_point_length<false>) */
static int set_length(Pt *pt, float x, float y, float length) {
    double xx = x, yy = y;
    double dmag = sqrt(xx * xx + yy * yy);
    double dscale = (double)length / dmag;
    x = (float)(x * dscale);
    y = (float)(y * dscale);
    if (!isfin2(x, y) || (x == 0 && y == 0)) { pt->x = pt->y = 0; return 0; }
    pt->x = x; pt->y = y;
    return 1;
}
static inline int set_normalize(Pt *pt, float x, float y) { return set_length(pt, x, y, 1); }
static inline void rotate_ccw(Pt *v) { float t = v->x; v->x = v->y; v->y = -t; }   /* (x,y) -> (y,-x) */
static inline void rotate_cw(Pt src, Pt *dst) { float t = src.x; dst->x = -src.y; dst->y = t; }

/* ------------------------------------------------------------------ geometry (SkGeometry) */
static Pt eval_quad(const Pt s[3], float t) {
    /* SkQuadCoeff: C = P0, B = 2(P1-P0), A = P2 - 2P1 + P0 ; (A t + B) t + C */
    float Bx = (s[1].x - s[0].x); Bx = Bx + Bx; float By = (s[1].y - s[0].y); By = By + By;
    float P1x2 = s[1].x + s[1].x, P1y2 = s[1].y + s[1].y;
    float Ax = s[2].x - P1x2 + s[0].x, Ay = s[2].y - P1y2 + s[0].y;
    return P((Ax * t + Bx) * t + s[0].x, (Ay * t + By) * t + s[0].y);
}
static Pt eval_quad_tangent(const Pt s[3], float t) {
    if ((t == 0 && peq(s[0], s[1])) || (t == 1 && peq(s[1], s[2]))) return sub(s[2], s[0]);
    Pt B = sub(s[1], s[0]);
    Pt A = sub(sub(s[2], s[1]), B);
    Pt T = P(A.x * t + B.x, A.y * t + B.y);
    return add(T, T);
}
static Pt eval_cubic_pt(const Pt s[4], float t) {
    /* SkCubicCoeff: A = P3 + 3(P1-P2) - P0, B = 3(P2 - 2P1 + P0), C = 3(P1-P0), D = P0 */
    float Ax = s[3].x + 3 * (s[1].x - s[2].x) - s[0].x, Ay = s[3].y + 3 * (s[1].y - s[2].y) - s[0].y;
    float Bx = 3 * (s[2].x - (s[1].x + s[1].x) + s[0].x), By = 3 * (s[2].y - (s[1].y + s[1].y) + s[0].y);
    float Cx = 3 * (s[1].x - s[0].x), Cy = 3 * (s[1].y - s[0].y);
    return P(((Ax * t + Bx) * t + Cx) * t + s[0].x, ((Ay * t + By) * t + Cy) * t + s[0].y);
}
static Pt eval_cubic_derivative(const Pt s[4], float t) {
    /* A = P3 + 3(P1-P2) - P0, B = 2(P2 - 2P1 + P0), C = P1 - P0 ; quad eval */
    float Ax = s[3].x + 3 * (s[1].x - s[2].x) - s[0].x, Ay = s[3].y + 3 * (s[1].y - s[2].y) - s[0].y;
    float bx = s[2].x - (s[1].x + s[1].x) + s[0].x, by = s[2].y - (s[1].y + s[1].y) + s[0].y;
    float Bx = bx + bx, By = by + by;
    float Cx = s[1].x - s[0].x, Cy = s[1].y - s[0].y;
    return P((Ax * t + Bx) * t + Cx, (Ay * t + By) * t + Cy);
}
static void eval_cubic(const Pt s[4], float t, Pt *loc, Pt *tangent) {
    if (loc) *loc = eval_cubic_pt(s, t);
    if (tangent) {
        if ((t == 0 && peq(s[0], s[1])) || (t == 1 && peq(s[2], s[3]))) {
            *tangent = t == 0 ? sub(s[2], s[0]) : sub(s[3], s[1]);
            if (!tangent->x && !tangent->y) *tangent = sub(s[3], s[0]);
        } else *tangent = eval_cubic_derivative(s, t);
    }
}
typedef struct { Pt p[3]; float w; } Conic;
static Pt conic_eval(const Conic *c, float t) {
    Pt p0 = c->p[0], p1 = c->p[1], p2 = c->p[2];
    float ww = c->w;
    Pt p1w = scl(p1, ww);
    /* numer: C = p0, A = p2 - 2 p1w + p0, B = 2 (p1w - p0) */
    Pt nA = P(p2.x - (p1w.x + p1w.x) + p0.x, p2.y - (p1w.y + p1w.y) + p0.y);
    Pt nB = sub(p1w, p0); nB = add(nB, nB);
    float dC = 1, dB = ww - dC; dB = dB + dB; float dA = 0 - dB;
    Pt numer = P((nA.x * t + nB.x) * t + p0.x, (nA.y * t + nB.y) * t + p0.y);
    float denom = (dA * t + dB) * t + dC;
    return P(numer.x / denom, numer.y / denom);
}
static Pt conic_tangent(const Conic *c, float t) {
    if ((t == 0 && peq(c->p[0], c->p[1])) || (t == 1 && peq(c->p[1], c->p[2]))) return sub(c->p[2], c->p[0]);
    Pt p20 = sub(c->p[2], c->p[0]), p10 = sub(c->p[1], c->p[0]);
    Pt C = scl(p10, c->w);
    Pt A = sub(scl(p20, c->w), p20);
    Pt B = sub(sub(p20, C), C);
    return P((A.x * t + B.x) * t + C.x, (A.y * t + B.y) * t + C.y);
}
static float find_quad_max_curvature(const Pt s[3]) {
    float Ax = s[1].x - s[0].x, Ay = s[1].y - s[0].y;
    float Bx = s[0].x - s[1].x - s[1].x + s[2].x, By = s[0].y - s[1].y - s[1].y + s[2].y;
    float numer = -(Ax * Bx + Ay * By);
    float denom = Bx * Bx + By * By;
    if (denom < 0) { numer = -numer; denom = -denom; }
    if (numer <= 0) return 0;
    if (numer >= denom) return 1;
    return numer / denom;
}
static void bubble_sort(float a[], int n) {
    for (int i = 1; i < n; i++) for (int j = i; j > 0 && a[j - 1] > a[j]; j--) { float t = a[j]; a[j] = a[j - 1]; a[j - 1] = t; }
}
static int collaps_duplicates(float array[], int count) {
    for (int n = count; n > 1; --n) {
        if (array[0] == array[1]) {
            for (int i = 1; i < n; ++i) array[i - 1] = array[i];
            count -= 1;
        } else array += 1;
    }
    return count;
}
static inline float pinf(float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); }  /* SkTPin: max(lo, min(v, hi)) */
static int solve_cubic_poly(const float coeff[4], float tValues[3]) {
    if (nearly_zero(coeff[0], NEARLY_ZERO)) return find_unit_quad_roots(coeff[1], coeff[2], coeff[3], tValues);
    float a, b, c, Q, R;
    { float inva = 1.0f / coeff[0]; a = coeff[1] * inva; b = coeff[2] * inva; c = coeff[3] * inva; }
    Q = (a * a - b * 3) / 9;
    R = (2 * a * a * a - 9 * a * b + 27 * c) / 54;
    float Q3 = Q * Q * Q;
    float R2MinusQ3 = R * R - Q3;
    float adiv3 = a / 3;
    if (R2MinusQ3 < 0) {
        float theta = acosf(pinf(R / sqrtf(Q3), -1.0f, 1.0f));
        float neg2RootQ = -2 * sqrtf(Q);
        tValues[0] = pinf(neg2RootQ * cosf(theta / 3) - adiv3, 0.0f, 1.0f);
        tValues[1] = pinf(neg2RootQ * cosf((theta + 2 * 3.14159265f) / 3) - adiv3, 0.0f, 1.0f);
        tValues[2] = pinf(neg2RootQ * cosf((theta - 2 * 3.14159265f) / 3) - adiv3, 0.0f, 1.0f);
        bubble_sort(tValues, 3);
        return collaps_duplicates(tValues, 3);
    } else {
        float A = fabsf(R) + sqrtf(R2MinusQ3);
        A = powf(A, 0.3333333f);
        if (R > 0) A = -A;
        if (A != 0) A += Q / A;
        tValues[0] = pinf(A - adiv3, 0.0f, 1.0f);
        return 1;
    }
}
static void formulate_F1DotF2(const float src[], float coeff[4]) {   /* src stride 2 */
    float a = src[2] - src[0];
    float b = src[4] - 2 * src[2] + src[0];
    float c = src[6] + 3 * (src[2] - src[4]) - src[0];
    coeff[0] = c * c;
    coeff[1] = 3 * b * c;
    coeff[2] = 2 * b * b + c * a;
    coeff[3] = a * b;
}
static int find_cubic_max_curvature(const Pt s[4], float tValues[3]) {
    float cx[4], cy[4];
    formulate_F1DotF2(&s[0].x, cx);
    formulate_F1DotF2(&s[0].y, cy);
    for (int i = 0; i < 4; i++) cx[i] += cy[i];
    return solve_cubic_poly(cx, tValues);
}
static int find_cubic_inflections(const Pt s[4], float tValues[2]) {
    float Ax = s[1].x - s[0].x, Ay = s[1].y - s[0].y;
    float Bx = s[2].x - 2 * s[1].x + s[0].x, By = s[2].y - 2 * s[1].y + s[0].y;
    float Cx = s[3].x + 3 * (s[1].x - s[2].x) - s[0].x, Cy = s[3].y + 3 * (s[1].y - s[2].y) - s[0].y;
    return find_unit_quad_roots(Bx * Cy - By * Cx, Ax * Cy - Ay * Cx, Ax * By - Ay * Bx, tValues);
}
static float calc_cubic_precision(const Pt s[4]) {
    return (dist_sqd(s[1], s[0]) + dist_sqd(s[2], s[1]) + dist_sqd(s[3], s[2])) * 1e-8f;
}
static int on_same_side(const Pt s[4], int testIndex, int lineIndex) {
    Pt origin = s[lineIndex];
    Pt line = sub(s[lineIndex + 1], origin);
    float crosses[2];
    for (int i = 0; i < 2; ++i) crosses[i] = cross(line, sub(s[testIndex + i], origin));
    return crosses[0] * crosses[1] >= 0;
}
static float find_cubic_cusp(const Pt s[4]) {
    if (peq(s[0], s[1])) return -1;
    if (peq(s[2], s[3])) return -1;
    if (on_same_side(s, 0, 2) || on_same_side(s, 2, 0)) return -1;
    float mc[3];
    int roots = find_cubic_max_curvature(s, mc);
    for (int i = 0; i < roots; ++i) {
        float t = mc[i];
        if (0 >= t || t >= 1) continue;
        Pt d = eval_cubic_derivative(s, t);
        if (len_sqd(d) < calc_cubic_precision(s)) return t;
    }
    return -1;
}

/* SkConic::BuildUnitArc + SkMatrix(setSinCos, preScale, postConcat(scale+translate)) mapPoints */
static int build_unit_arc(Pt uStart, Pt uStop, int ccw, float radius, Pt pivot, Conic dst[5]) {
    float x = dot(uStart, uStop);
    float y = cross(uStart, uStop);
    float absY = fabsf(y);
    if (absY <= NEARLY_ZERO && x > 0 && ((y >= 0 && !ccw) || (y <= 0 && ccw))) return 0;
    if (ccw) y = -y;
    int quadrant = 0;
    if (0 == y) quadrant = 2;
    else if (0 == x) quadrant = y > 0 ? 1 : 3;
    else { if (y < 0) quadrant += 2; if ((x < 0) != (y < 0)) quadrant += 1; }
    static const Pt qp[8] = {{1, 0}, {1, 1}, {0, 1}, {-1, 1}, {-1, 0}, {-1, -1}, {0, -1}, {1, -1}};
    int conicCount = quadrant;
    for (int i = 0; i < conicCount; ++i) { dst[i].p[0] = qp[i * 2]; dst[i].p[1] = qp[i * 2 + 1]; dst[i].p[2] = qp[i * 2 + 2]; dst[i].w = ROOT2OVER2; }
    Pt finalP = {x, y};
    Pt lastQ = qp[quadrant * 2];
    float d = dot(lastQ, finalP);
    if (isnan(d)) return 0;
    if (d < 1) {
        Pt off = {lastQ.x + x, lastQ.y + y};
        float cosThetaOver2 = sqrtf((1 + d) / 2);
        set_length(&off, off.x, off.y, 1.0f / cosThetaOver2);
        if (!(nearly_zero(lastQ.x - off.x, NEARLY_ZERO) && nearly_zero(lastQ.y - off.y, NEARLY_ZERO))) {
            dst[conicCount].p[0] = lastQ; dst[conicCount].p[1] = off; dst[conicCount].p[2] = finalP; dst[conicCount].w = cosThetaOver2;
            conicCount += 1;
        }
    }
    /* matrix: setSinCos(sin=uStart.y, cos=uStart.x) -> [c -s 0; s c 0]; preScale(1,-1) if ccw;
       postConcat(scale(r) then translate(pivot)) */
    float sinV = uStart.y, cosV = uStart.x;
    float m_sx = cosV, m_kx = -sinV, m_tx = 0, m_ky = sinV, m_sy = cosV, m_ty = 0;
    if (ccw) { m_kx = -m_kx; m_sy = -m_sy; }   /* preScale(1,-1): column 1 negated */
    /* postConcat(user) where user = [r 0 px; 0 r py]:  M' = user * M  (SkMatrix::setConcat via mul / muladdmul in float->double?) */
    /* SkMatrix::setConcat(a,b) for scale+translate 'a' (user) and general 'b':
       uses muladdmul(a.sx, b.sx, a.kx, b.ky) = (float)((double)a*b + (double)c*d)  */
    Mat user = {radius, 0, pivot.x, 0, radius, pivot.y};
    Mat rot = {m_sx, m_kx, m_tx, m_ky, m_sy, m_ty};
    Mat m; mat_concat(&m, &user, &rot);
    for (int i = 0; i < conicCount; ++i) mat_map(&m, dst[i].p, dst[i].p, 3);
    return conicCount;
}

/* ------------------------------------------------------------------ path iterator (SkPath::Iter, forceClose=false) */
typedef struct {
    const Path *p; int vi, pi, wi;
    Pt moveTo, lastPt; int needClose;
} Iter;
static void iter_init(Iter *it, const Path *p) { memset(it, 0, sizeof *it); it->p = p; }
/* returns verb or -1 at end; pts[] filled; *w conic weight */
static int auto_close(Iter *it, Pt pts[2]) {
    if (!peq(it->lastPt, it->moveTo)) {
        if (isnan(it->lastPt.x) || isnan(it->lastPt.y) || isnan(it->moveTo.x) || isnan(it->moveTo.y)) return V_CLOSE;
        pts[0] = it->lastPt; pts[1] = it->moveTo; it->lastPt = it->moveTo;
        return V_LINE;
    }
    pts[0] = it->moveTo;
    return V_CLOSE;
}
static int iter_next(Iter *it, Pt pts[4], float *w) {
    const Path *p = it->p;
    if (it->vi >= p->nverbs) {
        if (it->needClose) {
            if (auto_close(it, pts) == V_LINE) return V_LINE;
            it->needClose = 0;
            return V_CLOSE;
        }
        return -1;
    }
    int verb = p->verbs[it->vi++];
    const Pt *src = p->pts + it->pi;
    switch (verb) {
        case V_MOVE:
            if (it->needClose) {
                it->vi--;
                verb = auto_close(it, pts);
                if (verb == V_CLOSE) it->needClose = 0;
                return verb;
            }
            if (it->vi >= p->nverbs) return -1;
            it->moveTo = src[0]; pts[0] = src[0]; it->pi += 1;
            it->lastPt = it->moveTo; it->needClose = 0;
            break;
        case V_LINE:
            pts[0] = it->lastPt; pts[1] = src[0]; it->lastPt = src[0]; it->pi += 1; break;
        case V_CONIC:
            *w = p->w[it->wi++];
            /* fallthrough */
        case V_QUAD:
            pts[0] = it->lastPt; pts[1] = src[0]; pts[2] = src[1]; it->lastPt = src[1]; it->pi += 2; break;
        case V_CUBIC:
            pts[0] = it->lastPt; pts[1] = src[0]; pts[2] = src[1]; pts[3] = src[2]; it->lastPt = src[2]; it->pi += 3; break;
        case V_CLOSE:
            verb = auto_close(it, pts);
            if (verb == V_LINE) it->vi--;
            else it->needClose = 0;
            it->lastPt = it->moveTo;
            break;
    }
    return verb;
}
static int has_valid_tangent(const Iter *iter) {
    Iter copy = *iter; Pt pts[4]; float w;
    int v;
    while ((v = iter_next(&copy, pts, &w)) >= 0) {
        switch (v) {
            case V_MOVE: return 0;
            case V_LINE: if (peq(pts[0], pts[1])) continue; return 1;
            case V_QUAD: case V_CONIC: if (peq(pts[0], pts[1]) && peq(pts[0], pts[2])) continue; return 1;
            case V_CUBIC: if (peq(pts[0], pts[1]) && peq(pts[0], pts[2]) && peq(pts[0], pts[3])) continue; return 1;
            case V_CLOSE: return 0;
        }
    }
    return 0;
}

/* ------------------------------------------------------------------ builder helpers */
static void set_last_pt(Path *p, Pt a) { if (p->npts == 0) path_move(p, a); else p->pts[p->npts - 1] = a; }
static int last_pt(const Path *p, Pt *a) { if (p->npts > 0) { *a = p->pts[p->npts - 1]; return 1; } return 0; }
/* privateReversePathTo: ignore the last point of the 1st contour */
static void reverse_path_to(Path *dst, const Path *src) {
    if (!src->nverbs) return;
    const Pt *pts = src->pts + src->npts - 1;
    int wi = src->nw;
    for (int vi = src->nverbs - 1; vi >= 0; vi--) {
        int v = src->verbs[vi];
        int n = v == V_MOVE ? 1 : v == V_LINE ? 1 : (v == V_QUAD || v == V_CONIC) ? 2 : v == V_CUBIC ? 3 : 0;
        pts -= n;
        switch (v) {
            case V_MOVE: return;
            case V_LINE: path_line(dst, pts[0]); break;
            case V_QUAD: path_quad(dst, pts[1], pts[0]); break;
            case V_CONIC: path_conic(dst, pts[1], pts[0], src->w[--wi]); break;
            case V_CUBIC: path_cubic(dst, pts[2], pts[1], pts[0]); break;
            case V_CLOSE: break;
        }
    }
}

/* ------------------------------------------------------------------ joiners / cappers (SkStrokerPriv) */
static int is_clockwise(Pt before, Pt after) { return before.x * after.y > before.y * after.x; }
enum { kNearly180, kSharp, kShallow, kNearlyLine };
static int dot2angle(float d) {
    if (d >= 0) return nearly_zero(1 - d, NEARLY_ZERO) ? kNearlyLine : kShallow;
    return nearly_zero(1 + d, NEARLY_ZERO) ? kNearly180 : kSharp;
}
static void handle_inner_join(Path *inner, Pt pivot, Pt after) {
    path_line(inner, pivot);
    path_line(inner, P(pivot.x - after.x, pivot.y - after.y));
}
static void blunt_joiner(Path *outer, Path *inner, Pt beforeUnitNormal, Pt pivot, Pt afterUnitNormal,
                         float radius, float invMiterLimit, int prevIsLine, int currIsLine) {
    (void)invMiterLimit; (void)prevIsLine; (void)currIsLine;
    Pt after = scl(afterUnitNormal, radius);
    if (!is_clockwise(beforeUnitNormal, afterUnitNormal)) { Path *t = outer; outer = inner; inner = t; after = neg(after); }
    path_line(outer, P(pivot.x + after.x, pivot.y + after.y));
    handle_inner_join(inner, pivot, after);
}
static void round_joiner(Path *outer, Path *inner, Pt beforeUnitNormal, Pt pivot, Pt afterUnitNormal,
                         float radius, float invMiterLimit, int prevIsLine, int currIsLine) {
    (void)invMiterLimit; (void)prevIsLine; (void)currIsLine;
    float dp = dot(beforeUnitNormal, afterUnitNormal);
    if (dot2angle(dp) == kNearlyLine) return;
    Pt before = beforeUnitNormal, after = afterUnitNormal;
    int ccw = 0;
    if (!is_clockwise(before, after)) { Path *t = outer; outer = inner; inner = t; before = neg(before); after = neg(after); ccw = 1; }
    Conic conics[5];
    int count = build_unit_arc(before, after, ccw, radius, pivot, conics);
    if (count > 0) {
        for (int i = 0; i < count; ++i) path_conic(outer, conics[i].p[1], conics[i].p[2], conics[i].w);
        after = scl(after, radius);
        handle_inner_join(inner, pivot, after);
    }
}
static void miter_joiner(Path *outer, Path *inner, Pt beforeUnitNormal, Pt pivot, Pt afterUnitNormal,
                         float radius, float invMiterLimit, int prevIsLine, int currIsLine) {
    float dp = dot(beforeUnitNormal, afterUnitNormal);
    int angleType = dot2angle(dp);
    Pt before = beforeUnitNormal, after = afterUnitNormal, mid;
    float sinHalfAngle;
    int ccw;
    if (angleType == kNearlyLine) return;
    if (angleType == kNearly180) { currIsLine = 0; goto DO_BLUNT; }
    ccw = !is_clockwise(before, after);
    if (ccw) { Path *t = outer; outer = inner; inner = t; before = neg(before); after = neg(after); }
    if (0 == dp && invMiterLimit <= ROOT2OVER2) {
        mid = scl(add(before, after), radius);
        goto DO_MITER;
    }
    sinHalfAngle = sqrtf((1 + dp) * 0.5f);
    if (sinHalfAngle < invMiterLimit) { currIsLine = 0; goto DO_BLUNT; }
    if (angleType == kSharp) {
        mid = P(after.y - before.y, before.x - after.x);
        if (ccw) mid = neg(mid);
    } else mid = P(before.x + after.x, before.y + after.y);
    set_length(&mid, mid.x, mid.y, radius / sinHalfAngle);
DO_MITER:
    if (prevIsLine) set_last_pt(outer, P(pivot.x + mid.x, pivot.y + mid.y));
    else path_line(outer, P(pivot.x + mid.x, pivot.y + mid.y));
DO_BLUNT:
    after = scl(after, radius);
    if (!currIsLine) path_line(outer, P(pivot.x + after.x, pivot.y + after.y));
    handle_inner_join(inner, pivot, after);
}
typedef void (*JoinProc)(Path *, Path *, Pt, Pt, Pt, float, float, int, int);
static JoinProc join_factory(int join) { return join == JOIN_ROUND ? round_joiner : join == JOIN_BEVEL ? blunt_joiner : miter_joiner; }

static void cap_proc(int cap, Path *sink, Pt pivot, Pt normal, Pt stop, int extendLastPt) {
    if (cap == CAP_BUTT) { path_line(sink, stop); return; }
    Pt parallel; rotate_cw(normal, &parallel);
    if (cap == CAP_ROUND) {
        Pt pc = add(pivot, parallel);
        path_conic(sink, add(pc, normal), pc, ROOT2OVER2);
        path_conic(sink, sub(pc, normal), stop, ROOT2OVER2);
        return;
    }
    if (extendLastPt) {
        set_last_pt(sink, P(pivot.x + normal.x + parallel.x, pivot.y + normal.y + parallel.y));
        path_line(sink, P(pivot.x - normal.x + parallel.x, pivot.y - normal.y + parallel.y));
    } else {
        path_line(sink, P(pivot.x + normal.x + parallel.x, pivot.y + normal.y + parallel.y));
        path_line(sink, P(pivot.x - normal.x + parallel.x, pivot.y - normal.y + parallel.y));
        path_line(sink, stop);
    }
}

/* ------------------------------------------------------------------ SkPathStroker */
typedef struct {
    Pt quad[3]; Pt tanStart, tanEnd; float startT, midT, endT; int startSet, endSet, oppositeTangents;
} QC;
static int qc_init(QC *q, float start, float end) {
    q->startT = start; q->midT = (start + end) * 0.5f; q->endT = end;
    q->startSet = q->endSet = 0;
    return q->startT < q->midT && q->midT < q->endT;
}
static int qc_init_start(QC *q, QC *parent) {
    if (!qc_init(q, parent->startT, parent->midT)) return 0;
    q->quad[0] = parent->quad[0]; q->tanStart = parent->tanStart; q->startSet = 1; return 1;
}
static int qc_init_end(QC *q, QC *parent) {
    if (!qc_init(q, parent->midT, parent->endT)) return 0;
    q->quad[2] = parent->quad[2]; q->tanEnd = parent->tanEnd; q->endSet = 1; return 1;
}

typedef struct {
    float radius, invMiterLimit, resScale, invResScale, invResScaleSquared;
    Pt firstNormal, prevNormal, firstUnitNormal, prevUnitNormal;
    Pt firstPt, prevPt, firstOuterPt;
    int firstOuterPtIndexInContour, segmentCount, prevIsLine;
    int cap; JoinProc joiner;
    Path inner, outer, cusper;
    int strokeType;
    int recursionDepth, foundTangents, joinCompleted;
} Stroker;
enum { kSplit, kDegenerate, kQuadR };
enum { kPointR, kLineR, kQuadRed, kDegenerateR, kDegenerate2R, kDegenerate3R };
static const int kRecursiveLimits[] = {5 * 3, 24, 11 * 3, 11 * 3};

static int set_normal_unitnormal(Pt before, Pt after, float scale, float radius, Pt *normal, Pt *unitNormal) {
    if (!set_normalize(unitNormal, (after.x - before.x) * scale, (after.y - before.y) * scale)) return 0;
    rotate_ccw(unitNormal);
    *normal = scl(*unitNormal, radius);
    return 1;
}
static int set_normal_unitnormal2(Pt vec, float radius, Pt *normal, Pt *unitNormal) {
    if (!set_normalize(unitNormal, vec.x, vec.y)) return 0;
    rotate_ccw(unitNormal);
    *normal = scl(*unitNormal, radius);
    return 1;
}
static int is_zero_length_since(const Path *p, int start) {
    int count = p->npts - start;
    if (count < 2) return 1;
    const Pt *pts = p->pts + start;
    for (int i = 1; i < count; ++i) if (!peq(pts[0], pts[i])) return 0;
    return 1;
}

static int st_prejoin(Stroker *s, Pt currPt, Pt *normal, Pt *unitNormal, int currIsLine) {
    if (!set_normal_unitnormal(s->prevPt, currPt, s->resScale, s->radius, normal, unitNormal)) {
        if (s->cap == CAP_BUTT) return 0;
        *normal = P(s->radius, 0); *unitNormal = P(1, 0);
    }
    if (s->segmentCount == 0) {
        s->firstNormal = *normal; s->firstUnitNormal = *unitNormal;
        s->firstOuterPt = add(s->prevPt, *normal);
        path_move(&s->outer, s->firstOuterPt);
        path_move(&s->inner, sub(s->prevPt, *normal));
    } else {
        s->joiner(&s->outer, &s->inner, s->prevUnitNormal, s->prevPt, *unitNormal, s->radius, s->invMiterLimit,
                  s->prevIsLine, currIsLine);
    }
    s->prevIsLine = currIsLine;
    return 1;
}
static void st_postjoin(Stroker *s, Pt currPt, Pt normal, Pt unitNormal) {
    s->joinCompleted = 1; s->prevPt = currPt; s->prevUnitNormal = unitNormal; s->prevNormal = normal; s->segmentCount += 1;
}
static void st_finish(Stroker *s, int close, int currIsLine) {
    if (s->segmentCount > 0) {
        Pt pt;
        if (close) {
            s->joiner(&s->outer, &s->inner, s->prevUnitNormal, s->prevPt, s->firstUnitNormal, s->radius,
                      s->invMiterLimit, s->prevIsLine, currIsLine);
            path_close(&s->outer);
            if (last_pt(&s->inner, &pt)) {
                path_move(&s->outer, pt);
                reverse_path_to(&s->outer, &s->inner);
                path_close(&s->outer);
            }
        } else {
            if (last_pt(&s->inner, &pt)) {
                cap_proc(s->cap, &s->outer, s->prevPt, s->prevNormal, pt, currIsLine);
                reverse_path_to(&s->outer, &s->inner);
                cap_proc(s->cap, &s->outer, s->firstPt, neg(s->firstNormal), s->firstOuterPt, s->prevIsLine);
                path_close(&s->outer);
            }
        }
        if (s->cusper.nverbs) { path_append(&s->outer, &s->cusper); path_reset(&s->cusper); }
    }
    path_reset(&s->inner);
    s->segmentCount = -1;
    s->firstOuterPtIndexInContour = s->outer.npts;
}
static void st_move(Stroker *s, Pt pt) {
    if (s->segmentCount > 0) st_finish(s, 0, 0);
    s->segmentCount = 0;
    s->firstPt = s->prevPt = pt;
    s->joinCompleted = 0;
}
static void st_line_to_(Stroker *s, Pt currPt, Pt normal) {
    path_line(&s->outer, add(currPt, normal));
    path_line(&s->inner, sub(currPt, normal));
}
static void st_line(Stroker *s, Pt currPt, const Iter *iter) {
    int teeny = nearly_zero(s->prevPt.x - currPt.x, NEARLY_ZERO * s->invResScale) &&
                nearly_zero(s->prevPt.y - currPt.y, NEARLY_ZERO * s->invResScale);
    if (s->cap == CAP_BUTT && teeny) return;
    if (teeny && (s->joinCompleted || (iter && has_valid_tangent(iter)))) return;
    Pt normal, unitNormal;
    if (!st_prejoin(s, currPt, &normal, &unitNormal, 1)) return;
    st_line_to_(s, currPt, normal);
    st_postjoin(s, currPt, normal, unitNormal);
}
static void set_quad_end_normal(Stroker *s, const Pt q[3], Pt nAB, Pt uAB, Pt *nBC, Pt *uBC) {
    if (!set_normal_unitnormal(q[1], q[2], s->resScale, s->radius, nBC, uBC)) { *nBC = nAB; *uBC = uAB; }
}
static int degenerate_vector(Pt v) { return !can_normalize(v.x, v.y); }
static void set_cubic_end_normal(Stroker *s, const Pt c[4], Pt nAB, Pt uAB, Pt *nCD, Pt *uCD) {
    Pt ab = sub(c[1], c[0]), cd = sub(c[3], c[2]);
    int dAB = degenerate_vector(ab), dCD = degenerate_vector(cd);
    if (dAB && dCD) goto DEG;
    if (dAB) { ab = sub(c[2], c[0]); dAB = degenerate_vector(ab); }
    if (dCD) { cd = sub(c[3], c[1]); dCD = degenerate_vector(cd); }
    if (dAB || dCD) { DEG: *nCD = nAB; *uCD = uAB; return; }
    set_normal_unitnormal2(cd, s->radius, nCD, uCD);
}
static void st_init(Stroker *s, int strokeType, QC *q, float tStart, float tEnd) {
    s->strokeType = strokeType; s->foundTangents = 0; qc_init(q, tStart, tEnd);
}
static float pt_to_line(Pt pt, Pt lineStart, Pt lineEnd) {
    Pt dxy = sub(lineEnd, lineStart), ab0 = sub(pt, lineStart);
    float numer = dot(dxy, ab0), denom = dot(dxy, dxy);
    float t = numer / denom;
    if (t >= 0 && t <= 1) {
        Pt hit = P(lineStart.x * (1 - t) + lineEnd.x * t, lineStart.y * (1 - t) + lineEnd.y * t);
        return dist_sqd(hit, pt);
    }
    return dist_sqd(pt, lineStart);
}
static float pt_to_tangent_line(Pt pt, Pt lineStart, Pt tangent) {
    Pt ab0 = sub(pt, lineStart);
    float numer = dot(tangent, ab0), denom = dot(tangent, tangent);
    float t = numer / denom;
    if (t >= 0 && t <= 1) {
        Pt hit = P(lineStart.x + tangent.x * t, lineStart.y + tangent.y * t);
        return dist_sqd(hit, pt);
    }
    return dist_sqd(pt, lineStart);
}
static int cubic_in_line(const Pt c[4]) {
    float ptMax = -1; int outer1 = 0, outer2 = 0;
    for (int i = 0; i < 3; ++i) for (int j = i + 1; j < 4; ++j) {
        Pt d = sub(c[j], c[i]);
        float m = fmaxf(fabsf(d.x), fabsf(d.y));
        if (ptMax < m) { outer1 = i; outer2 = j; ptMax = m; }
    }
    int mid1 = (1 + (2 >> outer2)) >> outer1;
    int mid2 = outer1 ^ outer2 ^ mid1;
    float lineSlop = ptMax * ptMax * 0.00001f;
    return pt_to_line(c[mid1], c[outer1], c[outer2]) <= lineSlop && pt_to_line(c[mid2], c[outer1], c[outer2]) <= lineSlop;
}
static int quad_in_line(const Pt q[3]) {
    float ptMax = -1; int outer1 = 0, outer2 = 0;
    for (int i = 0; i < 2; ++i) for (int j = i + 1; j < 3; ++j) {
        Pt d = sub(q[j], q[i]);
        float m = fmaxf(fabsf(d.x), fabsf(d.y));
        if (ptMax < m) { outer1 = i; outer2 = j; ptMax = m; }
    }
    int mid = outer1 ^ outer2 ^ 3;
    float lineSlop = ptMax * ptMax * 0.000005f;
    return pt_to_line(q[mid], q[outer1], q[outer2]) <= lineSlop;
}
static int check_cubic_linear(const Pt c[4], Pt red[3], const Pt **tanPt) {
    int dAB = degenerate_vector(sub(c[1], c[0])), dBC = degenerate_vector(sub(c[2], c[1])), dCD = degenerate_vector(sub(c[3], c[2]));
    if (dAB & dBC & dCD) return kPointR;
    if (dAB + dBC + dCD == 2) return kLineR;
    if (!cubic_in_line(c)) { *tanPt = dAB ? &c[2] : &c[1]; return kQuadRed; }
    float tv[3];
    int count = find_cubic_max_curvature(c, tv), rCount = 0;
    for (int i = 0; i < count; ++i) {
        float t = tv[i];
        if (0 >= t || t >= 1) continue;
        red[rCount] = eval_cubic_pt(c, t);
        if (!peq(red[rCount], c[0]) && !peq(red[rCount], c[3])) ++rCount;
    }
    if (rCount == 0) return kLineR;
    return kQuadRed + rCount;
}
static int check_conic_linear(const Conic *c, Pt *red) {
    int dAB = degenerate_vector(sub(c->p[1], c->p[0])), dBC = degenerate_vector(sub(c->p[2], c->p[1]));
    if (dAB & dBC) return kPointR;
    if (dAB | dBC) return kLineR;
    if (!quad_in_line(c->p)) return kQuadRed;
    float t = find_quad_max_curvature(c->p);
    if (0 == t || isnan(t)) return kLineR;
    *red = conic_eval(c, t);
    return kDegenerateR;
}
static int check_quad_linear(const Pt q[3], Pt *red) {
    int dAB = degenerate_vector(sub(q[1], q[0])), dBC = degenerate_vector(sub(q[2], q[1]));
    if (dAB & dBC) return kPointR;
    if (dAB | dBC) return kLineR;
    if (!quad_in_line(q)) return kQuadRed;
    float t = find_quad_max_curvature(q);
    if (0 == t || 1 == t) return kLineR;
    *red = eval_quad(q, t);
    return kDegenerateR;
}
static void set_ray_pts(const Stroker *s, Pt tPt, Pt *dxy, Pt *onPt, Pt *tangent) {
    if (!set_length(dxy, dxy->x, dxy->y, s->radius)) *dxy = P(s->radius, 0);
    float axisFlip = (float)s->strokeType;
    onPt->x = tPt.x + axisFlip * dxy->y;
    onPt->y = tPt.y - axisFlip * dxy->x;
    if (tangent) *tangent = *dxy;
}
static void conic_perp_ray(const Stroker *s, const Conic *c, float t, Pt *tPt, Pt *onPt, Pt *tangent) {
    *tPt = conic_eval(c, t);
    Pt dxy = conic_tangent(c, t);
    if (dxy.x == 0 && dxy.y == 0) dxy = sub(c->p[2], c->p[0]);
    set_ray_pts(s, *tPt, &dxy, onPt, tangent);
}
static void conic_quad_ends(const Stroker *s, const Conic *c, QC *q) {
    Pt tmp;
    if (!q->startSet) { conic_perp_ray(s, c, q->startT, &tmp, &q->quad[0], &q->tanStart); q->startSet = 1; }
    if (!q->endSet) { conic_perp_ray(s, c, q->endT, &tmp, &q->quad[2], &q->tanEnd); q->endSet = 1; }
}
static void cubic_perp_ray(const Stroker *s, const Pt c[4], float t, Pt *tPt, Pt *onPt, Pt *tangent) {
    Pt dxy, chopped[7];
    eval_cubic(c, t, tPt, &dxy);
    if (dxy.x == 0 && dxy.y == 0) {
        const Pt *cPts = c;
        if (nearly_zero(t, NEARLY_ZERO)) dxy = sub(c[2], c[0]);
        else if (nearly_zero(1 - t, NEARLY_ZERO)) dxy = sub(c[3], c[1]);
        else {
            chop_cubic_at(c, chopped, t);
            dxy = sub(chopped[3], chopped[2]);
            if (dxy.x == 0 && dxy.y == 0) { dxy = sub(chopped[3], chopped[1]); cPts = chopped; }
        }
        if (dxy.x == 0 && dxy.y == 0) dxy = sub(cPts[3], cPts[0]);
    }
    set_ray_pts(s, *tPt, &dxy, onPt, tangent);
}
static void cubic_quad_ends(const Stroker *s, const Pt c[4], QC *q) {
    Pt tmp;
    if (!q->startSet) { cubic_perp_ray(s, c, q->startT, &tmp, &q->quad[0], &q->tanStart); q->startSet = 1; }
    if (!q->endSet) { cubic_perp_ray(s, c, q->endT, &tmp, &q->quad[2], &q->tanEnd); q->endSet = 1; }
}
static void quad_perp_ray(const Stroker *s, const Pt q[3], float t, Pt *tPt, Pt *onPt, Pt *tangent) {
    *tPt = eval_quad(q, t);
    Pt dxy = eval_quad_tangent(q, t);
    if (dxy.x == 0 && dxy.y == 0) dxy = sub(q[2], q[0]);
    set_ray_pts(s, *tPt, &dxy, onPt, tangent);
}
static int intersect_ray(const Stroker *s, QC *q, int ctrlPtType) {
    Pt start = q->quad[0], end = q->quad[2];
    Pt aLen = q->tanStart, bLen = q->tanEnd;
    float denom = cross(aLen, bLen);
    if (denom == 0 || !isfinite(denom)) { q->oppositeTangents = dot(aLen, bLen) < 0; return kDegenerate; }
    q->oppositeTangents = 0;
    Pt ab0 = sub(start, end);
    float numerA = cross(bLen, ab0), numerB = cross(aLen, ab0);
    if ((numerA >= 0) == (numerB >= 0)) {
        float d1 = pt_to_tangent_line(start, end, q->tanEnd);
        float d2 = pt_to_tangent_line(end, start, q->tanStart);
        if (fmaxf(d1, d2) <= s->invResScaleSquared) return kDegenerate;
        return kSplit;
    }
    numerA /= denom;
    int validDivide = numerA > numerA - 1;
    if (validDivide) {
        if (ctrlPtType) q->quad[1] = P(start.x + q->tanStart.x * numerA, start.y + q->tanStart.y * numerA);
        return kQuadR;
    }
    q->oppositeTangents = dot(aLen, bLen) < 0;
    return kDegenerate;
}
static int intersect_quad_ray(const Pt line[2], const Pt quad[3], float roots[2]) {
    Pt vec = sub(line[1], line[0]);
    float r[3];
    for (int n = 0; n < 3; ++n) r[n] = cross(vec, sub(quad[n], line[0]));
    float A = r[2], B = r[1], C = r[0];
    A += C - 2 * B;
    B -= C;
    return find_unit_quad_roots(A, 2 * B, C, roots);
}
static int pt_in_quad_bounds(const Stroker *s, const Pt q[3], Pt pt) {
    float xMin = fminf(fminf(q[0].x, q[1].x), q[2].x);
    if (pt.x + s->invResScale < xMin) return 0;
    float xMax = fmaxf(fmaxf(q[0].x, q[1].x), q[2].x);
    if (pt.x - s->invResScale > xMax) return 0;
    float yMin = fminf(fminf(q[0].y, q[1].y), q[2].y);
    if (pt.y + s->invResScale < yMin) return 0;
    float yMax = fmaxf(fmaxf(q[0].y, q[1].y), q[2].y);
    if (pt.y - s->invResScale > yMax) return 0;
    return 1;
}
static int points_within_dist(Pt a, Pt b, float limit) { return dist_sqd(a, b) <= limit * limit; }
static int sharp_angle(const Pt q[3]) {
    Pt smaller = sub(q[1], q[0]), larger = sub(q[1], q[2]);
    float sl = len_sqd(smaller), ll = len_sqd(larger);
    if (sl > ll) { Pt t = smaller; smaller = larger; larger = t; ll = sl; }
    if (!set_length(&smaller, smaller.x, smaller.y, ll)) return 0;
    return dot(smaller, larger) > 0;
}
static int stroke_close_enough(const Stroker *s, const Pt stroke[3], const Pt ray[2], QC *q) {
    Pt strokeMid = eval_quad(stroke, 0.5f);
    if (points_within_dist(ray[0], strokeMid, s->invResScale)) {
        if (sharp_angle(q->quad)) return kSplit;
        return kQuadR;
    }
    if (!pt_in_quad_bounds(s, stroke, ray[0])) return kSplit;
    float roots[2];
    int rootCount = intersect_quad_ray(ray, stroke, roots);
    if (rootCount != 1) return kSplit;
    Pt quadPt = eval_quad(stroke, roots[0]);
    float error = s->invResScale * (1.0f - fabsf(roots[0] - 0.5f) * 2);
    if (points_within_dist(ray[0], quadPt, error)) {
        if (sharp_angle(q->quad)) return kSplit;
        return kQuadR;
    }
    return kSplit;
}
static int compare_quad_cubic(Stroker *s, const Pt c[4], QC *q) {
    cubic_quad_ends(s, c, q);
    int r = intersect_ray(s, q, 1);
    if (r != kQuadR) return r;
    Pt ray[2];
    cubic_perp_ray(s, c, q->midT, &ray[1], &ray[0], NULL);
    return stroke_close_enough(s, q->quad, ray, q);
}
static int compare_quad_conic(Stroker *s, const Conic *c, QC *q) {
    conic_quad_ends(s, c, q);
    int r = intersect_ray(s, q, 1);
    if (r != kQuadR) return r;
    Pt ray[2];
    conic_perp_ray(s, c, q->midT, &ray[1], &ray[0], NULL);
    return stroke_close_enough(s, q->quad, ray, q);
}
static int compare_quad_quad(Stroker *s, const Pt quad[3], QC *q) {
    Pt tmp;
    if (!q->startSet) { quad_perp_ray(s, quad, q->startT, &tmp, &q->quad[0], &q->tanStart); q->startSet = 1; }
    if (!q->endSet) { quad_perp_ray(s, quad, q->endT, &tmp, &q->quad[2], &q->tanEnd); q->endSet = 1; }
    int r = intersect_ray(s, q, 1);
    if (r != kQuadR) return r;
    Pt ray[2];
    quad_perp_ray(s, quad, q->midT, &ray[1], &ray[0], NULL);
    return stroke_close_enough(s, q->quad, ray, q);
}
static Path *sink_of(Stroker *s) { return s->strokeType == 1 ? &s->outer : &s->inner; }
static void add_degenerate_line(Stroker *s, const QC *q) { path_line(sink_of(s), q->quad[2]); }
static int cubic_mid_on_line(const Stroker *s, const Pt c[4], const QC *q) {
    Pt strokeMid, tmp;
    cubic_perp_ray(s, c, q->midT, &tmp, &strokeMid, NULL);
    return pt_to_line(strokeMid, q->quad[0], q->quad[2]) < s->invResScaleSquared;
}
static int cubic_stroke(Stroker *s, const Pt c[4], QC *q) {
    if (!s->foundTangents) {
        cubic_quad_ends(s, c, q);
        int r = intersect_ray(s, q, 0);
        if (kQuadR != r) {
            if ((kDegenerate == r || points_within_dist(q->quad[0], q->quad[2], s->invResScale)) && cubic_mid_on_line(s, c, q)) {
                add_degenerate_line(s, q);
                return 1;
            }
        } else s->foundTangents = 1;
    }
    if (s->foundTangents) {
        int r = compare_quad_cubic(s, c, q);
        if (kQuadR == r) { path_quad(sink_of(s), q->quad[1], q->quad[2]); return 1; }
        if (kDegenerate == r) {
            if (!q->oppositeTangents) { add_degenerate_line(s, q); return 1; }
        }
    }
    if (!isfin2(q->quad[2].x, q->quad[2].y)) return 0;
    if (++s->recursionDepth > kRecursiveLimits[s->foundTangents]) { add_degenerate_line(s, q); return 1; }
    QC half;
    if (!qc_init_start(&half, q)) { add_degenerate_line(s, q); --s->recursionDepth; return 1; }
    if (!cubic_stroke(s, c, &half)) return 0;
    if (!qc_init_end(&half, q)) { add_degenerate_line(s, q); --s->recursionDepth; return 1; }
    if (!cubic_stroke(s, c, &half)) return 0;
    --s->recursionDepth;
    return 1;
}
static int conic_stroke(Stroker *s, const Conic *c, QC *q) {
    int r = compare_quad_conic(s, c, q);
    if (kQuadR == r) { path_quad(sink_of(s), q->quad[1], q->quad[2]); return 1; }
    if (kDegenerate == r) { add_degenerate_line(s, q); return 1; }
    if (++s->recursionDepth > kRecursiveLimits[2]) { add_degenerate_line(s, q); return 1; }
    QC half;
    qc_init_start(&half, q);
    if (!conic_stroke(s, c, &half)) return 0;
    qc_init_end(&half, q);
    if (!conic_stroke(s, c, &half)) return 0;
    --s->recursionDepth;
    return 1;
}
static int quad_stroke(Stroker *s, const Pt quad[3], QC *q) {
    int r = compare_quad_quad(s, quad, q);
    if (kQuadR == r) { path_quad(sink_of(s), q->quad[1], q->quad[2]); return 1; }
    if (kDegenerate == r) { add_degenerate_line(s, q); return 1; }
    if (++s->recursionDepth > kRecursiveLimits[3]) { add_degenerate_line(s, q); return 1; }
    QC half;
    qc_init_start(&half, q);
    if (!quad_stroke(s, quad, &half)) return 0;
    qc_init_end(&half, q);
    if (!quad_stroke(s, quad, &half)) return 0;
    --s->recursionDepth;
    return 1;
}
static void st_conic(Stroker *s, Pt pt1, Pt pt2, float weight) {
    Conic c = {{s->prevPt, pt1, pt2}, weight};
    Pt red;
    int rt = check_conic_linear(&c, &red);
    if (rt == kPointR || rt == kLineR) { st_line(s, pt2, NULL); return; }
    if (rt == kDegenerateR) {
        st_line(s, red, NULL);
        JoinProc save = s->joiner; s->joiner = round_joiner;
        st_line(s, pt2, NULL);
        s->joiner = save;
        return;
    }
    Pt nAB, uAB, nBC, uBC;
    if (!st_prejoin(s, pt1, &nAB, &uAB, 0)) { st_line(s, pt2, NULL); return; }
    QC q;
    st_init(s, 1, &q, 0, 1); conic_stroke(s, &c, &q);
    st_init(s, -1, &q, 0, 1); conic_stroke(s, &c, &q);
    set_quad_end_normal(s, c.p, nAB, uAB, &nBC, &uBC);
    st_postjoin(s, pt2, nBC, uBC);
}
static void st_quad(Stroker *s, Pt pt1, Pt pt2) {
    Pt quad[3] = {s->prevPt, pt1, pt2};
    Pt red;
    int rt = check_quad_linear(quad, &red);
    if (rt == kPointR || rt == kLineR) { st_line(s, pt2, NULL); return; }
    if (rt == kDegenerateR) {
        st_line(s, red, NULL);
        JoinProc save = s->joiner; s->joiner = round_joiner;
        st_line(s, pt2, NULL);
        s->joiner = save;
        return;
    }
    Pt nAB, uAB, nBC, uBC;
    if (!st_prejoin(s, pt1, &nAB, &uAB, 0)) { st_line(s, pt2, NULL); return; }
    QC q;
    st_init(s, 1, &q, 0, 1); quad_stroke(s, quad, &q);
    st_init(s, -1, &q, 0, 1); quad_stroke(s, quad, &q);
    set_quad_end_normal(s, quad, nAB, uAB, &nBC, &uBC);
    st_postjoin(s, pt2, nBC, uBC);
}
static void st_cubic(Stroker *s, Pt pt1, Pt pt2, Pt pt3) {
    Pt cubic[4] = {s->prevPt, pt1, pt2, pt3};
    Pt red[3];
    const Pt *tanPt = NULL;
    int rt = check_cubic_linear(cubic, red, &tanPt);
    if (rt == kPointR || rt == kLineR) { st_line(s, pt3, NULL); return; }
    if (rt >= kDegenerateR && rt <= kDegenerate3R) {
        st_line(s, red[0], NULL);
        JoinProc save = s->joiner; s->joiner = round_joiner;
        if (rt >= kDegenerate2R) st_line(s, red[1], NULL);
        if (rt == kDegenerate3R) st_line(s, red[2], NULL);
        st_line(s, pt3, NULL);
        s->joiner = save;
        return;
    }
    Pt nAB, uAB, nCD, uCD;
    if (!st_prejoin(s, *tanPt, &nAB, &uAB, 0)) { st_line(s, pt3, NULL); return; }
    float tv[2];
    int count = find_cubic_inflections(cubic, tv);
    float lastT = 0;
    for (int i = 0; i <= count; ++i) {
        float nextT = i < count ? tv[i] : 1;
        QC q;
        st_init(s, 1, &q, lastT, nextT); cubic_stroke(s, cubic, &q);
        st_init(s, -1, &q, lastT, nextT); cubic_stroke(s, cubic, &q);
        lastT = nextT;
    }
    float cusp = find_cubic_cusp(cubic);
    if (cusp > 0) {
        Pt loc = eval_cubic_pt(cubic, cusp);
        path_add_oval(&s->cusper, loc.x - s->radius, loc.y - s->radius, loc.x + s->radius, loc.y + s->radius, 0, 1);
    }
    set_cubic_end_normal(s, cubic, nAB, uAB, &nCD, &uCD);
    st_postjoin(s, pt3, nCD, uCD);
}

/* SkStroke::strokeRect */
static void add_bevel(Path *path, float rl, float rt, float rr, float rb, float ol, float ot, float or_, float ob, int ccw) {
    Pt pts[8];
    if (!ccw) {
        pts[0] = P(rl, ot); pts[1] = P(rr, ot); pts[2] = P(or_, rt); pts[3] = P(or_, rb);
        pts[4] = P(rr, ob); pts[5] = P(rl, ob); pts[6] = P(ol, rb); pts[7] = P(ol, rt);
    } else {
        pts[7] = P(rl, ot); pts[6] = P(rr, ot); pts[5] = P(or_, rt); pts[4] = P(or_, rb);
        pts[3] = P(rr, ob); pts[2] = P(rl, ob); pts[1] = P(ol, rb); pts[0] = P(ol, rt);
    }
    path_move(path, pts[0]);
    for (int i = 1; i < 8; i++) path_line(path, pts[i]);
    path_close(path);
}
static void stroke_rect(float l, float t, float r, float b, float width, int join, float miter, int ccw, Path *dst) {
    path_reset(dst);
    float radius = width * 0.5f;
    if (radius <= 0) return;
    float rw = r - l, rh = b - t;
    if ((rw < 0) ^ (rh < 0)) ccw = !ccw;
    float sl = fminf(l, r), sr = fmaxf(l, r), stt = fminf(t, b), sb = fmaxf(t, b);
    rw = sr - sl; rh = sb - stt;
    float ol = sl - radius, ot = stt - radius, or_ = sr + radius, ob = sb + radius;
    if (join == JOIN_MITER && miter < SQRT2) join = JOIN_BEVEL;
    switch (join) {
        case JOIN_MITER: path_add_rect(dst, ol, ot, or_, ob, ccw, 0); break;
        case JOIN_BEVEL: add_bevel(dst, sl, stt, sr, sb, ol, ot, or_, ob, ccw); break;
        case JOIN_ROUND: path_add_rrect(dst, ol, ot, or_, ob, radius, radius, ccw, ccw ? 7 : 6); break;
    }
    if (width < fminf(rw, rh)) {
        path_add_rect(dst, sl + radius, stt + radius, sr - radius, sb - radius, !ccw, 0);
    }
}

int path_is_rect_ex(const Path *p, float *L, float *T, float *R, float *B, int *closed, int *ccw);

void stroke_path(const Path *src, float width, int cap, int join, float miter, float resScale, Path *dst) {
    float radius = width * 0.5f;
    if (radius <= 0) return;
    {
        float l, t, r, b; int closed = 0, ccw = 0;
        if (path_is_rect_ex(src, &l, &t, &r, &b, &closed, &ccw) && closed) {
            stroke_rect(l, t, r, b, width, join, miter, ccw, dst);
            return;
        }
    }
    Stroker s; memset(&s, 0, sizeof s);
    s.radius = radius; s.resScale = resScale;
    s.invMiterLimit = 0;
    if (join == JOIN_MITER) {
        if (miter <= 1) join = JOIN_BEVEL;
        else s.invMiterLimit = 1.0f / miter;
    }
    s.cap = cap; s.joiner = join_factory(join);
    s.segmentCount = -1; s.firstOuterPtIndexInContour = 0; s.prevIsLine = 0;
    path_init(&s.inner); path_init(&s.outer); path_init(&s.cusper);
    s.invResScale = 1.0f / (resScale * 4);
    s.invResScaleSquared = s.invResScale * s.invResScale;
    s.recursionDepth = 0;

    Iter it; iter_init(&it, src);
    Pt pts[4]; float w = 0;
    int lastSegment = V_MOVE, v;
    while ((v = iter_next(&it, pts, &w)) >= 0) {
        switch (v) {
            case V_MOVE: st_move(&s, pts[0]); break;
            case V_LINE: st_line(&s, pts[1], &it); lastSegment = V_LINE; break;
            case V_QUAD: st_quad(&s, pts[1], pts[2]); lastSegment = V_QUAD; break;
            case V_CONIC: st_conic(&s, pts[1], pts[2], w); lastSegment = V_CONIC; break;
            case V_CUBIC: st_cubic(&s, pts[1], pts[2], pts[3]); lastSegment = V_CUBIC; break;
            case V_CLOSE:
                if (cap != CAP_BUTT) {
                    if (s.segmentCount == 0) {   /* hasOnlyMoveTo */
                        st_line(&s, s.firstPt, NULL);
                        lastSegment = V_LINE;
                        break;
                    }
                    if (is_zero_length_since(&s.inner, 0) && is_zero_length_since(&s.outer, s.firstOuterPtIndexInContour)) {
                        lastSegment = V_LINE;
                        break;
                    }
                }
                st_finish(&s, 1, lastSegment == V_LINE);
                break;
        }
    }
    st_finish(&s, 0, lastSegment == V_LINE);
    path_free(dst);
    *dst = s.outer;          /* take ownership */
    path_free(&s.inner); path_free(&s.cusper);
}

/* SkPath::computeTightBounds (Blink's SVG object bounding box of a path) */
static int vu_divide(float numer, float denom, float *ratio) {   /* valid_unit_divide */
    if (numer < 0) { numer = -numer; denom = -denom; }
    if (denom == 0 || numer == 0 || numer >= denom) return 0;
    float r = numer / denom;
    if (isnan(r) || r == 0) return 0;
    *ratio = r; return 1;
}
static int conic_extrema1(const float *src, float w, float *t) {   /* src stride 2 */
    float P20 = src[4] - src[0], P10 = src[2] - src[0], wP10 = w * P10;
    float tv[2];
    int n = find_unit_quad_roots(w * P20 - P20, P20 - 2 * wP10, wP10, tv);
    if (n == 1) { *t = tv[0]; return 1; }
    return 0;
}
int path_tight_bounds(const Path *p, float *l, float *t, float *r, float *b) {
    if (p->nverbs == 0) { *l = *t = *r = *b = 0; return 0; }
    if (!(path_segment_mask(p) & ~1)) return path_bounds(p, l, t, r, b);   /* lines only */
    float mnx = p->pts[0].x, mny = p->pts[0].y, mxx = mnx, mxy = mny;
    int pi = 0, wi = 0;
    Pt last = p->pts[0];
    for (int vi = 0; vi < p->nverbs; vi++) {
        Pt ex[5]; int cnt = 0; float ts[4]; int n;
        const Pt *q = p->pts + pi;
        switch (p->verbs[vi]) {
            case V_MOVE: ex[0] = q[0]; cnt = 1; last = q[0]; pi += 1; break;
            case V_LINE: ex[0] = q[0]; cnt = 1; last = q[0]; pi += 1; break;
            case V_QUAD: {
                Pt s[3] = {last, q[0], q[1]};
                n = vu_divide(s[0].x - s[1].x, s[0].x - s[1].x - s[1].x + s[2].x, ts);
                n += vu_divide(s[0].y - s[1].y, s[0].y - s[1].y - s[1].y + s[2].y, ts + n);
                for (int i = 0; i < n; i++) ex[i] = eval_quad(s, ts[i]);
                ex[n] = s[2]; cnt = n + 1; last = q[1]; pi += 2; break;
            }
            case V_CONIC: {
                Conic c = {{last, q[0], q[1]}, p->w[wi++]};
                n = conic_extrema1(&c.p[0].x, c.w, ts);
                n += conic_extrema1(&c.p[0].y, c.w, ts + n);
                for (int i = 0; i < n; i++) ex[i] = conic_eval(&c, ts[i]);
                ex[n] = c.p[2]; cnt = n + 1; last = q[1]; pi += 2; break;
            }
            case V_CUBIC: {
                Pt s[4] = {last, q[0], q[1], q[2]};
                float A, B, C;
                A = s[3].x - s[0].x + 3 * (s[1].x - s[2].x); B = 2 * (s[0].x - s[1].x - s[1].x + s[2].x); C = s[1].x - s[0].x;
                n = find_unit_quad_roots(A, B, C, ts);
                A = s[3].y - s[0].y + 3 * (s[1].y - s[2].y); B = 2 * (s[0].y - s[1].y - s[1].y + s[2].y); C = s[1].y - s[0].y;
                n += find_unit_quad_roots(A, B, C, ts + n);
                for (int i = 0; i < n; i++) ex[i] = eval_cubic_pt(s, ts[i]);
                ex[n] = s[3]; cnt = n + 1; last = q[2]; pi += 3; break;
            }
            case V_CLOSE: break;
        }
        for (int i = 0; i < cnt; i++) {
            if (ex[i].x < mnx) mnx = ex[i].x; if (ex[i].y < mny) mny = ex[i].y;
            if (mxx < ex[i].x) mxx = ex[i].x; if (mxy < ex[i].y) mxy = ex[i].y;
        }
    }
    *l = mnx; *t = mny; *r = mxx; *b = mxy;
    return 1;
}
