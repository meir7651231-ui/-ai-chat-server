"""Geometry: primitive least-squares fits, signed distances, Bezier curve fitting, number formatting."""
import math
import numpy as np
from scipy.optimize import least_squares


# ----------------------------------------------------------------------------- formatting

def fmt(v, nd=2):
    s = f'{v:.{nd}f}'
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    if s in ('-0', ''):
        s = '0'
    if s.startswith('0.'):
        s = s[1:]
    elif s.startswith('-0.'):
        s = '-' + s[2:]
    return s


def hexcol(c):
    c = np.clip(np.round(np.asarray(c, float)), 0, 255).astype(int)
    h = '#%02x%02x%02x' % tuple(c)
    if h[1] == h[2] and h[3] == h[4] and h[5] == h[6]:
        h = '#' + h[1] + h[3] + h[5]
    return h


# vec-c: bit-exact C kernels (PathModel.project/solve, seg_dist, _stroke_res_jac) (native/vcfit.c); None -> pure Python
try:
    import sys as _sys, os as _os
    _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', 'native'))
    import vcfit as _VC
    if not _VC.ENABLED:
        _VC = None
except Exception:
    _VC = None


def _vc_same(name, r, ref, inputs=None):
    """vec-c check mode: C result vs Python original, bit for bit (NaN == NaN: the engine treats both alike).
    A mismatch is counted and logged before raising, since some callers swallow exceptions."""
    rs = r if isinstance(r, (tuple, list)) else (r,)
    fs = ref if isinstance(ref, (tuple, list)) else (ref,)
    ok = len(rs) == len(fs) and all(
        np.asarray(a).shape == np.asarray(b).shape and np.array_equal(a, b, equal_nan=True) for a, b in zip(rs, fs))
    if not ok:
        _VC.STATS['mismatch'] = _VC.STATS.get('mismatch', 0) + 1
        import sys as _s
        print(f'vcfit CHECK MISMATCH in {name}', file=_s.stderr, flush=True)
        dd = _os.environ.get('VEC_C_DUMP')
        if dd:   # inputs + both results, to reproduce the call outside the engine
            import pickle
            _os.makedirs(dd, exist_ok=True)
            with open(_os.path.join(dd, f'{name}_{_VC.STATS["mismatch"]}.pkl'), 'wb') as f:
                pickle.dump(dict(name=name, inputs=inputs, c=r, py=ref), f)
        raise AssertionError(f'vcfit.{name} differs from the Python original')


# ----------------------------------------------------------------------------- distances
def rot(P, th):
    c, s = math.cos(th), math.sin(th)
    return np.c_[c * P[:, 0] + s * P[:, 1], -s * P[:, 0] + c * P[:, 1]]


def sdf_rrect(P, cx, cy, hx, hy, r, th=0.0):
    q = rot(P - [cx, cy], th) if th else (P - [cx, cy])
    r = max(0.0, min(r, hx, hy))
    q = np.abs(q) - [hx - r, hy - r]
    outside = np.hypot(np.maximum(q[:, 0], 0), np.maximum(q[:, 1], 0))
    inside = np.minimum(np.maximum(q[:, 0], q[:, 1]), 0)
    return outside + inside - r


def sdf_ellipse_approx(P, cx, cy, a, b, th):
    q = rot(P - [cx, cy], th)
    rr = np.hypot(q[:, 0], q[:, 1])
    ps = np.arctan2(q[:, 1], q[:, 0])
    re = a * b / np.sqrt((b * np.cos(ps)) ** 2 + (a * np.sin(ps)) ** 2 + 1e-12)
    return rr - re


def seg_dist(P, A, B):
    """distance from points P (N,2) to segment AB."""
    if _VC is not None:
        r = _VC.seg_dist(P, A, B)
        if r is not None:
            if _VC.CHECK:
                ref = _seg_dist_py(P, A, B); _VC.STATS['checked'] += 1
                _vc_same('seg_dist', r, ref)
            return r
    return _seg_dist_py(P, A, B)


def _seg_dist_py(P, A, B):
    d = B - A
    L2 = float(d @ d)
    if L2 < 1e-12:
        return np.hypot(*(P - A).T)
    t = np.clip(((P - A) @ d) / L2, 0, 1)
    Q = A + t[:, None] * d
    return np.hypot(*(P - Q).T)


def polyline_dist(P, V, closed):
    n = len(V)
    segs = [(V[i], V[(i + 1) % n]) for i in range(n if closed else n - 1)]
    D = np.stack([seg_dist(P, a, b) for a, b in segs], 1)
    return D.min(1), D.argmin(1)


def poly_area(V):
    x, y = V[:, 0], V[:, 1]
    return 0.5 * float(np.dot(x, np.roll(y, -1)) - np.dot(np.roll(x, -1), y))


# ----------------------------------------------------------------------------- primitive fits
def _stats(res):
    a = np.abs(res)
    return float(np.sqrt(np.mean(a ** 2))), float(np.percentile(a, 95)), float(a.max())


def fit_circle(P, w=None):
    x, y = P[:, 0], P[:, 1]
    w = np.ones(len(P)) if w is None else w
    A = np.c_[2 * x, 2 * y, np.ones(len(x))] * w[:, None]
    b = (x * x + y * y) * w
    s = np.linalg.lstsq(A, b, rcond=None)[0]
    cx, cy = s[0], s[1]
    r = math.sqrt(max(s[2] + cx * cx + cy * cy, 1e-6))
    f = lambda p: (np.hypot(x - p[0], y - p[1]) - p[2]) * w
    o = least_squares(f, [cx, cy, r], loss='soft_l1', f_scale=0.3)
    cx, cy, r = o.x
    res = np.hypot(x - cx, y - cy) - r
    return dict(kind='circle', cx=cx, cy=cy, r=abs(r)), res


def fit_ellipse(P, w, init):
    cx, cy, a, b, th = init
    f = lambda p: sdf_ellipse_approx(P, p[0], p[1], abs(p[2]), abs(p[3]), p[4]) * w
    o = least_squares(f, [cx, cy, a, b, th], loss='soft_l1', f_scale=0.3)
    cx, cy, a, b, th = o.x
    a, b = abs(a), abs(b)
    if b > a:
        a, b, th = b, a, th + math.pi / 2
    th = (th + math.pi / 2) % math.pi - math.pi / 2
    res = sdf_ellipse_approx(P, cx, cy, a, b, th)
    return dict(kind='ellipse', cx=cx, cy=cy, rx=a, ry=b, th=th), res


def fit_rrect(P, w, init, rounded=True, rotated=False):
    cx, cy, hx, hy, r, th = init

    def unpack(p):
        q = list(p)
        cx, cy, hx, hy = q[:4]
        k = 4
        r = abs(q[k]) if rounded else 0.0
        k += 1 if rounded else 0
        th = q[k] if rotated else 0.0
        return cx, cy, abs(hx), abs(hy), r, th

    x0 = [cx, cy, hx, hy] + ([max(r, 0.5)] if rounded else []) + ([th] if rotated else [])
    f = lambda p: sdf_rrect(P, *unpack(p)) * w
    o = least_squares(f, x0, loss='soft_l1', f_scale=0.3)
    cx, cy, hx, hy, r, th = unpack(o.x)
    # clamp sides that drifted beyond the visible extent (occluded / unconstrained sides)
    Q = rot(P - [cx, cy], th) if th else (P - [cx, cy])
    lo = Q.min(0); hi = Q.max(0)
    x0, x1, y0, y1 = -hx, hx, -hy, hy
    if x0 < lo[0] - 0.3: x0 = lo[0]
    if x1 > hi[0] + 0.3: x1 = hi[0]
    if y0 < lo[1] - 0.3: y0 = lo[1]
    if y1 > hi[1] + 0.3: y1 = hi[1]
    c2 = np.array([(x0 + x1) / 2, (y0 + y1) / 2])
    if th:
        cs, sn = math.cos(th), math.sin(th)
        c2 = np.array([cs * c2[0] - sn * c2[1], sn * c2[0] + cs * c2[1]])
    cx, cy = cx + c2[0], cy + c2[1]
    hx, hy = (x1 - x0) / 2, (y1 - y0) / 2
    r = min(r, hx, hy)
    res = sdf_rrect(P, cx, cy, hx, hy, r, th)
    return dict(kind='rect', cx=cx, cy=cy, hx=hx, hy=hy, r=r, th=th), res


def refine_polygon(P, w, V, iters=4):
    """Refine polygon vertices: assign points to nearest edge, TLS line fit per edge, intersect."""
    V = np.array(V, float)
    n = len(V)
    for _ in range(iters):
        d, e = polyline_dist(P, V, True)
        lines = []
        ok = True
        for i in range(n):
            A, B = V[i], V[(i + 1) % n]
            m = (e == i)
            # drop points near the vertices (corners are rounded by antialiasing / joins)
            if m.sum() < 3:
                ok = False
                break
            Q = P[m]
            L = np.hypot(*(B - A))
            t = ((Q - A) @ (B - A)) / max(L * L, 1e-9) * L
            keep = (t > min(2.0, 0.2 * L)) & (t < L - min(2.0, 0.2 * L)) & (np.abs(d[m]) < 2.0)
            if keep.sum() < 2:
                keep = np.ones(len(Q), bool)
            Q = Q[keep]
            ww = w[m][keep]
            c = (Q * ww[:, None]).sum(0) / ww.sum()
            C = ((Q - c) * ww[:, None]).T @ (Q - c)
            ev, evec = np.linalg.eigh(C)
            dirv = evec[:, 1]
            lines.append((c, dirv))
        if not ok:
            break
        NV = []
        for i in range(n):
            (c1, d1), (c2, d2) = lines[i - 1], lines[i]
            M = np.array([d1, -d2]).T
            if abs(np.linalg.det(M)) < 1e-6:
                NV.append(V[i])
                continue
            t = np.linalg.solve(M, c2 - c1)
            NV.append(c1 + t[0] * d1)
        NV = np.array(NV)
        if np.abs(NV - V).max() > 20:
            break
        V = NV
    d, _ = polyline_dist(P, V, True)
    return V, d


def dp_simplify(pts, tol, closed):
    """Douglas-Peucker; for closed contours start at the two mutually farthest points."""
    pts = np.asarray(pts, float)
    if closed:
        n = len(pts)
        c = pts.mean(0)
        i0 = int(np.argmax(np.hypot(*(pts - c).T)))
        i1 = int(np.argmax(np.hypot(*(pts - pts[i0]).T)))
        a, b = sorted((i0, i1))
        if b - a < 2 or n - (b - a) < 2:
            return pts[[a]]
        p1 = _dp(pts[a:b + 1], tol)
        p2 = _dp(np.vstack([pts[b:], pts[:a + 1]]), tol)
        return np.vstack([p1[:-1], p2[:-1]])
    return _dp(pts, tol)


def _dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = np.zeros(len(pts), bool)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        d = seg_dist(pts[i + 1:j], pts[i], pts[j])
        k = int(np.argmax(d))
        if d[k] > tol:
            keep[i + 1 + k] = True
            stack += [(i, i + 1 + k), (i + 1 + k, j)]
    return pts[keep]


def remove_collinear(V, closed, ang_deg=8.0, min_len=0.0):
    V = list(map(np.asarray, V))
    changed = True
    while changed and len(V) > (3 if closed else 2):
        changed = False
        n = len(V)
        rng = range(n) if closed else range(1, n - 1)
        best = None
        for i in rng:
            a, b, c = V[i - 1], V[i], V[(i + 1) % n]
            v1, v2 = b - a, c - b
            l1, l2 = np.hypot(*v1), np.hypot(*v2)
            if l1 < 1e-9 or l2 < 1e-9:
                best = (0, i)
                break
            ang = abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1 @ v2)))
            if ang < ang_deg or min(l1, l2) < min_len:
                if best is None or ang < best[0]:
                    best = (ang, i)
        if best is not None:
            del V[best[1]]
            changed = True
    return np.array(V)


# ----------------------------------------------------------------------------- strokes
def _stroke_res_jac(P, VV, hw, closed):
    if _VC is not None:
        r = _VC.stroke_res_jac(P, VV, closed)
        if r is not None:
            if _VC.CHECK:
                ref = _stroke_res_jac_py(P, VV, hw, closed); _VC.STATS['checked'] += 1
                _vc_same('stroke_res_jac', r, ref)
            return r
    return _stroke_res_jac_py(P, VV, hw, closed)


def _stroke_res_jac_py(P, VV, hw, closed):
    n = len(VV)
    segs = [(i, (i + 1) % n) for i in range(n if closed else n - 1)]
    best_d = np.full(len(P), np.inf)
    best = np.zeros((len(P), 4))  # i, j, t, (unused)
    nx = np.zeros(len(P)); ny = np.zeros(len(P))
    for (i, j) in segs:
        A, B = VV[i], VV[j]
        d = B - A
        L2 = float(d @ d)
        t = np.clip(((P - A) @ d) / max(L2, 1e-12), 0, 1)
        Q = A + t[:, None] * d
        D = P - Q
        dist = np.hypot(D[:, 0], D[:, 1])
        m = dist < best_d
        best_d[m] = dist[m]
        best[m, 0] = i; best[m, 1] = j; best[m, 2] = t[m]
        nn = np.maximum(dist[m], 1e-9)
        nx[m] = D[m, 0] / nn; ny[m] = D[m, 1] / nn
    return best_d, best, nx, ny


def fit_stroke(P, w, V, hw, closed):
    """Fit centerline vertices + half width with a round-join/round-cap model: dist(p, line) == hw."""
    V = np.asarray(V, float)
    n = len(V)
    N = len(P)

    def f(p):
        VV = p[:-1].reshape(n, 2)
        d, _, _, _ = _stroke_res_jac(P, VV, p[-1], closed)
        return (d - p[-1]) * w

    def jac(p):
        VV = p[:-1].reshape(n, 2)
        d, b, nx, ny = _stroke_res_jac(P, VV, p[-1], closed)
        J = np.zeros((N, 2 * n + 1))
        i = b[:, 0].astype(int); j = b[:, 1].astype(int); t = b[:, 2]
        r = np.arange(N)
        J[r, 2 * i] += -(1 - t) * nx * w
        J[r, 2 * i + 1] += -(1 - t) * ny * w
        J[r, 2 * j] += -t * nx * w
        J[r, 2 * j + 1] += -t * ny * w
        J[:, -1] = -w
        return J

    o = least_squares(f, np.r_[V.ravel(), hw], jac=jac, loss='soft_l1', f_scale=0.3, max_nfev=200)
    VV = o.x[:-1].reshape(n, 2)
    hw = abs(o.x[-1])
    if not closed:  # ends must not run beyond the visible extent (round-cap model)
        for i, j in ((0, 1), (n - 1, n - 2)):
            dv = _unit(VV[i] - VV[j])
            e = float(((P - VV[i]) @ dv).max())
            if e < hw - 0.3:
                VV[i] = VV[i] - dv * (hw - e)
    d, _ = polyline_dist(P, VV, closed)
    return VV, hw, d - hw


# ----------------------------------------------------------------------------- Bezier fitting (Schneider)
def _bez(c, t):
    mt = 1 - t
    return ((mt ** 3)[:, None] * c[0] + (3 * mt * mt * t)[:, None] * c[1]
            + (3 * mt * t * t)[:, None] * c[2] + (t ** 3)[:, None] * c[3])


def _bez1(c, t):
    mt = 1 - t
    return 3 * ((mt * mt)[:, None] * (c[1] - c[0]) + (2 * mt * t)[:, None] * (c[2] - c[1]) + (t * t)[:, None] * (c[3] - c[2]))


def _bez2(c, t):
    mt = 1 - t
    return 6 * (mt[:, None] * (c[2] - 2 * c[1] + c[0]) + t[:, None] * (c[3] - 2 * c[2] + c[1]))


def _chord_u(d):
    s = np.r_[0, np.cumsum(np.hypot(*np.diff(d, axis=0).T))]
    return s / max(s[-1], 1e-9)


def _gen(d, u, t1, t2):
    p0, p3 = d[0], d[-1]
    A1 = t1[None, :] * (3 * (1 - u) ** 2 * u)[:, None]
    A2 = t2[None, :] * (3 * (1 - u) * u ** 2)[:, None]
    C00 = (A1 * A1).sum(); C01 = (A1 * A2).sum(); C11 = (A2 * A2).sum()
    base = _bez(np.array([p0, p0, p3, p3]), u)
    tmp = d - base
    X0 = (A1 * tmp).sum(); X1 = (A2 * tmp).sum()
    det = C00 * C11 - C01 * C01
    seg = float(np.hypot(*(p3 - p0)))
    if abs(det) > 1e-12:
        a1 = (X0 * C11 - X1 * C01) / det
        a2 = (C00 * X1 - C01 * X0) / det
    else:
        a1 = a2 = seg / 3
    if a1 < 1e-6 * seg or a2 < 1e-6 * seg or a1 > 3 * seg + 3 or a2 > 3 * seg + 3:
        a1 = a2 = seg / 3
    return np.array([p0, p0 + t1 * a1, p3 + t2 * a2, p3])


def _maxerr(d, c, u):
    e = np.hypot(*(_bez(c, u) - d).T)
    i = int(np.argmax(e))
    return e[i], i


def _reparam(d, c, u):
    q = _bez(c, u) - d
    q1 = _bez1(c, u); q2 = _bez2(c, u)
    num = (q * q1).sum(1)
    den = (q1 * q1).sum(1) + (q * q2).sum(1)
    nu = u - np.where(np.abs(den) > 1e-12, num / np.where(np.abs(den) > 1e-12, den, 1), 0)
    nu = np.clip(nu, 0, 1)
    nu[0], nu[-1] = 0, 1
    return np.maximum.accumulate(nu)


def _unit(v):
    n = np.hypot(*v)
    return v / n if n > 1e-12 else np.array([1.0, 0.0])


def _gen_free(d, u):
    p0, p3 = d[0], d[-1]
    b0 = (1 - u) ** 3; b1 = 3 * (1 - u) ** 2 * u; b2 = 3 * (1 - u) * u ** 2; b3 = u ** 3
    R = d - b0[:, None] * p0 - b3[:, None] * p3
    M = np.array([[b1 @ b1, b1 @ b2], [b1 @ b2, b2 @ b2]])
    if abs(np.linalg.det(M)) < 1e-12:
        return None
    X = np.linalg.solve(M, np.array([b1 @ R, b2 @ R]))
    return np.array([p0, X[0], X[1], p3])


def fit_free_cubic(d, err, iters=20):
    """Best single cubic with free inner control points (endpoints fixed)."""
    if len(d) < 4:
        return None
    u = _chord_u(d)
    c = None
    for _ in range(iters):
        c = _gen_free(d, u)
        if c is None:
            return None
        e, _ = _maxerr(d, c, u)
        if e < err:
            return c
        u = _reparam(d, c, u)
    return None


def fit_cubics(d, t1, t2, err, depth=0, free=False):
    """Return list of 4x2 control arrays approximating ordered points d."""
    if free and len(d) >= 4:
        c = fit_free_cubic(d, err)
        if c is not None:
            return [c]
    if len(d) <= 2:
        dist = np.hypot(*(d[-1] - d[0])) / 3
        return [np.array([d[0], d[0] + t1 * dist, d[-1] + t2 * dist, d[-1]])]
    u = _chord_u(d)
    c = _gen(d, u, t1, t2)
    e, si = _maxerr(d, c, u)
    if e < err:
        return [c]
    if e < err * 6:
        for _ in range(6):
            u = _reparam(d, c, u)
            c = _gen(d, u, t1, t2)
            e, si = _maxerr(d, c, u)
            if e < err:
                return [c]
    if depth > 12:
        return [c]
    si = min(max(si, 1), len(d) - 2)
    tc = _unit(d[si - 1] - d[si + 1]) if si + 1 < len(d) else _unit(d[si - 1] - d[si])
    return fit_cubics(d[:si + 1], t1, tc, err, depth + 1) + fit_cubics(d[si:], -tc, t2, err, depth + 1)


def resample_closed(pts, step=1.0):
    P = np.vstack([pts, pts[:1]])
    s = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    L = s[-1]
    n = max(int(round(L / step)), 8)
    ss = np.linspace(0, L, n, endpoint=False)
    return np.c_[np.interp(ss, s, P[:, 0]), np.interp(ss, s, P[:, 1])]


def find_corners(P, k=3, ang=45.0):
    n = len(P)
    if n < 2 * k + 3:
        return []
    a = P - np.roll(P, k, 0)
    b = np.roll(P, -k, 0) - P
    cr = a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0]
    dt = (a * b).sum(1)
    th = np.degrees(np.abs(np.arctan2(cr, dt)))
    cand = np.where(th > ang)[0]
    corners = []
    for i in cand:
        win = [(i + j) % n for j in range(-k, k + 1)]
        if th[i] >= th[win].max() - 1e-9:
            if not corners or (i - corners[-1]) > k:
                corners.append(int(i))
    if len(corners) >= 2 and (corners[0] + n - corners[-1]) <= k:
        corners.pop()
    return corners


def _tls_line(Q):
    c = Q.mean(0)
    C = (Q - c).T @ (Q - c)
    ev, evec = np.linalg.eigh(C)
    d = evec[:, 1]
    res = np.abs((Q - c) @ evec[:, 0])
    return c, d, float(np.sqrt((res ** 2).mean())) if len(Q) else 9.0


def _intersect(c1, d1, c2, d2):
    M = np.array([d1, -d2]).T
    if abs(np.linalg.det(M)) < 1e-6:
        return None
    t = np.linalg.solve(M, c2 - c1)
    return c1 + t[0] * d1


def displace_curved(P, bias, corners, step):
    """Move points on curved stretches away from their centre of curvature by up to `bias` px.  Compensates the
    renderer's chord flattening of curves (rendered curves are pulled toward their centre of curvature).  Curvature
    is measured per corner-to-corner piece on a smoothed copy, so straight sides next to corners stay put."""
    from scipy.ndimage import gaussian_filter1d
    n = len(P)
    k = int(round(5 / step))
    sig = 2.5 / step
    thr = 25.0 / 1500.0
    out = P.copy()
    if corners:
        cs = sorted(corners)
        pieces = [[(cs[i] + j) % n for j in range(((cs[(i + 1) % len(cs)] - cs[i]) % n) or n)] for i in range(len(cs))]
        cyclic = False
    else:
        pieces = [list(range(n))]
        cyclic = True
    for idx in pieces:
        Q = P[idx]
        m = len(Q)
        if cyclic:
            S = np.c_[gaussian_filter1d(Q[:, 0], sig, mode='wrap'), gaussian_filter1d(Q[:, 1], sig, mode='wrap')]
            sec = np.roll(S, k, 0) + np.roll(S, -k, 0) - 2 * S
            sec = np.c_[gaussian_filter1d(sec[:, 0], sig, mode='wrap'), gaussian_filter1d(sec[:, 1], sig, mode='wrap')]
        else:
            kk = min(k, (m - 1) // 2)
            if kk < 3:
                continue
            S = np.c_[gaussian_filter1d(Q[:, 0], min(sig, kk / 2), mode='nearest'),
                      gaussian_filter1d(Q[:, 1], min(sig, kk / 2), mode='nearest')]
            sec = np.zeros_like(S)
            sec[kk:m - kk] = S[:m - 2 * kk] + S[2 * kk:] - 2 * S[kk:m - kk]
            sec[:kk] = sec[kk]
            sec[m - kk:] = sec[m - kk - 1]
            sec = np.c_[gaussian_filter1d(sec[:, 0], min(sig, kk / 2), mode='nearest'),
                        gaussian_filter1d(sec[:, 1], min(sig, kk / 2), mode='nearest')]
        mag = np.hypot(sec[:, 0], sec[:, 1])
        wgt = np.clip(mag / (2 * thr), 0, 1)
        out[idx] = Q - (bias * wgt / np.maximum(mag, 1e-12))[:, None] * sec
    return out


_FCC_CACHE = {}


def fit_closed_contour(pts, err=0.3, line_tol=0.25, step=0.5, bias=0.0, refine=True):
    """vec-c: memoized (the verify stage refits identical contours with identical parameters many times);
    returns a deep copy of the cached result, so the outputs are exactly those of a fresh fit."""
    import copy
    a = np.asarray(pts)
    key = (a.dtype.str, a.shape, a.tobytes(), float(err), float(line_tol), float(step), float(bias), bool(refine))
    r = _FCC_CACHE.get(key)
    if r is None:
        r = _fit_closed_contour(pts, err=err, line_tol=line_tol, step=step, bias=bias, refine=refine)
        if len(_FCC_CACHE) > 4096:
            _FCC_CACHE.clear()
        _FCC_CACHE[key] = copy.deepcopy(r)
        return r
    return copy.deepcopy(r)


def _fit_closed_contour(pts, err=0.3, line_tol=0.25, step=0.5, bias=0.0, refine=True):
    """Closed contour -> list of segments ('L', p0, p1) / ('C', ctrl4x2). Corners are refined as intersections of
    the tangent lines fitted just outside the anti-aliasing-rounded corner region; then Schneider cubic fitting."""
    P = resample_closed(pts, step)
    n = len(P)
    ext = P.max(0) - P.min(0)
    sc = float(np.clip(min(ext) / 40.0, 0.5, 1.0))   # small shapes (glyphs) need finer corner scales
    if sc < 1.0:
        err = err * 0.7                              # ... and a tighter tolerance (every 0.1 px shows)
    k = max(2, int(round(3 * sc / step)))
    corners = find_corners(P, k=k, ang=40.0)
    if bias:
        P = displace_curved(P, bias, corners, step)
    corner_r = 1.6 * sc
    near = max(1, int(round(1.5 * sc / step))); far = max(near + 2, int(round(4.5 * sc / step)))
    cinfo = []
    for c in corners:
        A = P[[(c - j) % n for j in range(near, far)]]
        B = P[[(c + j) % n for j in range(near, far)]]
        c1, d1, r1 = _tls_line(A)
        c2, d2, r2 = _tls_line(B)
        # orient: d_in points toward the corner, d_out away from it
        if (P[c] - c1) @ d1 < 0:
            d1 = -d1
        if (c2 - P[c]) @ d2 < 0:
            d2 = -d2
        q = None
        if r1 < 0.2 and r2 < 0.2:
            q = _intersect(c1, d1, c2, d2)
            if q is not None and np.hypot(*(q - P[c])) > 2.5:
                q = None
        if q is None:
            q = P[c]
            d1 = _unit(P[c] - P[(c - near * 2) % n]); d2 = _unit(P[(c + near * 2) % n] - P[c])
        cinfo.append((c, q, d1, d2))
    smooth = False
    if len(cinfo) == 0:
        smooth = True
        idx = [0, n // 4, n // 2, (3 * n) // 4]
        cinfo = []
        for c in idx:
            t = _unit(P[(c + 2) % n] - P[(c - 2) % n])
            cinfo.append((c, P[c], t, t))
    elif len(cinfo) == 1:
        c0 = cinfo[0][0]
        for c in [(c0 + n // 3) % n, (c0 + (2 * n) // 3) % n]:
            t = _unit(P[(c + 2) % n] - P[(c - 2) % n])
            cinfo.append((c, P[c], t, t))
        cinfo.sort(key=lambda x: x[0])
    segs = []
    flags = []
    m = len(cinfo)
    for ci in range(m):
        a, qa, _, ta = cinfo[ci]
        b, qb, tb, _ = cinfo[(ci + 1) % m]
        L = (b - a) % n
        if L == 0:
            L = n
        trim = 0 if smooth else int(round(2.5 * sc / step))
        inner = [P[(a + j) % n] for j in range(trim, L - trim + 1)] if L > 2 * trim else []
        d = np.array([qa] + inner[1:-1] + [qb]) if len(inner) > 2 else np.array([qa, qb])
        n0 = len(segs)
        if len(d) <= 2 or seg_dist(d, qa, qb).max() <= line_tol:
            segs.append(('L', qa, qb))
        else:
            segs.extend(_fit_mixed(d, ta, -tb, err, step, free=not smooth and len(corners) >= 2, sc=sc))
        flags += [not smooth and len(corners) >= 1 and (len(corners) >= 2 or ci == 0)] + [False] * (len(segs) - n0 - 1)
    if refine and len(segs) >= 1:
        cpts = [ci[1] for ci in cinfo] if not smooth else []
        try:
            segs = refine_path(P, segs, flags, cpts, err=err, corner_r=corner_r)
        except Exception:
            pass
        if smooth:
            try:
                segs = smooth_k_search(P, segs, err)
            except Exception:
                pass
    return segs


def _init_k(D, K, phase):
    n = len(D)
    idx = [int(round(phase + k * n / K)) % n for k in range(K)]
    segs = []
    for k in range(K):
        a, b = idx[k], idx[(k + 1) % K]
        L = (b - a) % n or n
        d = D[[(a + j) % n for j in range(L + 1)]]
        u = _chord_u(d)
        c = None
        for _ in range(10):
            c = _gen_free(d, u)
            if c is None:
                return None
            u = _reparam(d, c, u)
        segs.append(('C', c))
    return segs


def smooth_k_search(D, ref_segs, err, kmax=None):
    """Corner-free closed curve: find the fewest cubic segments (joints placed by least squares, several phases)
    that fit as well as the fine reference fit."""
    w = np.ones(len(D))
    R = PathModel(ref_segs, [False] * len(ref_segs))
    _, _, dref = R.project(D)
    rms_ref = float(np.sqrt((dref ** 2).mean()))
    tol_rms = max(0.065, 1.15 * rms_ref)
    kmax = kmax or len(ref_segs) - 1
    for K in range(2, kmax + 1):
        best = None
        for ph in np.linspace(0, len(D) / K, 6, endpoint=False):
            s0 = _init_k(D, K, ph)
            if s0 is None:
                continue
            M = PathModel(s0, [False] * K)
            d = M.fit(D, w, iters=15)
            r = float(np.sqrt((d ** 2).mean()))
            if best is None or r < best[0]:
                best = (r, float(d.max()), M)
        if best is not None and best[0] <= tol_rms and best[1] <= err * 1.2:
            M = best[2]
            for i in range(len(M.kinds)):   # quadratic where possible
                c = M.ctrl(i)
                N = PathModel([], [])
                N.kinds = list(M.kinds); N.kinds[i] = 'Q'
                N.nodes = M.nodes.copy(); N.corner = list(M.corner)
                N.inner = {j: v.copy() for j, v in M.inner.items()}
                N.inner[i] = ((3 * (c[1] + c[2]) - (c[0] + c[3])) / 4)[None]
                dn = N.fit(D, w, iters=8)
                if np.sqrt((dn ** 2).mean()) <= tol_rms and dn.max() <= err * 1.2:
                    M = N
            return M.segs()
    return ref_segs


def _straight_runs(d, step, min_len=12.0, tol=0.12):
    """Maximal runs of points that lie on a line (max deviation <= tol), length >= min_len px."""
    n = len(d)
    runs = []
    i = 0
    w = int(round(min_len / step))
    while i + w < n:
        if seg_dist(d[i:i + w + 1], d[i], d[i + w]).max() > tol:
            i += 1
            continue
        j = i + w
        while j + 1 < n and seg_dist(d[i:j + 2], d[i], d[j + 1]).max() <= tol:
            j += 1
        runs.append((i, j))
        i = j + 1
    return runs


def _fit_mixed(d, t1, t2, err, step, free=False, sc=1.0):
    pure = [('C', c) for c in fit_cubics(d, t1, t2, err, free=free)]
    runs = _straight_runs(d, step, min_len=12.0 * sc)
    if not runs:
        return pure
    mixed = _fit_runs(d, t1, t2, err, runs)
    return mixed if len(mixed) <= len(pure) else pure


def _fit_runs(d, t1, t2, err, runs):
    out = []
    pos = 0
    cur_t = t1
    d = d.copy()
    for (i, j) in runs:
        c0, dl, _ = _tls_line(d[i:j + 1])
        if (d[j] - d[i]) @ dl < 0:
            dl = -dl
        if i > 0:
            d[i] = c0 + ((d[i] - c0) @ dl) * dl
        if j < len(d) - 1:
            d[j] = c0 + ((d[j] - c0) @ dl) * dl
        if i > pos:
            out += [('C', c) for c in fit_cubics(d[pos:i + 1], cur_t, -dl, err)]
        out.append(('L', d[i], d[j]))
        cur_t = dl
        pos = j
    if pos < len(d) - 1:
        out += [('C', c) for c in fit_cubics(d[pos:], cur_t, t2, err)]
    return out


def segs_to_d(segs, nd=1):
    """Path data with absolute M then relative commands, computed from rounded absolute coords (no drift)."""
    if not segs:
        return ''
    q = 10 ** nd
    R = lambda p: (round(p[0] * q) / q, round(p[1] * q) / q)
    start = R(segs[0][1] if segs[0][0] == 'L' else segs[0][1][0])
    out = ['M' + fmt(start[0], nd) + ' ' + fmt(start[1], nd)]
    cur = start
    last = None
    for s in segs:
        if s[0] == 'L':
            p = R(s[2])
            dx, dy = p[0] - cur[0], p[1] - cur[1]
            if abs(dx) < 1e-9 and abs(dy) < 1e-9:
                continue
            if abs(dy) < 1e-9:
                tok = 'h' + fmt(dx, nd); cmd = 'h'
            elif abs(dx) < 1e-9:
                tok = 'v' + fmt(dy, nd); cmd = 'v'
            else:
                tok = 'l' + _pair(dx, dy, nd); cmd = 'l'
            out.append(tok if last != cmd else _strip_cmd(tok))
            last = cmd
            cur = p
        elif s[0] == 'Q':
            c = s[1]
            p1, p2 = R(c[1]), R(c[2])
            vals = [p1[0] - cur[0], p1[1] - cur[1], p2[0] - cur[0], p2[1] - cur[1]]
            tok = 'q' + _nums(vals, nd)
            out.append(tok if last != 'q' else _strip_cmd(tok))
            last = 'q'
            cur = p2
        else:
            c = s[1]
            p1, p2, p3 = R(c[1]), R(c[2]), R(c[3])
            vals = [p1[0] - cur[0], p1[1] - cur[1], p2[0] - cur[0], p2[1] - cur[1], p3[0] - cur[0], p3[1] - cur[1]]
            tok = 'c' + _nums(vals, nd)
            out.append(tok if last != 'c' else _strip_cmd(tok))
            last = 'c'
            cur = p3
    out.append('z')
    return _join(out)


def _strip_cmd(tok):
    body = tok[1:]
    return body if body.startswith('-') else ' ' + body


def _pair(a, b, nd):
    return _nums([a, b], nd)


def _nums(vals, nd):
    s = ''
    for i, v in enumerate(vals):
        t = fmt(v, nd)
        if i == 0 or t.startswith('-') or (t.startswith('.') and '.' in s.split(' ')[-1].split('-')[-1]):
            s += t
        else:
            s += ' ' + t
    return s


def _join(tokens):
    return ''.join(tokens)


def _trim_rms(res, w):
    a = np.abs(res[w >= 0.5])
    if len(a) == 0:
        return 99.0
    a = np.sort(a)[:max(1, int(0.92 * len(a)))]
    return float(np.sqrt(np.mean(a ** 2)))


def simplify_stroke(P, w, V, hw, closed, max_pts=700):
    """Fit, then greedily drop vertices while the (trimmed) residual does not get noticeably worse."""
    if len(P) > max_pts:
        idx = np.linspace(0, len(P) - 1, max_pts).astype(int)
        Ps, ws = P[idx], w[idx]
    else:
        Ps, ws = P, w
    VV, hw, res = fit_stroke(Ps, ws, V, hw, closed)
    base = _trim_rms(res, ws)
    while len(VV) > (3 if closed else 2):
        best = None
        rng = range(len(VV)) if closed else range(1, len(VV) - 1)
        for i in rng:
            V2 = np.delete(VV, i, 0)
            try:
                V3, hw3, res3 = fit_stroke(Ps, ws, V2, hw, closed)
            except Exception:
                continue
            e = _trim_rms(res3, ws)
            if best is None or e < best[0]:
                best = (e, V3, hw3)
        if best is not None and best[0] <= base * 1.15 + 0.03:
            _, VV, hw = best
            base = min(base, best[0])
        else:
            break
    VV, hw, res = fit_stroke(P, w, VV, hw, closed)
    return VV, hw, res


# ----------------------------------------------------------------------------- global path refinement

def _basis(kind, t):
    if kind == 'L':
        return np.c_[1 - t, t]
    if kind == 'Q':
        return np.c_[(1 - t) ** 2, 2 * (1 - t) * t, t * t]
    mt = 1 - t
    return np.c_[mt ** 3, 3 * mt * mt * t, 3 * mt * t * t, t ** 3]


SPARSE_NV = int(_os.environ.get('VEC_SPARSE_NV', '96')) if _VC is not None else 10 ** 9


class PathModel:
    """Closed path of line / cubic segments: node[i] starts segment i; cubic segments own two inner points."""

    def __init__(self, segs, corner_flags):
        self.kinds = [s[0] for s in segs]
        self.nodes = np.array([(s[1] if s[0] == 'L' else s[1][0]) for s in segs], float)
        self.inner = {i: np.array(s[1][1:-1], float) for i, s in enumerate(segs) if s[0] in 'CQ'}
        self.corner = list(corner_flags)

    def ctrl(self, i):
        m = len(self.kinds)
        a, b = self.nodes[i], self.nodes[(i + 1) % m]
        if self.kinds[i] == 'L':
            return np.array([a, b])
        c = self.inner[i]
        return np.vstack([a, c, b])

    def segs(self):
        out = []
        for i, k in enumerate(self.kinds):
            c = self.ctrl(i)
            out.append(('L', c[0], c[1]) if k == 'L' else (k, c))
        return out

    def sample(self, ns=48):
        pts, sid, tt = [], [], []
        for i, k in enumerate(self.kinds):
            c = self.ctrl(i)
            L = float(np.hypot(*np.diff(c, axis=0).T).sum())
            n = int(max(ns, min(2000, 2 * L)))
            t = np.linspace(0, 1, n)[1:]   # exclude t=0 (shared node belongs to the previous segment's t=1)
            pts.append(_basis(k, t) @ c); sid.append(np.full(len(t), i)); tt.append(t)
        return np.vstack(pts), np.concatenate(sid), np.concatenate(tt)

    def project(self, D):
        if _VC is not None:
            r = _VC.pm_project(self.kinds, self.nodes, self.inner, D)
            if r is not None:
                if _VC.CHECK:
                    ref = self._project_py(D)
                    _VC.STATS['checked'] += 1
                    _vc_same('pm_project', r, ref, (list(self.kinds), np.array(self.nodes),
                                                    {i: np.array(v) for i, v in self.inner.items()}, np.array(D)))
                return r
        return self._project_py(D)

    def _project_py(self, D):
        from scipy.spatial import cKDTree
        S, sid, tt = self.sample()
        _, j = cKDTree(S).query(D)
        seg = sid[j]; t = tt[j].copy()
        for i in np.unique(seg):
            m = seg == i
            c = self.ctrl(i)
            if self.kinds[i] == 'Q':
                c = np.array([c[0], c[0] + 2 / 3 * (c[1] - c[0]), c[2] + 2 / 3 * (c[1] - c[2]), c[2]])
            if self.kinds[i] == 'L':
                d = c[1] - c[0]
                t[m] = np.clip(((D[m] - c[0]) @ d) / max(d @ d, 1e-12), 0, 1)
                continue
            tm = t[m]
            for _ in range(4):
                q = _bez(c, tm) - D[m]; q1 = _bez1(c, tm); q2 = _bez2(c, tm)
                num = (q * q1).sum(1); den = (q1 * q1).sum(1) + (q * q2).sum(1)
                tm = np.clip(tm - np.where(np.abs(den) > 1e-12, num / np.where(np.abs(den) > 1e-12, den, 1), 0), 0, 1)
            t[m] = tm
        Q = np.zeros_like(D)
        for i in np.unique(seg):
            m = seg == i
            Q[m] = _basis(self.kinds[i], t[m]) @ self.ctrl(i)
        return seg, t, np.hypot(*(Q - D).T)

    def solve(self, D, seg, t, w, lam=1e-3, anchors=None):
        m = len(self.kinds)
        var = {}
        nv = m
        for i in range(m):
            if self.kinds[i] == 'C':
                var[i] = (nv, nv + 1); nv += 2
            elif self.kinds[i] == 'Q':
                var[i] = (nv,); nv += 1
        if nv > SPARSE_NV and self._solve_sparse(D, seg, t, w, var, nv, m, lam, anchors):
            return
        A = None
        if _VC is not None:
            A = _VC.solve_A(self.kinds, var, nv, seg, t, w, len(D))
            if A is not None and _VC.CHECK:
                ref = self._solve_A_py(D, seg, t, w, var, nv)
                _VC.STATS['checked'] += 1
                _vc_same('solve_A', A, ref)
        if A is None:
            A = self._solve_A_py(D, seg, t, w, var, nv)
        self._solve_rest(D, A, w, var, nv, m, lam, anchors)

    def _solve_A_py(self, D, seg, t, w, var, nv):
        m = len(self.kinds)
        A = np.zeros((len(D) + nv, nv))
        for i in range(m):
            sel = np.where(seg == i)[0]
            if len(sel) == 0:
                continue
            B = _basis(self.kinds[i], t[sel]) * w[sel, None]
            j = (i + 1) % m
            if self.kinds[i] == 'L':
                A[sel, i] += B[:, 0]; A[sel, j] += B[:, 1]
            elif self.kinds[i] == 'Q':
                A[sel, i] += B[:, 0]; A[sel, var[i][0]] += B[:, 1]; A[sel, j] += B[:, 2]
            else:
                a1, a2 = var[i]
                A[sel, i] += B[:, 0]; A[sel, a1] += B[:, 1]; A[sel, a2] += B[:, 2]; A[sel, j] += B[:, 3]
        return A[:len(D)]

    def _solve_sparse(self, D, seg, t, w, var, nv, m, lam, anchors):
        """vec-c: large paths.  The normal matrix is sparse (each point touches <= 4 unknowns); the original dense
        A.T @ A (O(nd nv^2)) + LAPACK gesv (O(nv^3), multi-threaded, so its last bits already depend on the
        OpenBLAS thread count) is replaced by a banded envelope Cholesky in C (native/vcfit.c).  Same equations;
        the solution differs only in rounding.  Returns False to fall back to the dense path."""
        if _VC is None:
            return False
        cur = np.zeros((nv, 2))
        cur[:m] = self.nodes
        for i, vv in var.items():
            cur[list(vv)] = self.inner[i]
        reg = np.full(nv, lam)
        tgt = cur.copy()
        if anchors is not None:
            for i, p in anchors.items():
                if i < m:
                    reg[i] = 4.0; tgt[i] = p
        X = _VC.solve_sparse(self.kinds, var, nv, seg, t, w, D, reg, tgt)
        if X is None:
            return False
        self.nodes = X[:m]
        for i, vv in var.items():
            self.inner[i] = X[list(vv)]
        return True

    def _solve_rest(self, D, A, w, var, nv, m, lam, anchors):
        cur = np.zeros((nv, 2))
        cur[:m] = self.nodes
        for i, vv in var.items():
            cur[list(vv)] = self.inner[i]
        reg = np.full(nv, lam)
        tgt = cur.copy()
        if anchors is not None:
            for i, p in anchors.items():
                if i < m:
                    reg[i] = 4.0; tgt[i] = p
        N = A.T @ A + np.diag(reg ** 2)
        rhs = A.T @ (D * w[:, None]) + tgt * (reg ** 2)[:, None]
        try:
            X = np.linalg.solve(N, rhs)
        except np.linalg.LinAlgError:
            X = np.linalg.lstsq(N, rhs, rcond=None)[0]
        self.nodes = X[:m]
        for i, vv in var.items():
            self.inner[i] = X[list(vv)]

    def fit(self, D, w, iters=5, anchor_pts=None):
        anchors = None
        if anchor_pts is not None and len(anchor_pts):
            anchors = {}
            for i in range(len(self.kinds)):
                if self.corner[i]:
                    dd = np.hypot(*(np.asarray(anchor_pts) - self.nodes[i]).T)
                    if dd.min() < 1.0:
                        anchors[i] = np.asarray(anchor_pts)[int(dd.argmin())]
        for _ in range(iters):
            seg, t, d = self.project(D)
            self.solve(D, seg, t, w, anchors=anchors)
        seg, t, d = self.project(D)
        return d


def refine_path(D, segs, corner_flags, corner_pts, err=0.3, merge=True, corner_r=1.6):
    """Least-squares refinement of all control points against the contour points D, then greedy removal of smooth
    joints while the fit stays within tolerance (fewest segments)."""
    if len(segs) < 1:
        return segs
    w = np.ones(len(D))
    if len(corner_pts):
        dc = np.min(np.hypot(*(D[:, None, :] - np.asarray(corner_pts)[None]).transpose(2, 0, 1)), 1)
        w[dc < corner_r] = 0.05   # anti-aliasing rounds the corners; trust the tangent-line intersection instead
    M = PathModel(segs, corner_flags)
    d = M.fit(D, w, anchor_pts=corner_pts)
    ok_tol = lambda d: (d[w > 0.5].max() if (w > 0.5).any() else 0) <= err and np.sqrt((d[w > 0.5] ** 2).mean()) <= 0.08
    if not merge:
        return M.segs()
    changed = True
    while changed and len(M.kinds) > 1:
        changed = False
        m = len(M.kinds)
        order = [i for i in range(m) if not M.corner[i] and M.kinds[i] == 'C' and M.kinds[i - 1] == 'C' and m > 2]
        for i in order:
            # remove node i: merge segment i-1 and i into one cubic
            p = (i - 1) % m
            c0, c1 = M.ctrl(p), M.ctrl(i)
            N = PathModel([], [])
            kinds, nodes, corner, inner = [], [], [], {}
            for j in range(m):
                if j == i:
                    continue
                if j == p:
                    kinds.append('C'); nodes.append(M.nodes[p]); corner.append(M.corner[p])
                    inner[len(kinds) - 1] = np.array([c0[0] + 2 * (c0[1] - c0[0]), c1[3] + 2 * (c1[2] - c1[3])])
                else:
                    kinds.append(M.kinds[j]); nodes.append(M.nodes[j]); corner.append(M.corner[j])
                    if M.kinds[j] == 'C':
                        inner[len(kinds) - 1] = M.inner[j].copy()
            N.kinds, N.nodes, N.corner, N.inner = kinds, np.array(nodes), corner, inner
            dn = N.fit(D, w, iters=6, anchor_pts=corner_pts)
            if ok_tol(dn):
                M = N
                changed = True
                break
    # cubic -> quadratic where the data allow it (fewer parameters, usually what a designer drew)
    for i in range(len(M.kinds)):
        if M.kinds[i] != 'C':
            continue
        c = M.ctrl(i)
        N = PathModel([], [])
        N.kinds = list(M.kinds); N.kinds[i] = 'Q'
        N.nodes = M.nodes.copy(); N.corner = list(M.corner)
        N.inner = {j: v.copy() for j, v in M.inner.items()}
        N.inner[i] = ((3 * (c[1] + c[2]) - (c[0] + c[3])) / 4)[None]
        dn = N.fit(D, w, iters=6, anchor_pts=corner_pts)
        if ok_tol(dn):
            M = N
    return M.segs()
