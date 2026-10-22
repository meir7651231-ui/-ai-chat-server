/* vr_clip.c -- SkEdgeClipper / SkLineClipper / SkCubics (root finding) ported to C */
#include "vr.h"
#include <string.h>
#include <math.h>
#include <float.h>

typedef void (*EmitFn)(void *ctx, int verb, const Pt *pts);
typedef struct { float l, t, r, b; } Rect;

static inline float pin_unsorted_f(float v, float a, float b) { if (b < a) { float t = a; a = b; b = t; } return v < a ? a : v > b ? b : v; }
static inline double pin_unsorted_d(double v, double a, double b) { if (b < a) { double t = a; a = b; b = t; } return v < a ? a : v > b ? b : v; }

static float sect_with_horizontal(const Pt src[2], float Y) {
    float dy = src[1].y - src[0].y;
    if (fabsf(dy) <= 1.0f / (1 << 12)) return (src[0].x + src[1].x) * 0.5f;
    double X0 = src[0].x, Y0 = src[0].y, X1 = src[1].x, Y1 = src[1].y;
    double result = X0 + ((double)Y - Y0) * (X1 - X0) / (Y1 - Y0);
    return (float)pin_unsorted_d(result, X0, X1);
}
static float sect_with_vertical(const Pt src[2], float X) {
    float dx = src[1].x - src[0].x;
    if (fabsf(dx) <= 1.0f / (1 << 12)) return (src[0].y + src[1].y) * 0.5f;
    double X0 = src[0].x, Y0 = src[0].y, X1 = src[1].x, Y1 = src[1].y;
    double result = Y0 + ((double)X - X0) * (Y1 - Y0) / (X1 - X0);
    return (float)result;
}
static float sect_clamp_with_vertical(const Pt src[2], float x) {
    float y = sect_with_vertical(src, x);
    return pin_unsorted_f(y, src[0].y, src[1].y);
}

/* SkLineClipper::ClipLine; returns lineCount, lines[] has lineCount+1 points */
static int clip_line(const Pt pts[2], const Rect *clip, Pt lines[4], int canCullToTheRight) {
    int i0, i1;
    if (pts[0].y < pts[1].y) { i0 = 0; i1 = 1; } else { i0 = 1; i1 = 0; }
    if (pts[i1].y <= clip->t) return 0;
    if (pts[i0].y >= clip->b) return 0;
    Pt tmp[2]; memcpy(tmp, pts, sizeof tmp);
    if (pts[i0].y < clip->t) { tmp[i0].x = sect_with_horizontal(pts, clip->t); tmp[i0].y = clip->t; }
    if (tmp[i1].y > clip->b) { tmp[i1].x = sect_with_horizontal(pts, clip->b); tmp[i1].y = clip->b; }
    Pt store[4]; Pt *result; int lineCount = 1, reverse;
    if (pts[0].x < pts[1].x) { i0 = 0; i1 = 1; reverse = 0; } else { i0 = 1; i1 = 0; reverse = 1; }
    if (tmp[i1].x <= clip->l) {
        tmp[0].x = tmp[1].x = clip->l; result = tmp; reverse = 0;
    } else if (tmp[i0].x >= clip->r) {
        if (canCullToTheRight) return 0;
        tmp[0].x = tmp[1].x = clip->r; result = tmp; reverse = 0;
    } else {
        result = store; Pt *r = result;
        if (tmp[i0].x < clip->l) {
            r->x = clip->l; r->y = tmp[i0].y; r += 1;
            r->x = clip->l; r->y = sect_clamp_with_vertical(tmp, clip->l);
        } else *r = tmp[i0];
        r += 1;
        if (tmp[i1].x > clip->r) {
            r->x = clip->r; r->y = sect_clamp_with_vertical(tmp, clip->r); r += 1;
            r->x = clip->r; r->y = tmp[i1].y;
        } else *r = tmp[i1];
        lineCount = (int)(r - result);
    }
    if (reverse) for (int i = 0; i <= lineCount; i++) lines[lineCount - i] = result[i];
    else memcpy(lines, result, (lineCount + 1) * sizeof(Pt));
    return lineCount;
}

/* ------------------------------------------------------------------ cubic root helpers (double) */
static int d_nearly_zero(double a) { return a == 0 || fabs(a) < FLT_EPSILON; }
static double magnitude(double a) {
    int64_t bits; memcpy(&bits, &a, 8); bits &= 0x7FF0000000000000LL; double o; memcpy(&o, &bits, 8); return o;
}
static int d_nearly_equal_ulps(double a, double b) {
    const double minMag = DBL_MIN;
    double ma = magnitude(a); if (ma < minMag) ma = minMag;
    double mb = magnitude(b);
    double maxMag = ma > mb ? ma : mb;
    double tol = maxMag * (DBL_EPSILON * (16 + 1));
    return a == b || fabs(b - a) < tol;
}
static int solve_linear(double M, double B, double sol[2]) {
    if (d_nearly_zero(M)) { sol[0] = 0; return d_nearly_zero(B) ? 1 : 0; }
    sol[0] = -B / M;
    if (!isfinite(sol[0])) return 0;
    return 1;
}
static int close_to_linear(double A, double B) { if (A != 0) return fabs(B / A) >= 1.0e+16; return 1; }
static double discriminant(double a, double b, double c) {
    double b2 = b * b, ac = a * c, rough = b2 - ac;
    if (3 * fabs(rough) >= b2 + ac) return rough;
    double b2e = fma(b, b, -b2), ace = fma(a, c, -ac);
    return (b2 - ac) + (b2e - ace);
}
static double zero_if_tiny(double x) { return d_nearly_zero(x) ? 0 : x; }
static int quads_roots_real(double A, double B, double C, double sol[2]) {
    if (close_to_linear(A, B)) return solve_linear(B, C, sol);
    double b = -0.5 * B;
    double disc = discriminant(A, b, C), r0, r1;
    if (disc == 0) { r0 = r1 = b / A; }
    else if (disc > 0) { double D = sqrt(disc); double R = b > 0 ? b + D : b - D; r0 = R / A; r1 = C / R; }
    else { r0 = r1 = NAN; }
    if (!isfinite(disc) || disc < 0) return 0;
    int n = 0;
    double v0 = zero_if_tiny(r0), v1 = zero_if_tiny(r1);
    if (isfinite(v0)) sol[n++] = v0;
    if (isfinite(v1)) sol[n++] = v1;
    if (n == 2 && d_nearly_equal_ulps(sol[0], sol[1])) n = 1;
    return n;
}
static int nearly_equal_d(double x, double y) { if (d_nearly_zero(x)) return d_nearly_zero(y); return d_nearly_equal_ulps(x, y); }
static int close_to_a_quadratic(double A, double B) { if (d_nearly_zero(B)) return d_nearly_zero(A); return fabs(A / B) < 1.0e-7; }
static int cubics_roots_real(double A, double B, double C, double D, double sol[3]) {
    if (close_to_a_quadratic(A, B)) return quads_roots_real(B, C, D, sol);
    if (d_nearly_zero(D)) {
        int num = quads_roots_real(A, B, C, sol);
        for (int i = 0; i < num; ++i) if (d_nearly_zero(sol[i])) return num;
        sol[num++] = 0; return num;
    }
    if (d_nearly_zero(A + B + C + D)) {
        int num = quads_roots_real(A, A + B, -D, sol);
        for (int i = 0; i < num; ++i) if (d_nearly_equal_ulps(sol[i], 1)) return num;
        sol[num++] = 1; return num;
    }
    double a, b, c;
    { double invA = 1 / A; a = B * invA; b = C * invA; c = D * invA; }
    double a2 = a * a, Q = (a2 - b * 3) / 9, R = (2 * a2 * a - 9 * a * b + 27 * c) / 54;
    double R2 = R * R, Q3 = Q * Q * Q, R2MinusQ3 = R2 - Q3;
    if (!isfinite(R2MinusQ3)) return 0;
    double adiv3 = a / 3, r;
    double *roots = sol;
    const double PI = 3.141592653589793;
    if (R2MinusQ3 < 0) {
        double q = R / sqrt(Q3); if (q < -1) q = -1; if (q > 1) q = 1;
        const double theta = acos(q), neg2RootQ = -2 * sqrt(Q);
        r = neg2RootQ * cos(theta / 3) - adiv3; *roots++ = r;
        r = neg2RootQ * cos((theta + 2 * PI) / 3) - adiv3;
        if (!nearly_equal_d(sol[0], r)) *roots++ = r;
        r = neg2RootQ * cos((theta - 2 * PI) / 3) - adiv3;
        if (!nearly_equal_d(sol[0], r) && (roots - sol == 1 || !nearly_equal_d(sol[1], r))) *roots++ = r;
    } else {
        const double s = sqrt(R2MinusQ3);
        A = fabs(R) + s; A = cbrt(A);
        if (R > 0) A = -A;
        if (!d_nearly_zero(A)) A += Q / A;
        r = A - adiv3; *roots++ = r;
        if (!d_nearly_zero(R2) && d_nearly_equal_ulps(R2, Q3)) {
            r = -A / 2 - adiv3;
            if (!nearly_equal_d(sol[0], r)) *roots++ = r;
        }
    }
    return (int)(roots - sol);
}
static int cubics_roots_valid_t(double A, double B, double C, double D, double sol[3]) {
    double all[3] = {0, 0, 0};
    int real = cubics_roots_real(A, B, C, D, all), found = 0;
    for (int i = 0; i < real; ++i) {
        double t = all[i];
        if (t <= 1.00005 && (t >= 1.0 || d_nearly_equal_ulps(t, 1.0))) {
            if ((found < 1 || !d_nearly_equal_ulps(sol[0], 1)) && (found < 2 || !d_nearly_equal_ulps(sol[1], 1))) sol[found++] = 1;
        } else if (t >= -0.00005 && (t <= 0.0 || d_nearly_zero(t))) {
            if ((found < 1 || !d_nearly_zero(sol[0])) && (found < 2 || !d_nearly_zero(sol[1]))) sol[found++] = 0;
        } else if (t > 0.0 && t < 1.0) sol[found++] = t;
    }
    return found;
}
static double cubic_eval(double A, double B, double C, double D, double t) { return fma(t, fma(t, fma(t, A, B), C), D); }
static int approximately_zero(double x) { return fabs(x) < 0.00000001; }
static int find_extrema_valid_t(double A, double B, double C, double t[2]) {
    double roots[2] = {0, 0};
    int n = quads_roots_real(3 * A, 2 * B, C, roots), v = 0;
    for (int i = 0; i < n; i++) if (roots[i] >= 0 && roots[i] <= 1.0) t[v++] = roots[i];
    return v;
}
static double binary_search(double A, double B, double C, double D, double start, double stop) {
    double left = cubic_eval(A, B, C, D, start);
    if (approximately_zero(left)) return start;
    double right = cubic_eval(A, B, C, D, stop);
    if (!isfinite(left) || !isfinite(right)) return -1;
    if ((left > 0 && right > 0) || (left < 0 && right < 0)) return -1;
    for (int i = 0; i < 1000; i++) {
        double step = (start + stop) / 2, curr = cubic_eval(A, B, C, D, step);
        if (approximately_zero(curr)) return step;
        if ((curr < 0 && left < 0) || (curr > 0 && left > 0)) start = step; else stop = step;
    }
    return -1;
}
static int binary_search_roots(double A, double B, double C, double D, double sol[3]) {
    if (!isfinite(A) || !isfinite(B) || !isfinite(C) || !isfinite(D)) return 0;
    double regions[4] = {0, 0, 0, 1}, mm[2] = {0, 0};
    int ec = find_extrema_valid_t(A, B, C, mm), si = 2 - ec;
    if (ec == 1) regions[si + 1] = mm[0];
    if (ec == 2) { regions[si + 1] = fmin(mm[0], mm[1]); regions[si + 2] = fmax(mm[0], mm[1]); }
    int found = 0;
    for (; si < 3; si++) {
        double root = binary_search(A, B, C, D, regions[si], regions[si + 1]);
        if (root >= 0) {
            if ((found < 1 || !approximately_zero(sol[0] - root)) && (found < 2 || !approximately_zero(sol[1] - root))) sol[found++] = root;
        }
    }
    return found;
}
static int first_axis_intersection(const double c[8], int ydir, double axis, double *solution) {
    const double *o = ydir ? c + 1 : c;
    double A = -o[0] + 3 * o[2] - 3 * o[4] + o[6];
    double B = 3 * o[0] - 6 * o[2] + 3 * o[4];
    double C = -3 * o[0] + 3 * o[2];
    double D = o[0];
    D -= axis;
    double roots[3] = {0, 0, 0};
    int count = cubics_roots_valid_t(A, B, C, D, roots);
    if (count == 0) return 0;
    for (int i = 0; i < count; i++) if (fabs(cubic_eval(A, B, C, D, roots[i])) < 0.00001) { *solution = roots[i]; return 1; }
    count = binary_search_roots(A, B, C, D, roots);
    if (count == 0) return 0;
    for (int i = 0; i < count; i++) if (fabs(cubic_eval(A, B, C, D, roots[i])) < 0.00001) { *solution = roots[i]; return 1; }
    return 0;
}
static inline double dinterp(double A, double B, double t) { return A + (B - A) * t; }
static int chop_mono_cubic_at(const Pt src[4], int ydir, float v, Pt dst[7]) {
    double c[8] = {src[0].x, src[0].y, src[1].x, src[1].y, src[2].x, src[2].y, src[3].x, src[3].y};
    double t = 0;
    if (!first_axis_intersection(c, ydir, v, &t)) return 0;
    double out[14];
    out[0] = c[0]; out[1] = c[1]; out[12] = c[6]; out[13] = c[7];
    double x01 = dinterp(c[0], c[2], t), y01 = dinterp(c[1], c[3], t);
    double x12 = dinterp(c[2], c[4], t), y12 = dinterp(c[3], c[5], t);
    double x23 = dinterp(c[4], c[6], t), y23 = dinterp(c[5], c[7], t);
    out[2] = x01; out[3] = y01; out[10] = x23; out[11] = y23;
    out[4] = dinterp(x01, x12, t); out[5] = dinterp(y01, y12, t);
    out[8] = dinterp(x12, x23, t); out[9] = dinterp(y12, y23, t);
    out[6] = dinterp(out[4], out[8], t); out[7] = dinterp(out[5], out[9], t);
    for (int i = 0; i < 7; i++) { dst[i].x = (float)out[2 * i]; dst[i].y = (float)out[2 * i + 1]; }
    return 1;
}
static float mono_cubic_closestT(const float *src, float x) {
    float t = 0.5f, lastT, bestT = 0, step = 0.25f;
    float D = src[0], A = src[6] + 3 * (src[2] - src[4]) - D, B = 3 * (src[4] - src[2] - src[2] + D), C = 3 * (src[2] - D);
    x -= D;
    float closest = FLT_MAX;
    do {
        float loc = ((A * t + B) * t + C) * t;
        float dist = fabsf(loc - x);
        if (closest > dist) { closest = dist; bestT = t; }
        lastT = t;
        t += loc < x ? step : -step;
        step *= 0.5f;
    } while (closest > 0.25f && lastT != t);
    return bestT;
}
static void chop_mono_cubic_at_y(Pt src[4], float y, Pt dst[7]) {
    if (chop_mono_cubic_at(src, 1, y, dst)) return;
    chop_cubic_at(src, dst, mono_cubic_closestT(&src->y, y));
}
static void chop_mono_cubic_at_x(Pt src[4], float x, Pt dst[7]) {
    if (chop_mono_cubic_at(src, 0, x, dst)) return;
    chop_cubic_at(src, dst, mono_cubic_closestT(&src->x, x));
}

/* ------------------------------------------------------------------ edge clipper */
typedef struct { EmitFn emit; void *ctx; int canCull; } Clipper;

static void append_vline(Clipper *c, float x, float y0, float y1, int reverse) {
    if (reverse) { float t = y0; y0 = y1; y1 = t; }
    Pt q[2] = {{x, y0}, {x, y1}};
    c->emit(c->ctx, V_LINE, q);
}
static void append_quad(Clipper *c, const Pt pts[3], int reverse) {
    Pt q[3];
    if (reverse) { q[0] = pts[2]; q[2] = pts[0]; } else { q[0] = pts[0]; q[2] = pts[2]; }
    q[1] = pts[1];
    c->emit(c->ctx, V_QUAD, q);
}
static void append_cubic(Clipper *c, const Pt pts[4], int reverse) {
    Pt q[4];
    if (reverse) for (int i = 0; i < 4; i++) q[i] = pts[3 - i]; else memcpy(q, pts, sizeof q);
    c->emit(c->ctx, V_CUBIC, q);
}
static int sort_increasing_y(Pt dst[], const Pt src[], int count) {
    if (src[0].y > src[count - 1].y) { for (int i = 0; i < count; i++) dst[i] = src[count - i - 1]; return 1; }
    memcpy(dst, src, count * sizeof(Pt)); return 0;
}
static int chop_mono_quad_at(float c0, float c1, float c2, float target, float *t) {
    float A = c0 - c1 - c1 + c2, B = 2 * (c1 - c0), C = c0 - target;
    float roots[2];
    int count = find_unit_quad_roots(A, B, C, roots);
    if (count) { *t = roots[0]; return 1; }
    return 0;
}
static void chop_quad_in_y(Pt pts[3], const Rect *clip) {
    float t; Pt tmp[5];
    if (pts[0].y < clip->t) {
        if (chop_mono_quad_at(pts[0].y, pts[1].y, pts[2].y, clip->t, &t)) {
            chop_quad_at(pts, tmp, t);
            tmp[2].y = clip->t;
            if (tmp[3].y < clip->t) tmp[3].y = clip->t;
            pts[0] = tmp[2]; pts[1] = tmp[3];
        } else {
            for (int i = 0; i < 3; i++) if (pts[i].y < clip->t) pts[i].y = clip->t;
        }
    }
    if (pts[2].y > clip->b) {
        if (chop_mono_quad_at(pts[0].y, pts[1].y, pts[2].y, clip->b, &t)) {
            chop_quad_at(pts, tmp, t);
            if (tmp[1].y > clip->b) tmp[1].y = clip->b;
            tmp[2].y = clip->b;
            pts[1] = tmp[1]; pts[2] = tmp[2];
        } else {
            for (int i = 0; i < 3; i++) if (pts[i].y > clip->b) pts[i].y = clip->b;
        }
    }
}
static void clip_mono_quad(Clipper *c, const Pt src[3], const Rect *clip) {
    Pt pts[3];
    int reverse = sort_increasing_y(pts, src, 3);
    if (pts[2].y <= clip->t || pts[0].y >= clip->b) return;
    chop_quad_in_y(pts, clip);
    if (pts[0].x > pts[2].x) { Pt t = pts[0]; pts[0] = pts[2]; pts[2] = t; reverse = !reverse; }
    if (pts[2].x <= clip->l) { append_vline(c, clip->l, pts[0].y, pts[2].y, reverse); return; }
    if (pts[0].x >= clip->r) { if (!c->canCull) append_vline(c, clip->r, pts[0].y, pts[2].y, reverse); return; }
    float t; Pt tmp[5];
    if (pts[0].x < clip->l) {
        if (chop_mono_quad_at(pts[0].x, pts[1].x, pts[2].x, clip->l, &t)) {
            chop_quad_at(pts, tmp, t);
            append_vline(c, clip->l, tmp[0].y, tmp[2].y, reverse);
            tmp[2].x = clip->l;
            if (tmp[3].x < clip->l) tmp[3].x = clip->l;
            pts[0] = tmp[2]; pts[1] = tmp[3];
        } else {
            append_vline(c, clip->l, pts[0].y, pts[2].y, reverse);
            return;
        }
    }
    if (pts[2].x > clip->r) {
        if (chop_mono_quad_at(pts[0].x, pts[1].x, pts[2].x, clip->r, &t)) {
            chop_quad_at(pts, tmp, t);
            if (tmp[1].x > clip->r) tmp[1].x = clip->r;
            tmp[2].x = clip->r;
            append_quad(c, tmp, reverse);
            append_vline(c, clip->r, tmp[2].y, tmp[4].y, reverse);
        } else {
            pts[1].x = fminf(pts[1].x, clip->r);
            pts[2].x = fminf(pts[2].x, clip->r);
            append_quad(c, pts, reverse);
        }
    } else append_quad(c, pts, reverse);
}
static void clip_quad(Clipper *c, const Pt src[3], const Rect *clip) {
    float t = src[0].y, b = src[0].y;
    for (int i = 1; i < 3; i++) { if (src[i].y < t) t = src[i].y; if (src[i].y > b) b = src[i].y; }
    if (t >= clip->b || b <= clip->t) return;
    Pt monoY[5];
    int cy = chop_quad_at_y_extrema(src, monoY);
    for (int y = 0; y <= cy; y++) {
        Pt monoX[5];
        int cx = chop_quad_at_x_extrema(&monoY[y * 2], monoX);
        for (int x = 0; x <= cx; x++) clip_mono_quad(c, &monoX[x * 2], clip);
    }
}
static void chop_cubic_in_y(Pt pts[4], const Rect *clip) {
    if (pts[0].y < clip->t) {
        Pt tmp[7];
        chop_mono_cubic_at_y(pts, clip->t, tmp);
        if (tmp[3].y < clip->t && tmp[4].y < clip->t && tmp[5].y < clip->t) {
            Pt tmp2[4]; memcpy(tmp2, &tmp[3], 4 * sizeof(Pt));
            chop_mono_cubic_at_y(tmp2, clip->t, tmp);
        }
        tmp[3].y = clip->t;
        if (tmp[4].y < clip->t) tmp[4].y = clip->t;
        pts[0] = tmp[3]; pts[1] = tmp[4]; pts[2] = tmp[5];
    }
    if (pts[3].y > clip->b) {
        Pt tmp[7];
        chop_mono_cubic_at_y(pts, clip->b, tmp);
        tmp[3].y = clip->b;
        if (tmp[2].y > clip->b) tmp[2].y = clip->b;
        pts[1] = tmp[1]; pts[2] = tmp[2]; pts[3] = tmp[3];
    }
}
static void clip_mono_cubic(Clipper *c, const Pt src[4], const Rect *clip) {
    Pt pts[4];
    int reverse = sort_increasing_y(pts, src, 4);
    if (pts[3].y <= clip->t || pts[0].y >= clip->b) return;
    chop_cubic_in_y(pts, clip);
    if (pts[0].x > pts[3].x) {
        Pt t = pts[0]; pts[0] = pts[3]; pts[3] = t; t = pts[1]; pts[1] = pts[2]; pts[2] = t;
        reverse = !reverse;
    }
    if (pts[3].x <= clip->l) { append_vline(c, clip->l, pts[0].y, pts[3].y, reverse); return; }
    if (pts[0].x >= clip->r) { if (!c->canCull) append_vline(c, clip->r, pts[0].y, pts[3].y, reverse); return; }
    if (pts[0].x < clip->l) {
        Pt tmp[7];
        chop_mono_cubic_at_x(pts, clip->l, tmp);
        append_vline(c, clip->l, tmp[0].y, tmp[3].y, reverse);
        tmp[3].x = clip->l;
        if (tmp[4].x < clip->l) tmp[4].x = clip->l;
        pts[0] = tmp[3]; pts[1] = tmp[4]; pts[2] = tmp[5];
    }
    if (pts[3].x > clip->r) {
        Pt tmp[7];
        chop_mono_cubic_at_x(pts, clip->r, tmp);
        tmp[3].x = clip->r;
        if (tmp[2].x > clip->r) tmp[2].x = clip->r;
        append_cubic(c, tmp, reverse);
        append_vline(c, clip->r, tmp[3].y, tmp[6].y, reverse);
    } else append_cubic(c, pts, reverse);
}
static void clip_cubic(Clipper *c, const Pt src[4], const Rect *clip) {
    float l = src[0].x, r = l, t = src[0].y, b = t;
    for (int i = 1; i < 4; i++) {
        if (src[i].x < l) l = src[i].x; if (src[i].x > r) r = src[i].x;
        if (src[i].y < t) t = src[i].y; if (src[i].y > b) b = src[i].y;
    }
    if (!(b > clip->t && t < clip->b)) return;
    const float limit = 1 << 22;
    if (l < -limit || t < -limit || r > limit || b > limit) {
        Pt ln[2] = {src[0], src[3]}, out[4];
        int n = clip_line(ln, clip, out, c->canCull);
        for (int i = 0; i < n; i++) c->emit(c->ctx, V_LINE, &out[i]);
        return;
    }
    Pt monoY[10];
    int cy = chop_cubic_at_y_extrema(src, monoY);
    for (int y = 0; y <= cy; y++) {
        Pt monoX[10];
        int cx = chop_cubic_at_x_extrema(&monoY[y * 3], monoX);
        for (int x = 0; x <= cx; x++) clip_mono_cubic(c, &monoX[x * 3], clip);
    }
}

/* iterate SkPathEdgeIter, clip each edge, emit lines/quads/cubics */
void clip_path_edges(const Path *p, float cl, float ct, float cr, float cb, int canCull, EmitFn emit, void *ctx) {
    Rect clip = {cl, ct, cr, cb};
    Clipper c = {emit, ctx, canCull};
    int pi = 0, wi = 0, needsClose = 0;
    Pt moveTo = {0, 0}, last = {0, 0};
    for (int i = 0; i <= p->nverbs; i++) {
        int v = i < p->nverbs ? p->verbs[i] : -1;
        if (v == -1 || v == V_MOVE || v == V_CLOSE) {
            if (needsClose) {
                Pt q[2] = {last, moveTo}, out[4];
                int n = clip_line(q, &clip, out, canCull);
                for (int k = 0; k < n; k++) emit(ctx, V_LINE, &out[k]);
                needsClose = 0;
            }
            if (v == V_MOVE) { moveTo = last = p->pts[pi]; pi += 1; }
            continue;
        }
        Pt q[4]; q[0] = last;
        int n = v == V_LINE ? 1 : (v == V_QUAD || v == V_CONIC) ? 2 : 3;
        for (int k = 0; k < n; k++) q[k + 1] = p->pts[pi + k];
        pi += n;
        if (v == V_LINE) {
            Pt out[4];
            int nl = clip_line(q, &clip, out, canCull);
            for (int k = 0; k < nl; k++) emit(ctx, V_LINE, &out[k]);
        } else if (v == V_QUAD) {
            clip_quad(&c, q, &clip);
        } else if (v == V_CONIC) {
            Pt qq[1 + 2 * 32];
            int nq = conic_to_quads(q, p->w[wi++], 0.25f, qq);
            for (int k = 0; k < nq; k++) clip_quad(&c, &qq[2 * k], &clip);
        } else {
            clip_cubic(&c, q, &clip);
        }
        last = q[n];
        needsClose = 1;
    }
}
