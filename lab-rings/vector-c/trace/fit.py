"""Geometry for the 'trace' vectorizer: sub-pixel contours, corners, Schneider cubic fitting,
primitive recognition and compact SVG path formatting."""
import math
import numpy as np
from skimage import measure


# ----------------------------------------------------------------------------- contours
def area_inv(F, a, b):
    """Offset s (from pixel centre, along unit normal (a,b) with a>=b>=0) of a straight edge
    that leaves fraction F of the unit pixel on the inner side."""
    s = np.empty_like(F)
    small = b < 1e-6
    lo = np.where(small, 0.0, b / (2 * np.maximum(a, 1e-9)))
    m1 = (F < lo) & ~small
    m3 = (F > 1 - lo) & ~small
    m2 = ~(m1 | m3)
    s[m2] = a[m2] * (F[m2] - 0.5)
    s[m1] = -(a[m1] + b[m1]) / 2 + np.sqrt(2 * a[m1] * b[m1] * F[m1])
    s[m3] = (a[m3] + b[m3]) / 2 - np.sqrt(2 * a[m3] * b[m3] * (1 - F[m3]))
    return s


def contours(F, x0=0, y0=0, min_area=1.5):
    """Iso-0.5 contours of coverage field F (pixel centres at i+0.5), corrected to sub-pixel
    accuracy by inverting the box-filter coverage of the partially covered pixel.
    Returns list of closed (N,2) arrays in absolute (x, y)."""
    Fp = np.pad(F.astype(np.float64), 1)
    H, W = Fp.shape
    out = []
    for c in measure.find_contours(Fp, 0.5):
        if len(c) < 4:
            continue
        if np.abs(c[0] - c[-1]).max() > 1e-6:
            continue
        c = c[:-1]
        r, q = c[:, 0], c[:, 1]
        # samples at both ends of the grid edge the vertex lies on
        horiz = np.abs(r - np.round(r)) < 1e-9
        ra = np.where(horiz, np.round(r), np.floor(r)).astype(int)
        qa = np.where(horiz, np.floor(q), np.round(q)).astype(int)
        rb = np.where(horiz, ra, ra + 1); qb = np.where(horiz, qa + 1, qa)
        ra = np.clip(ra, 0, H - 1); rb = np.clip(rb, 0, H - 1); qa = np.clip(qa, 0, W - 1); qb = np.clip(qb, 0, W - 1)
        Fa = Fp[ra, qa]; Fb = Fp[rb, qb]
        # normal from smoothed tangent
        n = len(c)
        k = 2
        tang = np.roll(c, -k, 0) - np.roll(c, k, 0)
        tl = np.hypot(tang[:, 0], tang[:, 1]) + 1e-12
        nr, nq = -tang[:, 1] / tl, tang[:, 0] / tl  # perpendicular (row, col)
        # orient normal outward (towards lower F): compare with a->b direction
        dr, dq = rb - ra, qb - qa
        sgn = np.sign((Fa - Fb) * (nr * dr + nq * dq))
        sgn[sgn == 0] = 1
        nr, nq = nr * sgn, nq * sgn
        pa = (Fa > 0.02) & (Fa < 0.98); pb = (Fb > 0.02) & (Fb < 0.98)
        useb = pb & (~pa | (np.abs(Fb - 0.5) < np.abs(Fa - 0.5)))
        use = pa | pb
        Fq = np.where(useb, Fb, Fa)
        qr = np.where(useb, rb, ra).astype(float); qq = np.where(useb, qb, qa).astype(float)
        a_ = np.maximum(np.abs(nr), np.abs(nq)); b_ = np.minimum(np.abs(nr), np.abs(nq))
        s = area_inv(Fq, a_, b_)
        # edge line: n.(x - centre_q) = s ; project vertex onto it
        dist = nr * (r - qr) + nq * (q - qq) - s
        corr = np.where(use, dist, 0.0)
        corr = np.clip(corr, -0.75, 0.75)
        r2 = r - corr * nr; q2 = q - corr * nq
        pts = np.stack([q2 - 1 + x0 + 0.5, r2 - 1 + y0 + 0.5], 1)
        # area filter
        A = 0.5 * abs(np.dot(pts[:, 0], np.roll(pts[:, 1], -1)) - np.dot(pts[:, 1], np.roll(pts[:, 0], -1)))
        if A < min_area:
            continue
        # drop near-duplicate points
        d = np.hypot(*(np.roll(pts, -1, 0) - pts).T)
        pts = pts[d > 1e-3]
        if len(pts) >= 4:
            out.append(pts)
    return out


def poly_area(p):
    return 0.5 * (np.dot(p[:, 0], np.roll(p[:, 1], -1)) - np.dot(p[:, 1], np.roll(p[:, 0], -1)))


# ----------------------------------------------------------------------------- corners
def arclen(p, closed=True):
    d = np.hypot(*np.diff(np.vstack([p, p[:1]]) if closed else p, axis=0).T)
    return d


def _arm_angles(p, s0, total, L):
    n = len(p)
    ext_s = np.concatenate([s0 - total, s0, s0 + total])
    ext_p = np.vstack([p, p, p])
    # arm directions: mean of unit vectors to points on each arm (robust to spacing)
    a = np.zeros_like(p); b = np.zeros_like(p)
    for off in (0.5, 0.75, 1.0):
        ibo = np.searchsorted(ext_s, s0 - L * off, side='right') - 1
        jfo = np.searchsorted(ext_s, s0 + L * off, side='left')
        ibo = np.clip(ibo, 0, 3 * n - 1); jfo = np.clip(jfo, 0, 3 * n - 1)
        va = p - ext_p[ibo]; vb = ext_p[jfo] - p
        a += va / (np.hypot(*va.T)[:, None] + 1e-12); b += vb / (np.hypot(*vb.T)[:, None] + 1e-12)
    na = np.hypot(*a.T) + 1e-12; nb = np.hypot(*b.T) + 1e-12
    cosang = (a * b).sum(1) / (na * nb)
    return np.degrees(np.arccos(np.clip(cosang, -1, 1)))


def find_corners(p, L=2.5, theta=45.0):
    """Corners = large turning angle that is concentrated (sharp), not spread (round)."""
    seg = arclen(p)
    s = np.concatenate([[0], np.cumsum(seg)])
    total = s[-1]
    s0 = s[:-1]
    Lb = min(4.0, total / 8)
    Ls = Lb / 2
    ang = _arm_angles(p, s0, total, Lb)
    angs = _arm_angles(p, s0, total, Ls)
    sharp = angs >= 0.62 * ang
    cand = []
    for i in np.argsort(-ang):
        if ang[i] < theta:
            break
        if not sharp[i]:
            continue
        ok = True
        for j in cand:
            d = abs(s0[i] - s0[j]); d = min(d, total - d)
            if d < 1.5 * Lb:
                ok = False; break
        if ok:
            cand.append(i)
    return sorted(cand), ang


def line_fit(P):
    c = P.mean(0)
    _, _, Vt = np.linalg.svd(P - c)
    return c, Vt[0]


def refine_corner(p, i, s0, total, L, prev_c, next_c):
    """Intersection of lines fitted to both arms of corner i."""
    n = len(p)
    def arm(direction):
        idx = []
        j = i
        for _ in range(n):
            j = (j + direction) % n
            d = (s0[i] - s0[j]) * (-direction) if True else 0
            d = (s0[j] - s0[i]) % total if direction > 0 else (s0[i] - s0[j]) % total
            if d > L + 4 or j in (prev_c, next_c):
                break
            if d >= 0.9:
                idx.append(j)
        return idx
    A = arm(-1); B = arm(1)
    if len(A) < 2 or len(B) < 2:
        return p[i]
    c1, d1 = line_fit(p[A]); c2, d2 = line_fit(p[B])
    M = np.array([d1, -d2]).T
    if abs(np.linalg.det(M)) < 0.2:
        return p[i]
    t = np.linalg.solve(M, c2 - c1)
    q = c1 + t[0] * d1
    if np.hypot(*(q - p[i])) > 1.5:
        return p[i]
    # arm fit residual must be small (straight arms) otherwise keep vertex
    return q


# ----------------------------------------------------------------------------- Schneider
def bez_pt(b, t):
    t = np.asarray(t)[:, None]
    mt = 1 - t
    return mt ** 3 * b[0] + 3 * mt * mt * t * b[1] + 3 * mt * t * t * b[2] + t ** 3 * b[3]


def bez_d1(b, t):
    t = np.asarray(t)[:, None]; mt = 1 - t
    return 3 * mt * mt * (b[1] - b[0]) + 6 * mt * t * (b[2] - b[1]) + 3 * t * t * (b[3] - b[2])


def bez_d2(b, t):
    t = np.asarray(t)[:, None]; mt = 1 - t
    return 6 * mt * (b[2] - 2 * b[1] + b[0]) + 6 * t * (b[3] - 2 * b[2] + b[1])


def chord_param(p):
    d = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])
    return d / d[-1] if d[-1] > 0 else np.linspace(0, 1, len(p))


def gen_bez(p, u, t1, t2):
    p0, p3 = p[0], p[-1]
    mt = 1 - u
    B0, B1, B2, B3 = mt ** 3, 3 * mt * mt * u, 3 * mt * u * u, u ** 3
    A1 = t1[None] * B1[:, None]; A2 = t2[None] * B2[:, None]
    C00 = (A1 * A1).sum(); C01 = (A1 * A2).sum(); C11 = (A2 * A2).sum()
    tmp = p - (p0[None] * (B0 + B1)[:, None] + p3[None] * (B2 + B3)[:, None])
    X0 = (A1 * tmp).sum(); X1 = (A2 * tmp).sum()
    det = C00 * C11 - C01 * C01
    seg = np.hypot(*(p3 - p0))
    if abs(det) > 1e-12:
        al = (X0 * C11 - X1 * C01) / det
        ar = (C00 * X1 - C01 * X0) / det
    else:
        al = ar = seg / 3
    eps = 1e-6 * seg
    if al < eps or ar < eps or al > 3 * seg or ar > 3 * seg:
        al = ar = seg / 3
    return np.array([p0, p0 + t1 * al, p3 + t2 * ar, p3])


def reparam(b, p, u):
    q = bez_pt(b, u) - p
    d1 = bez_d1(b, u); d2 = bez_d2(b, u)
    num = (q * d1).sum(1)
    den = (d1 * d1).sum(1) + (q * d2).sum(1)
    un = np.where(np.abs(den) > 1e-12, u - num / np.where(np.abs(den) > 1e-12, den, 1), u)
    un = np.clip(un, 0, 1)
    un[0], un[-1] = 0, 1
    return np.maximum.accumulate(un)


def max_err(b, p, u):
    d = ((bez_pt(b, u) - p) ** 2).sum(1)
    i = int(np.argmax(d[1:-1])) + 1 if len(p) > 2 else 0
    return math.sqrt(d[i]), i


def unit(v):
    n = math.hypot(v[0], v[1])
    return v / n if n > 1e-12 else np.array([1.0, 0.0])


def tangent_at(p, i, direction, L=2.0):
    """Unit tangent at p[i] estimated from points within arc length L in given direction."""
    acc = np.zeros(2); s = 0.0; j = i
    n = len(p)
    while True:
        j2 = j + direction
        if j2 < 0 or j2 >= n:
            break
        s += math.hypot(*(p[j2] - p[j]))
        acc += unit(p[j2] - p[i])
        j = j2
        if s >= L:
            break
    if not acc.any():
        return unit(p[min(i + direction, n - 1)] - p[i]) if 0 <= i + direction < n else np.array([1.0, 0])
    return unit(acc)


def fit_cubic(p, t1, t2, tol, depth=0):
    n = len(p)
    if n == 2 or depth > 12:
        d = math.hypot(*(p[-1] - p[0])) / 3
        return [np.array([p[0], p[0] + t1 * d, p[-1] + t2 * d, p[-1]])]
    u = chord_param(p)
    b = gen_bez(p, u, t1, t2)
    e, split = max_err(b, p, u)
    if e < tol:
        return [b]
    if e < tol * 6:
        for _ in range(12):
            u = reparam(b, p, u)
            b = gen_bez(p, u, t1, t2)
            e, split = max_err(b, p, u)
            if e < tol:
                return [b]
    if n <= 3:
        return [b]
    split = min(max(split, 1), n - 2)
    tc = unit(p[split - 1] - p[split + 1])
    if not tc.any():
        tc = unit(p[split - 1] - p[split])
    return fit_cubic(p[:split + 1], t1, tc, tol, depth + 1) + fit_cubic(p[split:], -tc, t2, tol, depth + 1)


def fit_one(p, t1, t2, tol, iters=10):
    """Single cubic with fixed end tangents; returns (bezier, max error)."""
    if len(p) == 2:
        d = math.hypot(*(p[-1] - p[0])) / 3
        return np.array([p[0], p[0] + t1 * d, p[-1] + t2 * d, p[-1]]), 0.0
    u = chord_param(p)
    b = gen_bez(p, u, t1, t2)
    e, _ = max_err(b, p, u)
    for _ in range(iters):
        if e < tol:
            break
        u = reparam(b, p, u)
        b = gen_bez(p, u, t1, t2)
        e2, _ = max_err(b, p, u)
        if e2 > e * 0.98:
            e = e2
            break
        e = e2
    return b, e


def local_tangents(p, W=6.0):
    """Unit tangent at every point from a local quadratic fit x(s), y(s) over +-W of arc length."""
    n = len(p)
    s = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])
    lo = np.searchsorted(s, s - W, side='left')
    hi = np.searchsorted(s, s + W, side='right')
    T = np.zeros((n, 2))
    for k in range(n):
        a, b = lo[k], hi[k]
        if b - a < 3:
            a, b = max(0, k - 1), min(n, k + 2)
        ss = s[a:b] - s[k]
        if b - a >= 4:
            A = np.stack([np.ones_like(ss), ss, ss * ss], 1)
        else:
            A = np.stack([np.ones_like(ss), ss], 1)
        coef, *_ = np.linalg.lstsq(A, p[a:b], rcond=None)
        v = coef[1]
        nv = math.hypot(*v)
        T[k] = v / nv if nv > 1e-9 else (1.0, 0.0)
    return T


def optimize_chain(p, idx, bez, fix0, fix1, outer=3):
    """Joint least squares on a G1 chain of cubics: vertex normal offsets, shared tangent angles and
    handle lengths.  idx: point index of each vertex (len m+1)."""
    from scipy.optimize import least_squares
    m = len(bez)
    if m == 0:
        return bez
    V0 = np.array([bez[0][0]] + [b[3] for b in bez])
    T0 = np.zeros((m + 1, 2))
    T0[0] = unit(bez[0][1] - bez[0][0])
    for k in range(1, m + 1):
        T0[k] = unit(bez[k - 1][3] - bez[k - 1][2])
    th0 = np.arctan2(T0[:, 1], T0[:, 0])
    N0 = np.stack([-T0[:, 1], T0[:, 0]], 1)
    A0 = np.array([[math.hypot(*(b[1] - b[0])), math.hypot(*(b[3] - b[2]))] for b in bez])
    free_th = [k for k in range(m + 1) if not ((k == 0 and fix0) or (k == m and fix1))]
    free_o = list(range(1, m))
    segpts = [p[idx[k]:idx[k + 1] + 1] for k in range(m)]
    us = [chord_param(q) for q in segpts]

    def build(x):
        o = np.zeros(m + 1); th = th0.copy()
        o[free_o] = x[:len(free_o)]
        th[free_th] = th0[free_th] + x[len(free_o):len(free_o) + len(free_th)]
        A = A0 * np.exp(x[len(free_o) + len(free_th):].reshape(m, 2))
        V = V0 + o[:, None] * N0
        T = np.stack([np.cos(th), np.sin(th)], 1)
        return [np.array([V[k], V[k] + T[k] * A[k, 0], V[k + 1] - T[k + 1] * A[k, 1], V[k + 1]]) for k in range(m)]

    def resid(x):
        bs = build(x)
        return np.concatenate([(bez_pt(b, u) - q).ravel() for b, u, q in zip(bs, us, segpts)])

    x = np.zeros(len(free_o) + len(free_th) + 2 * m)
    lb = np.concatenate([np.full(len(free_o), -1.0), np.full(len(free_th), -0.6), np.full(2 * m, -2.5)])
    ub = -lb
    # Jacobian sparsity: segment k depends on its two vertices, their tangents and its handles
    from scipy.sparse import lil_matrix
    po = {k: i for i, k in enumerate(free_o)}
    pt = {k: len(free_o) + i for i, k in enumerate(free_th)}
    nres = sum(2 * len(q) for q in segpts)
    S = lil_matrix((nres, len(x)), dtype=int)
    row = 0
    for k, q in enumerate(segpts):
        cols = [po[v] for v in (k, k + 1) if v in po] + [pt[v] for v in (k, k + 1) if v in pt]
        cols += [len(free_o) + len(free_th) + 2 * k, len(free_o) + len(free_th) + 2 * k + 1]
        for c in cols:
            S[row:row + 2 * len(q), c] = 1
        row += 2 * len(q)
    for _ in range(outer):
        try:
            r = least_squares(resid, x, method='trf', bounds=(lb, ub), jac_sparsity=S, max_nfev=30)
            x = r.x
        except Exception:
            break
        bs = build(x)
        us = [reparam(b, q, u) for b, q, u in zip(bs, segpts, us)]
    return build(x)


def chain_err(bez, p, idx):
    e = 0.0
    for k, b in enumerate(bez):
        q = p[idx[k]:idx[k + 1] + 1]
        u = chord_param(q)
        for _ in range(4):
            u = reparam(b, q, u)
        e = max(e, float(np.sqrt(((bez_pt(b, u) - q) ** 2).sum(1)).max()))
    return e


def seg_errs(bez, p, idx):
    out = []
    for k, b in enumerate(bez):
        q = p[idx[k]:idx[k + 1] + 1]
        u = chord_param(q)
        for _ in range(4):
            u = reparam(b, q, u)
        e = np.sqrt(((bez_pt(b, u) - q) ** 2).sum(1))
        out.append(e)
    return out


def fit_greedy(p, t1, t2, tol, fix0=True, fix1=True):
    """Greedy segmentation (max error <= tol) refined by joint chain optimisation.  A coarser
    segmentation is used instead when, after optimisation, it still honours tol."""
    bez0, idx0 = _fit_greedy(p, t1, t2, tol)
    if not OPTIMIZE or len(p) < 6:
        return bez0
    def opt(bez, idx):
        try:
            return optimize_chain(p, idx, bez, fix0, fix1)
        except Exception:
            return bez
    def score(bez, idx):
        e = np.concatenate(seg_errs(bez, p, idx))
        return e.max(), float(np.sqrt((e ** 2).mean()))
    best = bez0; bm, br = score(bez0, idx0)
    o0 = opt(bez0, idx0)
    m0, r0 = score(o0, idx0)
    if m0 <= max(bm, tol) and r0 < br:
        best, bm, br = o0, m0, r0
    if len(bez0) > 1:
        bez1, idx1 = _fit_greedy(p, t1, t2, tol * 1.6)
        if len(bez1) < len(bez0):
            o1 = opt(bez1, idx1)
            m1, r1 = score(o1, idx1)
            if m1 <= tol * 1.05 and r1 <= br * 1.15:
                best = o1
    return best


def _fit_greedy(p, t1, t2, tol):
    """Greedy longest-span cubic fitting with G1 joins (binary search on the span end)."""
    n = len(p)
    T = local_tangents(p)
    out = []
    i = 0
    ti = t1
    idx = [0]
    while i < n - 1:
        def attempt(j):
            tj = (-t2 if j == n - 1 else T[j])
            b, e = fit_one(p[i:j + 1], ti, -tj, tol)
            return b, e, tj
        b, e, tj = attempt(n - 1)
        if e <= tol:
            out.append(b); idx.append(n - 1); break
        lo, hi = i + 1, n - 1     # lo: known ok (2 points), hi: known bad
        best = attempt(lo)
        while hi - lo > 1:
            mid = (lo + hi) // 2
            r = attempt(mid)
            if r[1] <= tol:
                lo, best = mid, r
            else:
                hi = mid
        b, e, tj = best
        out.append(b)
        i = lo
        idx.append(lo)
        ti = tj
    return out, idx


OPTIMIZE = True


def is_line(p, tol):
    a, b = p[0], p[-1]
    d = b - a
    L = math.hypot(*d)
    if L < 1e-9:
        return False
    dev = np.abs((p[:, 0] - a[0]) * d[1] - (p[:, 1] - a[1]) * d[0]) / L
    return dev.max() <= tol


def trim_ends(p, r=1.2):
    """Drop interior points within r of either end (anti-aliasing chamfers corners)."""
    if len(p) <= 4:
        return p
    d0 = np.hypot(*(p - p[0]).T); d1 = np.hypot(*(p - p[-1]).T)
    keep = (d0 > r) & (d1 > r)
    keep[0] = keep[-1] = True
    q = p[keep]
    return q if len(q) >= 2 else p


def fit_open(p, tol, line_tol):
    """Fit an open polyline (between corners). Returns list of segments ('L', end) or ('C', c1, c2, end)."""
    if len(p) < 2:
        return []
    p = trim_ends(p)
    if len(p) == 2 or is_line(p, line_tol):
        return [('L', p[-1])]
    t1 = tangent_at(p, 0, 1); t2 = tangent_at(p, len(p) - 1, -1)
    segs = []
    for b in fit_cubic(p, t1, t2, tol):
        # degenerate cubic that is a straight line -> L
        d = b[3] - b[0]; L = math.hypot(*d)
        if L > 1e-9:
            dev = max(abs((b[1][0] - b[0][0]) * d[1] - (b[1][1] - b[0][1]) * d[0]),
                      abs((b[2][0] - b[0][0]) * d[1] - (b[2][1] - b[0][1]) * d[0])) / L
            if dev < line_tol * 0.5:
                segs.append(('L', b[3])); continue
        segs.append(('C', b[1], b[2], b[3]))
    return segs


def dp_simplify(p, tol):
    """Douglas-Peucker on an open polyline; returns kept indices."""
    keep = [0, len(p) - 1]
    stack = [(0, len(p) - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        d = p[b] - p[a]; L = math.hypot(*d)
        q = p[a + 1:b] - p[a]
        if L < 1e-9:
            dev = np.hypot(*q.T)
        else:
            dev = np.abs(q[:, 0] * d[1] - q[:, 1] * d[0]) / L
        k = int(np.argmax(dev))
        if dev[k] > tol:
            m = a + 1 + k
            keep.append(m)
            stack.append((a, m)); stack.append((m, b))
    return sorted(keep)


def line_runs(p, tol, Lmin=7.0, corner_ends=(True, True), Lfree=20.0):
    """Maximal straight runs [a, b] (indices) of an open polyline.  A run must be >= Lfree long
    unless it ends at a corner (then >= Lmin)."""
    n = len(p)
    if n < 4:
        return []
    # points close to the piece ends (corners) are chamfered by anti-aliasing: do not judge them
    d0 = np.hypot(*(p - p[0]).T); d1 = np.hypot(*(p - p[-1]).T)
    judge = (d0 > 2.5) & (d1 > 2.5)
    idx = dp_simplify(np.vstack([p[:1], p[judge], p[-1:]]) if judge.sum() >= 2 else p, tol)
    jidx = np.concatenate([[0], np.nonzero(judge)[0], [n - 1]]) if judge.sum() >= 2 else np.arange(n)
    idx = sorted(set(int(jidx[i]) for i in idx))
    runs = []
    cum = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])
    for a, b in zip(idx[:-1], idx[1:]):
        if cum[b] - cum[a] < Lmin or b - a < 4:
            continue
        sl = np.arange(a, b + 1)
        sj = sl[judge[sl]]
        if len(sj) < 3:
            continue
        c, d = line_fit(p[sj])
        sdev = (p[sj, 0] - c[0]) * d[1] - (p[sj, 1] - c[1]) * d[0]
        dev = np.abs(sdev)
        if dev.max() > tol * 1.2:
            continue
        if curved(p[sj], c, d, sdev):
            continue
        # extend while points stay on the line
        def off(k):
            return abs((p[k, 0] - c[0]) * d[1] - (p[k, 1] - c[1]) * d[0])
        lo = runs[-1][1] if runs else 0
        while a - 1 >= lo and (off(a - 1) <= tol * 0.6 or not judge[a - 1]):
            a -= 1
        while b + 1 < n and (off(b + 1) <= tol * 0.6 or not judge[b + 1]):
            b += 1
        if runs and a <= runs[-1][1]:
            # overlapping/adjacent with previous run: merge if collinear
            pa, pb = runs[-1]
            sl2 = np.arange(pa, b + 1); sl2 = sl2[judge[sl2]]
            c2, d2 = line_fit(p[sl2])
            sd2 = (p[sl2, 0] - c2[0]) * d2[1] - (p[sl2, 1] - c2[1]) * d2[0]
            if np.abs(sd2).max() <= tol * 1.2 and not curved(p[sl2], c2, d2, sd2):
                runs[-1] = [pa, b]; continue
            a = runs[-1][1]
            if b - a < 4:
                continue
        sl3 = np.arange(a, b + 1); sl3 = sl3[judge[sl3]]
        if len(sl3) >= 3:
            c3, d3 = line_fit(p[sl3])
            sd3 = (p[sl3, 0] - c3[0]) * d3[1] - (p[sl3, 1] - c3[1]) * d3[0]
            if curved(p[sl3], c3, d3, sd3):
                continue
        runs.append([a, b])
    runs = [[a, b] for a, b in runs
            if cum[b] - cum[a] >= Lfree or ((a == 0 and corner_ends[0]) or (b == n - 1 and corner_ends[1]))]
    out = []
    for a, b in runs:
        sl = np.arange(a, b + 1); sj = sl[judge[sl]]
        if len(sj) < 2:
            sj = sl
        c, d = line_fit(p[sj])
        out.append((a, b, c, d))
    return out


def curved(P, c, d, sdev, sag_tol=0.045):
    """Does the (nearly straight) point run bend systematically? (quadratic sagitta test)"""
    if len(P) < 6:
        return False
    t = (P[:, 0] - c[0]) * d[0] + (P[:, 1] - c[1]) * d[1]
    L = t.max() - t.min()
    if L < 1e-6:
        return False
    tn = (t - t.min()) / L * 2 - 1
    A = np.stack([np.ones_like(tn), tn, tn * tn], 1)
    coef, *_ = np.linalg.lstsq(A, sdev, rcond=None)
    return abs(coef[2]) > sag_tol


def project(pt, c, d):
    return c + d * np.dot(pt - c, d)


def fit_piece(p, start_pt, end_pt, t_start, t_end, tol, line_tol, corner_start, corner_end, return_lines=False):
    """Fit an open piece: alternating curves and detected straight runs.
    t_start/t_end: known unit tangents (forward at start, backward at end) or None."""
    n = len(p)
    runs = line_runs(p, line_tol, corner_ends=(corner_start, corner_end))
    first_line = last_line = None
    if runs and runs[0][0] == 0:
        first_line = (runs[0][2], runs[0][3])
    if runs and runs[-1][1] == n - 1:
        last_line = (runs[-1][2], runs[-1][3])
    segs = []
    cur_i = 0
    cur_pt = start_pt
    cur_t = t_start
    cur_corner = corner_start
    for a, b, c, d in runs:
        if np.dot(p[b] - p[a], d) < 0:
            d = -d
        A = start_pt if a == 0 else project(p[a], c, d)
        B = end_pt if b == n - 1 else project(p[b], c, d)
        if a > cur_i:
            q = p[cur_i:a + 1].copy(); q[0] = cur_pt; q[-1] = A
            segs += fit_curve(q, cur_t, -d, tol, cur_corner, False)
        elif np.hypot(*(A - cur_pt)) > 0.05:
            segs.append(('L', A))
        segs.append(('L', B))
        cur_i, cur_pt, cur_t, cur_corner = b, B, d, False
    if cur_i < n - 1:
        q = p[cur_i:].copy(); q[0] = cur_pt; q[-1] = end_pt
        segs += fit_curve(q, cur_t, t_end, tol, cur_corner, corner_end, both_corners=(cur_i == 0 and corner_start and corner_end))
    if return_lines:
        return segs, first_line, last_line
    return segs


def fit_curve(q, t1, t2, tol, trim0, trim1, both_corners=False):
    if len(q) <= 2:
        if t1 is None or t2 is None:
            return [('L', q[-1])]
        d = math.hypot(*(q[-1] - q[0])) / 3
        return [('C', q[0] + t1 * d, q[-1] + t2 * d, q[-1])]
    if trim0 or trim1:
        d0 = np.hypot(*(q - q[0]).T); d1 = np.hypot(*(q - q[-1]).T)
        keep = np.ones(len(q), bool)
        if trim0: keep &= d0 > 1.2
        if trim1: keep &= d1 > 1.2
        keep[0] = keep[-1] = True
        if keep.sum() >= 2:
            q = q[keep]
    if len(q) == 2 or is_line(q, 0.22 if both_corners else tol * 0.8):
        return [('L', q[-1])]
    fix0, fix1 = t1 is not None, t2 is not None
    if t1 is None:
        t1 = tangent_at(q, 0, 1)
    if t2 is None:
        t2 = tangent_at(q, len(q) - 1, -1)
    out = []
    for b in fit_greedy(q, t1, t2, tol, fix0, fix1):
        d = b[3] - b[0]; L = math.hypot(*d)
        if L > 1e-9:
            dev = max(abs((b[1][0] - b[0][0]) * d[1] - (b[1][1] - b[0][1]) * d[0]),
                      abs((b[2][0] - b[0][0]) * d[1] - (b[2][1] - b[0][1]) * d[0])) / L
            if dev < tol * 0.4:
                out.append(('L', b[3])); continue
        out.append(('C', b[1], b[2], b[3]))
    return out


def flatten(start, segs, k=8):
    pts = [np.asarray(start, float)]
    cur = pts[0]
    for s in segs:
        if s[0] == 'L':
            pts.append(np.asarray(s[1], float))
        else:
            b = np.array([cur, s[1], s[2], s[3]])
            L = sum(math.hypot(*(b[i + 1] - b[i])) for i in range(3))
            kk = max(k, int(L / 1.5))
            pts += list(bez_pt(b, np.linspace(0, 1, kk + 1)[1:]))
        cur = pts[-1]
    return np.array(pts)


def seg_dist(q, P):
    """distance of each point q to closed polyline P"""
    A = P; B = np.roll(P, -1, 0)
    best = np.full(len(q), np.inf)
    for i in range(0, len(A), 256):
        a = A[i:i + 256][None]; b = B[i:i + 256][None]
        e = b - a; L2 = (e ** 2).sum(-1) + 1e-12
        t = np.clip(((q[:, None] - a) * e).sum(-1) / L2, 0, 1)
        d = np.hypot(*(q[:, None] - (a + t[..., None] * e)).transpose(2, 0, 1))
        best = np.minimum(best, d.min(1))
    return best


def fit_closed(p, tol=0.15, line_tol=0.16):
    """Closed contour -> (start point, segments), with a robust fallback."""
    try:
        st, segs = _fit_closed(p, tol, line_tol)
        ok = len(segs) >= 2
        if ok:
            P = flatten(st, segs)
            a0 = abs(poly_area(p)); a1 = abs(poly_area(P))
            ok = abs(a0 - a1) <= 0.03 * a0 + 2.0 and np.percentile(seg_dist(p, P), 98) < 0.6
    except Exception:
        ok = False
    if ok:
        return st, segs
    idx = dp_simplify(np.vstack([p, p[:1]]), 0.2)
    q = np.vstack([p, p[:1]])[idx]
    return q[0], [('L', v) for v in q[1:]]


def _fit_closed(p, tol=0.15, line_tol=0.16):
    """Closed contour -> (start point, segments)."""
    n = len(p)
    corners, ang = find_corners(p)
    seg = arclen(p)
    s = np.concatenate([[0], np.cumsum(seg)])
    total = s[-1]; s0 = s[:-1]
    if not corners:
        # rotate so the loop starts at the beginning of a straight run if any (else max curvature)
        i0 = int(np.argmax(ang))
        q = np.vstack([p[i0:], p[:i0]])
        runs = line_runs(np.vstack([q, q[:1]]), line_tol, corner_ends=(False, False))
        if runs:
            a = runs[0][0]
            # make sure the run does not wrap: start at its first point
            q = np.vstack([q[a:], q[:a]])
            qq = np.vstack([q, q[:1]])
            r2 = line_runs(qq, line_tol, corner_ends=(False, False))
            if r2 and r2[0][0] == 0:
                c, d = r2[0][2], r2[0][3]
                if np.dot(qq[r2[0][1]] - qq[0], d) < 0:
                    d = -d
                st = project(qq[0], c, d)
                qq[0] = st; qq[-1] = st
                # tangent at loop end = backward along the first line
                segs = fit_piece(qq, st, st, d, -d, tol, line_tol, False, False)
                return st, merge_lines(st, segs, line_tol)
        qq = np.vstack([q, q[:1]])
        a = qq[min(3, len(qq) - 1)] - qq[-1 - min(3, len(qq) - 2)]
        t = unit(a)
        segs = fit_piece(qq, qq[0], qq[0], t, -t, tol, line_tol, False, False)
        return qq[0], merge_lines(qq[0], segs, line_tol)
    cpos = {}
    k = len(corners)
    for ci, i in enumerate(corners):
        cpos[i] = refine_corner(p, i, s0, total, 2.5, corners[ci - 1], corners[(ci + 1) % k])
    pieces = []
    for ci in range(k):
        i = corners[ci]; j = corners[(ci + 1) % k]
        if j > i:
            idx = list(range(i, j + 1))
        else:
            idx = list(range(i, n)) + list(range(0, j + 1))
        q = p[idx].copy()
        q[0] = cpos[i]; q[-1] = cpos[j]
        pieces.append(fit_piece(q, cpos[i], cpos[j], None, None, tol, line_tol, True, True, return_lines=True))
    # corner positions from the robust straight edges meeting there
    for ci in range(k):
        segs_in, _, lin_in = pieces[ci - 1]
        segs_out, lin_out, _ = pieces[ci]
        c0 = cpos[corners[ci]]
        new = None
        if lin_in is not None and lin_out is not None:
            (c1, d1), (c2, d2) = lin_in, lin_out
            M = np.array([d1, -d2]).T
            if abs(np.linalg.det(M)) > 0.15:
                t = np.linalg.solve(M, c2 - c1)
                X = c1 + t[0] * d1
                if np.hypot(*(X - c0)) < 2.0:
                    new = X
        elif lin_in is not None:
            new = project(c0, *lin_in)
        elif lin_out is not None:
            new = project(c0, *lin_out)
        if new is not None and np.hypot(*(new - c0)) < 2.0:
            cpos[corners[ci]] = new
            if segs_in and segs_in[-1][0] == 'L':
                segs_in[-1] = ('L', new)
            elif segs_in:
                s_ = segs_in[-1]; segs_in[-1] = ('C', s_[1], s_[2] + (new - c0), new)
            if segs_out and segs_out[0][0] == 'C':
                s_ = segs_out[0]; segs_out[0] = ('C', s_[1] + (new - c0), s_[2], s_[3])
    start = cpos[corners[0]]
    segs = []
    for pc in pieces:
        segs += pc[0]
    return start, merge_lines(start, segs, line_tol)


def merge_lines(start, segs, tol):
    out = []
    cur = start
    run_start = None
    for sg in segs:
        if sg[0] == 'L' and out and out[-1][0] == 'L':
            a = out[-1][2]; b = sg[1]
            d = b - a; L = math.hypot(*d)
            pts = out[-1][3] + [out[-1][1]]
            if L > 1e-9:
                dev = max(abs((q[0] - a[0]) * d[1] - (q[1] - a[1]) * d[0]) / L for q in pts)
            else:
                dev = 0
            if dev <= tol * 0.6:
                out[-1] = ('L', b, a, pts)
                cur = b
                continue
        if sg[0] == 'L':
            out.append(('L', sg[1], cur, []))
        else:
            out.append(sg)
        cur = sg[-1]
    return [('L', o[1]) if o[0] == 'L' else o for o in out]


# ----------------------------------------------------------------------------- primitives
def fit_circle(p):
    x, y = p[:, 0], p[:, 1]
    A = np.stack([x, y, np.ones_like(x)], 1)
    bb = -(x * x + y * y)
    (D, E, F), *_ = np.linalg.lstsq(A, bb, rcond=None)
    cx, cy = -D / 2, -E / 2
    r2 = cx * cx + cy * cy - F
    if r2 <= 0:
        return None
    r = math.sqrt(r2)
    d = np.hypot(x - cx, y - cy) - r
    return (cx, cy, r), d


def fit_ellipse(p):
    x, y = p[:, 0], p[:, 1]
    mx, my = x.mean(), y.mean(); sc = max(x.std(), y.std(), 1e-6)
    X, Y = (x - mx) / sc, (y - my) / sc
    D = np.stack([X * X, X * Y, Y * Y, X, Y, np.ones_like(X)], 1)
    S = D.T @ D
    C = np.zeros((6, 6)); C[0, 2] = C[2, 0] = 2; C[1, 1] = -1
    try:
        S1, S2, S3 = S[:3, :3], S[:3, 3:], S[3:, 3:]
        T = -np.linalg.solve(S3, S2.T)
        M = S1 + S2 @ T
        M = np.array([M[2] / 2, -M[1], M[0] / 2])
        w, v = np.linalg.eig(M)
        v = np.real(v)
        cond = 4 * v[0] * v[2] - v[1] ** 2
        a1 = v[:, cond > 0]
        if a1.shape[1] == 0:
            return None
        a1 = a1[:, 0]
        coef = np.concatenate([a1, T @ a1])
    except Exception:
        return None
    a, b, c, d, e, f = coef
    den = b * b - 4 * a * c
    if den >= 0:
        return None
    x0 = (2 * c * d - b * e) / den; y0 = (2 * a * e - b * d) / den
    num = 2 * (a * e * e + c * d * d - b * d * e + den * f)
    s = math.sqrt((a - c) ** 2 + b * b)
    try:
        r1 = -math.sqrt(num * (a + c + s)) / den
        r2 = -math.sqrt(num * (a + c - s)) / den
    except ValueError:
        return None
    th = 0.5 * math.atan2(-b, c - a)
    # r1 is along angle th? verify by testing both assignments
    cx, cy = x0 * sc + mx, y0 * sc + my
    rx, ry = r1 * sc, r2 * sc
    best = None
    for (RX, RY, TH) in [(rx, ry, th), (ry, rx, th), (rx, ry, th + math.pi / 2)]:
        ct, st = math.cos(TH), math.sin(TH)
        u = (x - cx) * ct + (y - cy) * st; w_ = -(x - cx) * st + (y - cy) * ct
        rho = np.sqrt((u / RX) ** 2 + (w_ / RY) ** 2)
        dist = (rho - 1) * np.hypot(u, w_) / np.maximum(rho, 1e-9)
        sc_ = np.sqrt((dist ** 2).mean())
        if best is None or sc_ < best[0]:
            best = (sc_, (cx, cy, RX, RY, TH), dist)
    return best[1], best[2]


def rrect_sdf(p, x0, y0, x1, y1, r):
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    hw, hh = (x1 - x0) / 2, (y1 - y0) / 2
    qx = np.abs(p[:, 0] - cx) - (hw - r); qy = np.abs(p[:, 1] - cy) - (hh - r)
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r


def robust_sides(p):
    x0, y0 = p.min(0); x1, y1 = p.max(0)
    w, h = x1 - x0, y1 - y0
    my = (p[:, 1] > y0 + 0.25 * h) & (p[:, 1] < y1 - 0.25 * h)
    mx = (p[:, 0] > x0 + 0.25 * w) & (p[:, 0] < x1 - 0.25 * w)
    out = [x0, y0, x1, y1]
    for k, (sel, col, ref, lo) in enumerate([(my, 0, x0, True), (mx, 1, y0, True), (my, 0, x1, False), (mx, 1, y1, False)]):
        q = p[sel & (np.abs(p[:, col] - ref) < 1.0), col]
        if len(q) >= 3:
            out[k] = float(np.median(q))
    return out


def fit_rrect(p, robust=False):
    if robust:
        x0, y0, x1, y1 = robust_sides(p)
    else:
        x0, y0 = p.min(0); x1, y1 = p.max(0)
    rmax = min(x1 - x0, y1 - y0) / 2
    # edges from the straight parts: use median of points near each side
    def score(r):
        d = rrect_sdf(p, x0, y0, x1, y1, r)
        return np.sqrt((d ** 2).mean())
    lo, hi = 0.0, rmax
    g = (math.sqrt(5) - 1) / 2
    a_, b_ = hi - g * (hi - lo), lo + g * (hi - lo)
    fa, fb = score(a_), score(b_)
    for _ in range(40):
        if fa < fb:
            hi, b_, fb = b_, a_, fa; a_ = hi - g * (hi - lo); fa = score(a_)
        else:
            lo, a_, fa = a_, b_, fb; b_ = lo + g * (hi - lo); fb = score(b_)
    r = (lo + hi) / 2
    if score(0) <= score(r) + 1e-3:
        r = 0.0
    # refine sides as robust extremes: shift each side to minimise residual (points on straight parts)
    d = rrect_sdf(p, x0, y0, x1, y1, r)
    return (x0, y0, x1, y1, r), d


def recognise(p, maxtol=0.45, rmstol=0.1, robust=False):
    """Try to recognise a single closed contour as a primitive. Returns (kind, params) or None."""
    if len(p) < 6:
        return None
    ext = p.max(0) - p.min(0)
    if ext.min() < 0.8:
        return None
    best = None
    # rect / rounded rect (axis aligned)
    rr = fit_rrect(p, robust)
    if rr is not None:
        (x0, y0, x1, y1, r), d = rr
        e = np.sqrt((d ** 2).mean()); m = np.abs(d).max()
        if r < 1.6:   # sharp corners are chamfered by anti-aliasing / marching squares
            d0 = rrect_sdf(p, x0, y0, x1, y1, 0.0)
            e0 = np.sqrt((d0 ** 2).mean()); m0 = np.abs(d0).max()
            if e0 < rmstol and m0 < maxtol + 0.3:
                best = ('rect', (x0, y0, x1, y1, 0.0), e0)
        if best is None and e < rmstol and m < maxtol:
            best = ('rect', (x0, y0, x1, y1, r), e)
    c = fit_circle(p) if ext.min() >= 2.5 else None
    if c is not None:
        (cx, cy, r), d = c
        e = np.sqrt((d ** 2).mean()); m = np.abs(d).max()
        roundish = best is not None and best[1][4] >= 0.9 * min(best[1][2] - best[1][0], best[1][3] - best[1][1]) / 2
        if e < rmstol and m < maxtol and (best is None or e < best[2] * (1.3 if roundish else 0.8)):
            best = ('circle', (cx, cy, r), e)
    if ext.min() >= 2.5 and (best is None or best[0] == 'rect' and best[1][4] > 0):
        el = fit_ellipse(p)
        if el is not None:
            prm, d = el
            e = np.sqrt((d ** 2).mean()); m = np.abs(d).max()
            roundish = best is not None and best[0] == 'rect' and best[1][4] >= 0.9 * min(best[1][2] - best[1][0], best[1][3] - best[1][1]) / 2
            if e < rmstol and m < maxtol and (best is None or e < best[2] * (1.3 if roundish else 0.7)):
                best = ('ellipse', prm, e)
    return best


# ----------------------------------------------------------------------------- formatting
def fmtn(v, dec=1):
    s = f'{v:.{dec}f}'
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    if s in ('-0', ''):
        s = '0'
    if s.startswith('0.'):
        s = s[1:]
    elif s.startswith('-0.'):
        s = '-' + s[2:]
    return s


def join_nums(nums):
    out = ''
    for s in nums:
        if not out:
            out = s
        elif s.startswith('-') or (s.startswith('.') and ('.' in last and 'e' not in last)):
            out += s
        else:
            out += ' ' + s
        last = s
    return out


def snap(v, dec=2, eps=0.012):
    """Round to `dec` decimals but prefer a shorter representation when it is within eps."""
    v = np.asarray(v, float)
    out = np.round(v, dec)
    for d in range(dec - 1, -1, -1):
        r = np.round(v, d)
        out = np.where(np.abs(v - r) < eps, r, out)
    return out


def path_data(start, segs, dec=2, cdec=1, eps=0.012):
    """Relative path data for one closed subpath.  Vertices use `dec` decimals (shortened when
    exact enough), control points `cdec` decimals relative to the current point."""
    cur = snap(start, dec, eps)
    parts = ['M' + join_nums([fmtn(cur[0], dec), fmtn(cur[1], dec)])]
    prev_cmd = None
    last = ''
    n = len(segs)
    for k, sg in enumerate(segs):
        if sg[0] == 'L':
            e = snap(sg[1], dec, eps)
            if k == n - 1 and np.abs(e - snap(start, dec, eps)).max() < 1e-9:
                break  # closing line is implied by z
            d = np.round(e - cur, dec)
            if abs(d[1]) < 1e-9 and abs(d[0]) > 0:
                cmd, nums = 'h', [fmtn(d[0], dec)]
            elif abs(d[0]) < 1e-9 and abs(d[1]) > 0:
                cmd, nums = 'v', [fmtn(d[1], dec)]
            elif abs(d).max() < 1e-9:
                continue
            else:
                cmd, nums = 'l', [fmtn(d[0], dec), fmtn(d[1], dec)]
            cur = e
        else:
            e = snap(sg[3], dec, eps)
            c1 = np.round(np.asarray(sg[1]) - cur, cdec); c2 = np.round(np.asarray(sg[2]) - cur, cdec)
            de = np.round(e - cur, dec)
            nums = [fmtn(c1[0], cdec), fmtn(c1[1], cdec), fmtn(c2[0], cdec), fmtn(c2[1], cdec), fmtn(de[0], dec), fmtn(de[1], dec)]
            cmd = 'c'
            cur = e
        js = join_nums(nums)
        if cmd == prev_cmd:
            if js.startswith('-') or (js.startswith('.') and '.' in last):
                parts.append(js)
            else:
                parts.append(' ' + js)
        else:
            parts.append(cmd + js)
        prev_cmd = cmd
        last = nums[-1]
    return ''.join(parts) + 'z'


def circle_path(cx, cy, r, dec=1):
    f = lambda v: fmtn(v, dec)
    q = 10 ** dec
    d = round(2 * r * q) / q
    rr = d / 2 - 1.0 / q          # radius slightly short: renderer scales it to exactly d/2
    sx = round((cx - d / 2) * q) / q
    return (f'M{join_nums([f(sx), f(cy)])}a{join_nums([f(rr), f(rr), "0", "1", "0", f(d), "0"])}'
            f'a{join_nums([f(rr), f(rr), "0", "1", "0", f(-d), "0"])}z')


def ellipse_path(cx, cy, rx, ry, th, dec=1):
    f = lambda v: fmtn(v, dec)
    ct, st = math.cos(th), math.sin(th)
    sx, sy = cx - rx * ct, cy - rx * st
    dx, dy = 2 * rx * ct, 2 * rx * st
    rx, ry = rx * 0.995, ry * 0.995   # chord slightly too long -> renderer scales radii up exactly
    ang = fmtn(math.degrees(th), 1)
    return (f'M{join_nums([f(sx), f(sy)])}a{join_nums([f(rx), f(ry), ang, "1", "0", f(dx), f(dy)])}'
            f'a{join_nums([f(rx), f(ry), ang, "1", "0", f(-dx), f(-dy)])}z')


def rect_path(x0, y0, x1, y1, r, dec=1):
    f = lambda v: fmtn(v, dec)
    w, h = x1 - x0, y1 - y0
    if r <= 0:
        return f'M{join_nums([f(x0), f(y0)])}h{f(w)}v{f(h)}h{f(-w)}z'
    a = lambda dx, dy: 'a' + join_nums([f(r), f(r), '0', '0', '1', f(dx), f(dy)])
    return (f'M{join_nums([f(x0 + r), f(y0)])}h{f(w - 2 * r)}{a(r, r)}v{f(h - 2 * r)}{a(-r, r)}'
            f'h{f(-(w - 2 * r))}{a(-r, -r)}v{f(-(h - 2 * r))}{a(r, -r)}z')
