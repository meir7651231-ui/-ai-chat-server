/* vcfit.c -- C kernels for the prims engine's path refinement (geom.PathModel.project).
 *
 * Bit-exact with the numpy/scipy original on this machine:
 *   x**3            -> numpy's AVX-512 SVML __svml_pow8_ha (address handed in from Python; per-lane results
 *                      do not depend on the other lanes, so padding is harmless)
 *   (n,K)@(K,2)     -> OpenBLAS small dgemm == fma chain over k (verified for K = 2, 3, 4); except n == 1, K == 4
 *                      (gemv path): (0 + fma(b0,c0, b1*c1)) + fma(b2,c2, b3*c3)
 *   (n,2)@(2,)      -> fma(x0, d0, x1*d1);   d@d -> fma(d1, d1, d0*d0)
 *   arr.sum() (3)   -> sequential
 *   cKDTree.query   -> exact nearest neighbour (uniform grid); exact distance ties are reported to the caller,
 *                      which then falls back to the original Python/cKDTree code
 *   np.linspace, np.clip, np.where, np.hypot (glibc) replicated element-wise.
 * Build with -ffp-contract=off (no implicit contraction). */
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <immintrin.h>

typedef __m512d (*pow8_t)(__m512d, __m512d);
static pow8_t g_pow8 = 0;
void vc_set_pow8(void *fn) { g_pow8 = (pow8_t)fn; }

__attribute__((target("avx512f")))
static void pow3_avx512(const double *x, double *o, int n) {
    __m512d three = _mm512_set1_pd(3.0);
    int i = 0;
    for (; i + 8 <= n; i += 8) _mm512_storeu_pd(o + i, g_pow8(_mm512_loadu_pd(x + i), three));
    if (i < n) {
        double b[8], r[8];
        for (int k = 0; k < 8; k++) b[k] = i + k < n ? x[i + k] : 1.0;
        _mm512_storeu_pd(r, g_pow8(_mm512_loadu_pd(b), three));
        for (int k = 0; i + k < n; k++) o[i + k] = r[k];
    }
}
/* numpy x**3 on a contiguous float64 array */
static void pow3(const double *x, double *o, int n) { pow3_avx512(x, o, n); }

int vc_selftest_pow3(const double *x, double *o, int n) { if (!g_pow8) return -1; pow3(x, o, n); return 0; }

/* ------------------------------------------------------------------ path model */
typedef struct { int m; const char *kinds; const double *nodes; const double *inner; } PM;
/* control points of segment i (numpy ctrl()): returns count */
static int ctrl(const PM *M, int i, double c[4][2]) {
    int j = (i + 1) % M->m;
    c[0][0] = M->nodes[2 * i]; c[0][1] = M->nodes[2 * i + 1];
    if (M->kinds[i] == 'L') { c[1][0] = M->nodes[2 * j]; c[1][1] = M->nodes[2 * j + 1]; return 2; }
    if (M->kinds[i] == 'Q') {
        c[1][0] = M->inner[4 * i]; c[1][1] = M->inner[4 * i + 1];
        c[2][0] = M->nodes[2 * j]; c[2][1] = M->nodes[2 * j + 1]; return 3;
    }
    c[1][0] = M->inner[4 * i]; c[1][1] = M->inner[4 * i + 1];
    c[2][0] = M->inner[4 * i + 2]; c[2][1] = M->inner[4 * i + 3];
    c[3][0] = M->nodes[2 * j]; c[3][1] = M->nodes[2 * j + 1]; return 4;
}

/* evaluate basis(kind, t) @ c for an array of t (fma chain over the basis columns) */
static void basis_eval(char kind, const double c[4][2], const double *t, int n, double *out /* n x 2 */,
                       double *w1, double *w2 /* scratch n */) {
    if (kind == 'L') {
        for (int i = 0; i < n; i++) {
            double b0 = 1 - t[i], b1 = t[i];
            for (int k = 0; k < 2; k++) out[2 * i + k] = fma(b1, c[1][k], fma(b0, c[0][k], 0.0));
        }
        return;
    }
    if (kind == 'Q') {
        for (int i = 0; i < n; i++) {
            double u = 1 - t[i];
            double b0 = u * u, b1 = (2 * (1 - t[i])) * t[i], b2 = t[i] * t[i];
            for (int k = 0; k < 2; k++) out[2 * i + k] = fma(b2, c[2][k], fma(b1, c[1][k], fma(b0, c[0][k], 0.0)));
        }
        return;
    }
    /* cubic: mt**3, 3*mt*mt*t, 3*mt*t*t, t**3 */
    for (int i = 0; i < n; i++) w1[i] = 1 - t[i];
    double *p_mt = w2, *p_t = w2 + n;
    pow3(w1, p_mt, n);
    pow3(t, p_t, n);
    for (int i = 0; i < n; i++) {
        double mt = w1[i], ti = t[i];
        double b0 = p_mt[i], b1 = ((3 * mt) * mt) * ti, b2 = ((3 * mt) * ti) * ti, b3 = p_t[i];
        if (n == 1)   /* (1,4)@(4,2): numpy takes the gemv path; OpenBLAS dgemv_n's m=2 tail pairs the terms */
            for (int k = 0; k < 2; k++)
                out[k] = (0.0 + fma(b0, c[0][k], b1 * c[1][k])) + fma(b2, c[2][k], b3 * c[3][k]);
        else
        for (int k = 0; k < 2; k++)
            out[2 * i + k] = fma(b3, c[3][k], fma(b2, c[2][k], fma(b1, c[1][k], fma(b0, c[0][k], 0.0))));
    }
}

/* ------------------------------------------------------------------ exact nearest neighbour */
typedef struct {
    double x0, y0, h; int nx, ny;
    int *start; int *idx;          /* CSR of points per cell */
    const double *S; int ns;
} Grid;
static int grid_build(Grid *g, const double *S, int ns, const double *D, int nd) {
    double xmin = S[0], xmax = S[0], ymin = S[1], ymax = S[1];
    for (int i = 0; i < ns; i++) { double x = S[2 * i], y = S[2 * i + 1];
        if (x < xmin) xmin = x; if (x > xmax) xmax = x; if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
    for (int i = 0; i < nd; i++) { double x = D[2 * i], y = D[2 * i + 1];
        if (x < xmin) xmin = x; if (x > xmax) xmax = x; if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
    if (!isfinite(xmin + xmax + ymin + ymax)) return -1;
    double w = xmax - xmin, hh = ymax - ymin;
    double area = (w + 1e-9) * (hh + 1e-9);
    double h = sqrt(area / (ns > 16 ? ns : 16)) * 1.5;
    if (h < 0.25) h = 0.25;
    g->nx = (int)(w / h) + 1; g->ny = (int)(hh / h) + 1;
    while ((double)g->nx * g->ny > 4.0 * (ns + nd) + 64) { h *= 1.5; g->nx = (int)(w / h) + 1; g->ny = (int)(hh / h) + 1; }
    g->x0 = xmin; g->y0 = ymin; g->h = h; g->S = S; g->ns = ns;
    int nc = g->nx * g->ny;
    g->start = (int *)calloc(nc + 1, sizeof(int)); g->idx = (int *)malloc(sizeof(int) * (ns > 0 ? ns : 1));
    int *cell = (int *)malloc(sizeof(int) * (ns > 0 ? ns : 1));
    for (int i = 0; i < ns; i++) {
        int cx = (int)((S[2 * i] - xmin) / h), cy = (int)((S[2 * i + 1] - ymin) / h);
        if (cx >= g->nx) cx = g->nx - 1; if (cy >= g->ny) cy = g->ny - 1;
        cell[i] = cy * g->nx + cx; g->start[cell[i] + 1]++;
    }
    for (int c = 0; c < nc; c++) g->start[c + 1] += g->start[c];
    int *fill = (int *)malloc(sizeof(int) * (nc + 1)); memcpy(fill, g->start, sizeof(int) * (nc + 1));
    for (int i = 0; i < ns; i++) g->idx[fill[cell[i]]++] = i;   /* ascending index within a cell */
    free(fill); free(cell);
    return 0;
}
static void grid_free(Grid *g) { free(g->start); free(g->idx); }
/* returns nearest index, *tie = 1 if another point has exactly the same distance */
static int grid_query(const Grid *g, double qx, double qy, int *tie) {
    int cx = (int)((qx - g->x0) / g->h), cy = (int)((qy - g->y0) / g->h);
    if (cx >= g->nx) cx = g->nx - 1; if (cy >= g->ny) cy = g->ny - 1; if (cx < 0) cx = 0; if (cy < 0) cy = 0;
    double best = INFINITY; int bi = -1, nbest = 0;
    for (int r = 0;; r++) {
        int x0 = cx - r, x1 = cx + r, y0 = cy - r, y1 = cy + r;
        for (int yy = y0; yy <= y1; yy++) {
            if (yy < 0 || yy >= g->ny) continue;
            int ring = (yy == y0 || yy == y1);
            for (int xx = x0; xx <= x1; xx++) {
                if (xx < 0 || xx >= g->nx) continue;
                if (!ring && xx != x0 && xx != x1) continue;
                int c = yy * g->nx + xx;
                for (int k = g->start[c]; k < g->start[c + 1]; k++) {
                    int i = g->idx[k];
                    double dx = g->S[2 * i] - qx, dy = g->S[2 * i + 1] - qy;
                    double d = 0.0; d += dx * dx; d += dy * dy;   /* scipy sqeuclidean (n = 2) */
                    if (d < best) { best = d; bi = i; nbest = 1; }
                    else if (d == best) nbest++;
                }
            }
        }
        /* lower bound on the distance to every point not yet visited */
        int full = x0 <= 0 && y0 <= 0 && x1 >= g->nx - 1 && y1 >= g->ny - 1;
        if (full) break;
        double lb = INFINITY;
        if (x0 > 0) { double v = qx - (g->x0 + x0 * g->h); if (v < lb) lb = v; }
        if (y0 > 0) { double v = qy - (g->y0 + y0 * g->h); if (v < lb) lb = v; }
        if (x1 < g->nx - 1) { double v = (g->x0 + (x1 + 1) * g->h) - qx; if (v < lb) lb = v; }
        if (y1 < g->ny - 1) { double v = (g->y0 + (y1 + 1) * g->h) - qy; if (v < lb) lb = v; }
        lb -= 1e-9 * g->h;
        if (lb < 0) lb = 0;
        if (bi >= 0 && best < lb * lb * (1 - 1e-9)) break;
    }
    *tie = nbest > 1;
    return bi;
}

/* PathModel.project(D): seg (int64), t, dist.  Returns 0, 1 on an exact NN tie (caller falls back), <0 error. */
int pm_project(int m, const char *kinds, const double *nodes, const double *inner, const double *D, int nd,
               int64_t *seg_out, double *t_out, double *dist_out) {
    if (!g_pow8 || m <= 0) return -2;
    PM M = {m, kinds, nodes, inner};
    /* ---- sample() */
    int cap = 0, *cnt = (int *)malloc(sizeof(int) * m);
    for (int i = 0; i < m; i++) {
        double c[4][2]; int k = ctrl(&M, i, c);
        double L = 0;
        for (int q = 0; q + 1 < k; q++) {
            double h = hypot(c[q + 1][0] - c[q][0], c[q + 1][1] - c[q][1]);
            L = q == 0 ? h : L + h;
        }
        double v = 2 * L;
        double mn = v < 2000 ? v : 2000.0;     /* min(2000, 2L) */
        double mx = mn > 48 ? mn : 48.0;       /* max(48, .) */
        int n = (int)mx;
        cnt[i] = n - 1; cap += n - 1;
    }
    double *S = (double *)malloc(sizeof(double) * 2 * (cap + 1));
    double *TT = (double *)malloc(sizeof(double) * (cap + 1));
    int *SID = (int *)malloc(sizeof(int) * (cap + 1));
    int maxn = 8;
    for (int i = 0; i < m; i++) if (cnt[i] > maxn) maxn = cnt[i];
    if (nd > maxn) maxn = nd;
    double *w1 = (double *)malloc(sizeof(double) * (maxn + 8)), *w2 = (double *)malloc(sizeof(double) * 2 * (maxn + 8));
    int off = 0;
    for (int i = 0; i < m; i++) {
        double c[4][2]; ctrl(&M, i, c);
        int n = cnt[i] + 1;
        double step = 1.0 / (double)(n - 1);
        for (int q = 1; q < n; q++) TT[off + q - 1] = (q == n - 1) ? 1.0 : (double)q * step + 0.0;
        basis_eval(kinds[i], c, TT + off, cnt[i], S + 2 * off, w1, w2);
        for (int q = 0; q < cnt[i]; q++) SID[off + q] = i;
        off += cnt[i];
    }
    /* ---- nearest sample */
    Grid g; int rc = 0;
    if (grid_build(&g, S, cap, D, nd) < 0) { rc = -3; goto done; }
    double *t = t_out;
    for (int p = 0; p < nd; p++) {
        int tie = 0;
        int j = grid_query(&g, D[2 * p], D[2 * p + 1], &tie);
        if (tie || j < 0) { rc = 1; break; }
        seg_out[p] = SID[j]; t[p] = TT[j];
    }
    grid_free(&g);
    if (rc) goto done;
    /* ---- per-segment refinement of t (Newton on the cubic form, closed form for lines) */
    double *tm = (double *)malloc(sizeof(double) * (nd + 8));
    int *ix = (int *)malloc(sizeof(int) * (nd + 8));
    double *mt = (double *)malloc(sizeof(double) * (nd + 8)), *pm3 = (double *)malloc(sizeof(double) * (nd + 8)),
           *pt3 = (double *)malloc(sizeof(double) * (nd + 8));
    for (int i = 0; i < m; i++) {
        int k = 0;
        for (int p = 0; p < nd; p++) if (seg_out[p] == i) ix[k++] = p;
        if (!k) continue;
        double c[4][2]; int nc = ctrl(&M, i, c);
        if (kinds[i] == 'L') {
            double d0 = c[1][0] - c[0][0], d1 = c[1][1] - c[0][1];
            double dd = fma(d1, d1, d0 * d0);
            double den = 1e-12 > dd ? 1e-12 : dd;   /* max(d @ d, 1e-12) */
            for (int q = 0; q < k; q++) {
                int p = ix[q];
                double x0 = D[2 * p] - c[0][0], x1 = D[2 * p + 1] - c[0][1];
                /* numpy (k,2)@(2,): gemv for k >= 2, but a dot product when k == 1 */
                double v = (k == 1 ? fma(x1, d1, x0 * d0) : fma(x0, d0, x1 * d1)) / den;
                t[p] = v < 0 ? 0 : (v > 1 ? 1 : v);
            }
            continue;
        }
        double C[4][2];
        if (kinds[i] == 'Q') {
            for (int a = 0; a < 2; a++) {
                C[0][a] = c[0][a];
                C[1][a] = c[0][a] + 2.0 / 3 * (c[1][a] - c[0][a]);
                C[2][a] = c[2][a] + 2.0 / 3 * (c[1][a] - c[2][a]);
                C[3][a] = c[2][a];
            }
        } else memcpy(C, c, sizeof C);
        (void)nc;
        double e10[2], e21[2], e32[2], s2[2], s3[2];
        for (int a = 0; a < 2; a++) {
            e10[a] = C[1][a] - C[0][a]; e21[a] = C[2][a] - C[1][a]; e32[a] = C[3][a] - C[2][a];
            s2[a] = (C[2][a] - 2 * C[1][a]) + C[0][a];
            s3[a] = (C[3][a] - 2 * C[2][a]) + C[1][a];
        }
        for (int q = 0; q < k; q++) tm[q] = t[ix[q]];
        for (int it = 0; it < 4; it++) {
            for (int q = 0; q < k; q++) mt[q] = 1 - tm[q];
            pow3(mt, pm3, k); pow3(tm, pt3, k);
            for (int q = 0; q < k; q++) {
                int p = ix[q];
                double u = mt[q], tt = tm[q];
                double b1 = ((3 * u) * u) * tt, b2 = ((3 * u) * tt) * tt;
                double qq[2], q1[2], q2[2];
                double a1 = u * u, a2 = (2 * u) * tt, a3 = tt * tt;
                for (int a = 0; a < 2; a++) {
                    double bz = ((pm3[q] * C[0][a] + b1 * C[1][a]) + b2 * C[2][a]) + pt3[q] * C[3][a];
                    qq[a] = bz - D[2 * p + a];
                    q1[a] = 3 * ((a1 * e10[a] + a2 * e21[a]) + a3 * e32[a]);
                    q2[a] = 6 * (u * s2[a] + tt * s3[a]);
                }
                double num = qq[0] * q1[0] + qq[1] * q1[1];
                double den = (q1[0] * q1[0] + q1[1] * q1[1]) + (qq[0] * q2[0] + qq[1] * q2[1]);
                double step = fabs(den) > 1e-12 ? num / den : 0;
                double v = tt - step;
                tm[q] = v < 0 ? 0 : (v > 1 ? 1 : v);
            }
        }
        for (int q = 0; q < k; q++) t[ix[q]] = tm[q];
    }
    /* ---- distances: basis(kind, t) @ ctrl  (original control points) */
    {
        double *Q = (double *)malloc(sizeof(double) * 2 * (nd + 8)), *ts = (double *)malloc(sizeof(double) * (nd + 8));
        for (int i = 0; i < m; i++) {
            int k = 0;
            for (int p = 0; p < nd; p++) if (seg_out[p] == i) { ix[k] = p; ts[k] = t[p]; k++; }
            if (!k) continue;
            double c[4][2]; ctrl(&M, i, c);
            basis_eval(kinds[i], c, ts, k, Q, w1, w2);
            for (int q = 0; q < k; q++) {
                int p = ix[q];
                dist_out[p] = hypot(Q[2 * q] - D[2 * p], Q[2 * q + 1] - D[2 * p + 1]);
            }
        }
        free(Q); free(ts);
    }
    free(tm); free(ix); free(mt); free(pm3); free(pt3);
done:
    free(cnt); free(S); free(TT); free(SID); free(w1); free(w2);
    return rc;
}

/* ------------------------------------------------------------------ geom.seg_dist / geom._stroke_res_jac */
static inline double matvec2(double x0, double x1, double d0, double d1, int nrows) {
    return nrows == 1 ? fma(x1, d1, x0 * d0) : fma(x0, d0, x1 * d1);
}
/* seg_dist(P, A, B) -> out (n) */
void vc_seg_dist(const double *P, int n, const double *A, const double *B, double *out) {
    double d0 = B[0] - A[0], d1 = B[1] - A[1];
    double L2 = fma(d1, d1, d0 * d0);
    if (L2 < 1e-12) { for (int i = 0; i < n; i++) out[i] = hypot(P[2 * i] - A[0], P[2 * i + 1] - A[1]); return; }
    for (int i = 0; i < n; i++) {
        double x0 = P[2 * i] - A[0], x1 = P[2 * i + 1] - A[1];
        double t = matvec2(x0, x1, d0, d1, n) / L2;
        t = t < 0 ? 0 : (t > 1 ? 1 : t);
        double q0 = A[0] + t * d0, q1 = A[1] + t * d1;
        out[i] = hypot(P[2 * i] - q0, P[2 * i + 1] - q1);
    }
}
/* _stroke_res_jac(P, VV, hw, closed) -> best_d (n), best (n x 4), nx, ny */
void vc_stroke_res_jac(const double *P, int n, const double *VV, int nv, int closed,
                       double *best_d, double *best, double *nx, double *ny) {
    for (int p = 0; p < n; p++) { best_d[p] = INFINITY; best[4 * p] = best[4 * p + 1] = best[4 * p + 2] = best[4 * p + 3] = 0; nx[p] = ny[p] = 0; }
    int ns = closed ? nv : nv - 1;
    for (int s = 0; s < ns; s++) {
        int i = s, j = (s + 1) % nv;
        const double *A = VV + 2 * i, *B = VV + 2 * j;
        double d0 = B[0] - A[0], d1 = B[1] - A[1];
        double L2 = fma(d1, d1, d0 * d0);
        double den = 1e-12 > L2 ? 1e-12 : L2;      /* max(L2, 1e-12) */
        for (int p = 0; p < n; p++) {
            double x0 = P[2 * p] - A[0], x1 = P[2 * p + 1] - A[1];
            double t = matvec2(x0, x1, d0, d1, n) / den;
            t = t < 0 ? 0 : (t > 1 ? 1 : t);
            double q0 = A[0] + t * d0, q1 = A[1] + t * d1;
            double D0 = P[2 * p] - q0, D1 = P[2 * p + 1] - q1;
            double dist = hypot(D0, D1);
            if (dist < best_d[p]) {
                best_d[p] = dist;
                best[4 * p] = i; best[4 * p + 1] = j; best[4 * p + 2] = t;
                double nn = dist >= 1e-9 ? dist : (dist != dist ? dist : 1e-9);   /* np.maximum(dist, 1e-9) */
                nx[p] = D0 / nn; ny[p] = D1 / nn;
            }
        }
    }
}

/* PathModel.solve: the matrix A (nd x nv, row-major, zero-initialised by the caller) */
int vc_solve_A(int m, const char *kinds, const int *var0, const int *var1, int nv, const int64_t *seg, const double *t,
               const double *w, int nd, double *A) {
    if (!g_pow8) return -2;
    double *ts = (double *)malloc(sizeof(double) * (nd + 8)), *bs = (double *)malloc(sizeof(double) * 4 * (nd + 8));
    double *mt = (double *)malloc(sizeof(double) * (nd + 8)), *p1 = (double *)malloc(sizeof(double) * (nd + 8)),
           *p2 = (double *)malloc(sizeof(double) * (nd + 8));
    int *ix = (int *)malloc(sizeof(int) * (nd + 8));
    for (int i = 0; i < m; i++) {
        int k = 0;
        for (int p = 0; p < nd; p++) if (seg[p] == i) { ix[k] = p; ts[k] = t[p]; k++; }
        if (!k) continue;
        int j = (i + 1) % m;
        char kd = kinds[i];
        if (kd == 'C') { for (int q = 0; q < k; q++) mt[q] = 1 - ts[q]; pow3(mt, p1, k); pow3(ts, p2, k); }
        for (int q = 0; q < k; q++) {
            int p = ix[q]; double tt = ts[q], ww = w[p];
            double *row = A + (size_t)p * nv;
            if (kd == 'L') {
                double b0 = (1 - tt) * ww, b1 = tt * ww;
                row[i] += b0; row[j] += b1;
            } else if (kd == 'Q') {
                double u = 1 - tt;
                double b0 = (u * u) * ww, b1 = ((2 * (1 - tt)) * tt) * ww, b2 = (tt * tt) * ww;
                row[i] += b0; row[var0[i]] += b1; row[j] += b2;
            } else {
                double u = mt[q];
                double b0 = p1[q] * ww, b1 = (((3 * u) * u) * tt) * ww, b2 = (((3 * u) * tt) * tt) * ww, b3 = p2[q] * ww;
                row[i] += b0; row[var0[i]] += b1; row[var1[i]] += b2; row[j] += b3;
            }
        }
    }
    free(ts); free(bs); free(mt); free(p1); free(p2); free(ix);
    return 0;
}

/* ------------------------------------------------------------------ verify.sse: float(((a - b) ** 2).sum()) on float32
 * numpy FLOAT_pairwise_sum (8 partial sums, blocks of 128, recursive halving), accumulating in float32 */
static inline float sqd(const float *a, const float *b, intptr_t i) { float d = a[i] - b[i]; return d * d; }
static float pw_sum_sq(const float *a, const float *b, intptr_t n) {
    if (n < 8) {
        float res = 0.f;
        for (intptr_t i = 0; i < n; i++) res += sqd(a, b, i);
        return res;
    } else if (n <= 128) {
        float r[8], res;
        for (int k = 0; k < 8; k++) r[k] = sqd(a, b, k);
        intptr_t i;
        for (i = 8; i < n - (n % 8); i += 8)
            for (int k = 0; k < 8; k++) r[k] += sqd(a, b, i + k);
        res = ((r[0] + r[1]) + (r[2] + r[3])) + ((r[4] + r[5]) + (r[6] + r[7]));
        for (; i < n; i++) res += sqd(a, b, i);
        return res;
    } else {
        intptr_t n2 = n / 2;
        n2 -= n2 % 8;
        return pw_sum_sq(a, b, n2) + pw_sum_sq(a + n2, b + n2, n - n2);
    }
}
double vc_sse_f32(const float *a, const float *b, intptr_t n) {
    float s = 0.f;
    s += pw_sum_sq(a, b, n);
    return (double)s;
}

/* PathModel.solve, sparse form: A in COO (row, col, val) with exactly the entries of the dense A
 * (same arithmetic, duplicates summed in the same order).  Returns the entry count. */
int vc_solve_A_coo(int m, const char *kinds, const int *var0, const int *var1, const int64_t *seg, const double *t,
                   const double *w, int nd, int32_t *rows, int32_t *cols, double *vals) {
    if (!g_pow8) return -2;
    double *mt = (double *)malloc(sizeof(double) * (nd + 8)), *p1 = (double *)malloc(sizeof(double) * (nd + 8)),
           *p2 = (double *)malloc(sizeof(double) * (nd + 8)), *ts = (double *)malloc(sizeof(double) * (nd + 8));
    int *ix = (int *)malloc(sizeof(int) * (nd + 8));
    /* per row: up to 4 (col, val) pairs, merged when columns coincide (m == 1) */
    int32_t *rc = (int32_t *)malloc(sizeof(int32_t) * 4 * (size_t)nd); double *rv = (double *)malloc(sizeof(double) * 4 * (size_t)nd);
    int *rn = (int *)calloc(nd, sizeof(int));
    for (int i = 0; i < m; i++) {
        int k = 0;
        for (int p = 0; p < nd; p++) if (seg[p] == i) { ix[k] = p; ts[k] = t[p]; k++; }
        if (!k) continue;
        int j = (i + 1) % m;
        char kd = kinds[i];
        if (kd == 'C') { for (int q = 0; q < k; q++) mt[q] = 1 - ts[q]; pow3(mt, p1, k); pow3(ts, p2, k); }
        for (int q = 0; q < k; q++) {
            int p = ix[q]; double tt = ts[q], ww = w[p];
            int cc[4]; double bb[4]; int nb;
            if (kd == 'L') { cc[0] = i; bb[0] = (1 - tt) * ww; cc[1] = j; bb[1] = tt * ww; nb = 2; }
            else if (kd == 'Q') {
                double u = 1 - tt;
                cc[0] = i; bb[0] = (u * u) * ww; cc[1] = var0[i]; bb[1] = ((2 * (1 - tt)) * tt) * ww; cc[2] = j; bb[2] = (tt * tt) * ww; nb = 3;
            } else {
                double u = mt[q];
                cc[0] = i; bb[0] = p1[q] * ww; cc[1] = var0[i]; bb[1] = (((3 * u) * u) * tt) * ww;
                cc[2] = var1[i]; bb[2] = (((3 * u) * tt) * tt) * ww; cc[3] = j; bb[3] = p2[q] * ww; nb = 4;
            }
            for (int e = 0; e < nb; e++) {
                int found = -1;
                for (int z = 0; z < rn[p]; z++) if (rc[4 * p + z] == cc[e]) found = z;
                if (found >= 0) rv[4 * p + found] = rv[4 * p + found] + bb[e];
                else { rc[4 * p + rn[p]] = cc[e]; rv[4 * p + rn[p]] = 0.0 + bb[e]; rn[p]++; }
            }
        }
    }
    int n = 0;
    for (int p = 0; p < nd; p++) for (int z = 0; z < rn[p]; z++) { rows[n] = p; cols[n] = rc[4 * p + z]; vals[n] = rv[4 * p + z]; n++; }
    free(mt); free(p1); free(p2); free(ts); free(ix); free(rc); free(rv); free(rn);
    return n;
}

/* Large PathModel.solve without the dense O(nd nv^2) normal matrix: N = A^T A + diag(reg^2) assembled from the
 * <= 4 non-zeros per point, variables re-ordered (node i, its inner points, node i+1, ...) so that N is banded
 * with only the wrap-around segment coupling to variable 0, then an envelope (skyline) Cholesky.
 * Same equations as the dense path; the solution differs from LAPACK only in rounding. -1 -> caller falls back. */
int vc_solve_sparse(int m, const char *kinds, const int *var0, const int *var1, int nv, const int64_t *seg,
                    const double *t, const double *w, const double *D, int nd, const double *reg, const double *tgt,
                    double *X /* nv x 2, original variable order */) {
    if (!g_pow8) return -2;
    int32_t *rows = (int32_t *)malloc(sizeof(int32_t) * 4 * (size_t)nd), *cols = (int32_t *)malloc(sizeof(int32_t) * 4 * (size_t)nd);
    double *vals = (double *)malloc(sizeof(double) * 4 * (size_t)nd);
    int ne = vc_solve_A_coo(m, kinds, var0, var1, seg, t, w, nd, rows, cols, vals);
    int rc = 0;
    /* permutation: interleaved order */
    int *pos = (int *)malloc(sizeof(int) * nv), *inv = (int *)malloc(sizeof(int) * nv);
    int k = 0;
    for (int i = 0; i < m; i++) {
        pos[i] = k++;
        if (kinds[i] == 'C') { pos[var0[i]] = k++; pos[var1[i]] = k++; }
        else if (kinds[i] == 'Q') pos[var0[i]] = k++;
    }
    if (k != nv || ne < 0) { rc = -1; goto out; }
    for (int i = 0; i < nv; i++) inv[pos[i]] = i;
    /* envelope: first column per row */
    int *first = (int *)malloc(sizeof(int) * nv);
    for (int i = 0; i < nv; i++) first[i] = i;
    for (int e = 0; e < ne; ) {
        int p = rows[e], e2 = e;
        while (e2 < ne && rows[e2] == p) e2++;
        for (int a = e; a < e2; a++) for (int b = e; b < e2; b++) {
            int ia = pos[cols[a]], ib = pos[cols[b]];
            if (ib < ia && ib < first[ia]) first[ia] = ib;
        }
        e = e2;
    }
    size_t *off = (size_t *)malloc(sizeof(size_t) * (nv + 1));
    off[0] = 0;
    for (int i = 0; i < nv; i++) off[i + 1] = off[i] + (size_t)(i - first[i] + 1);
    double *L = (double *)calloc(off[nv], sizeof(double));   /* row i: columns first[i]..i */
    double *b = (double *)calloc((size_t)nv * 2, sizeof(double));
#define ENV(i, j) L[off[i] + (size_t)((j) - first[i])]
    for (int e = 0; e < ne; ) {
        int p = rows[e], e2 = e;
        while (e2 < ne && rows[e2] == p) e2++;
        double dw0 = D[2 * p] * w[p], dw1 = D[2 * p + 1] * w[p];
        for (int a = e; a < e2; a++) {
            int ia = pos[cols[a]];
            b[2 * ia] += vals[a] * dw0; b[2 * ia + 1] += vals[a] * dw1;
            for (int c = e; c < e2; c++) {
                int ib = pos[cols[c]];
                if (ib <= ia) ENV(ia, ib) += vals[a] * vals[c];
            }
        }
        e = e2;
    }
    for (int v = 0; v < nv; v++) {
        int i = pos[v];
        double r2 = reg[v] * reg[v];
        ENV(i, i) += r2;
        b[2 * i] += tgt[2 * v] * r2; b[2 * i + 1] += tgt[2 * v + 1] * r2;
    }
    /* envelope Cholesky N = L L^T */
    for (int i = 0; i < nv; i++) {
        for (int j = first[i]; j <= i; j++) {
            int k0 = first[i] > first[j] ? first[i] : first[j];
            double s = ENV(i, j);
            for (int q = k0; q < j; q++) s -= ENV(i, q) * ENV(j, q);
            if (j < i) ENV(i, j) = s / ENV(j, j);
            else {
                if (!(s > 0) || !isfinite(s)) { rc = -1; break; }
                ENV(i, i) = sqrt(s);
            }
        }
        if (rc) break;
    }
    if (!rc) {
        /* forward: L y = b ; backward: L^T x = y */
        for (int i = 0; i < nv; i++) for (int c = 0; c < 2; c++) {
            double s = b[2 * i + c];
            for (int q = first[i]; q < i; q++) s -= ENV(i, q) * b[2 * q + c];
            b[2 * i + c] = s / ENV(i, i);
        }
        for (int i = nv - 1; i >= 0; i--) for (int c = 0; c < 2; c++) {
            double s = b[2 * i + c] / ENV(i, i);
            b[2 * i + c] = s;
            for (int q = first[i]; q < i; q++) b[2 * q + c] -= ENV(i, q) * s;
        }
        for (int i = 0; i < nv; i++) { X[2 * inv[i]] = b[2 * i]; X[2 * inv[i] + 1] = b[2 * i + 1]; if (!isfinite(b[2 * i]) || !isfinite(b[2 * i + 1])) rc = -1; }
    }
#undef ENV
    free(first); free(off); free(L); free(b);
out:
    free(rows); free(cols); free(vals); free(pos); free(inv);
    return rc;
}
