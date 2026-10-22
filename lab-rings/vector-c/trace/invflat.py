"""Inverse flattening: recover the Bezier segments whose uniform-t flattening produced the
polygonal contour seen in the pixels."""
import math
import numpy as np
import fit as FT


def bern(t):
    t = np.asarray(t, float)[:, None]
    mt = 1 - t
    return np.hstack([mt ** 3, 3 * mt * mt * t, 3 * mt * t * t, t ** 3])


def vertices(p, closed=True, tol=0.07, min_turn=0.35):
    """Polygon vertices of a contour (closed: p is the loop without repeat).  Returns V (M,2) with
    vertex k between chord k-1 and chord k, refined by intersecting LS lines of adjacent chords."""
    q = np.vstack([p, p[:1]]) if closed else p
    if closed:
        # start DP at the point farthest from the centroid (a likely vertex)
        k0 = int(np.argmax(np.hypot(*(p - p.mean(0)).T)))
        p2 = np.vstack([p[k0:], p[:k0]])
        q = np.vstack([p2, p2[:1]])
    idx = FT.dp_simplify(q, tol)
    # merge runs whose union is still a line
    runs = [[a, b] for a, b in zip(idx[:-1], idx[1:])]
    changed = True
    while changed and len(runs) > 2:
        changed = False
        out = [runs[0]]
        for r in runs[1:]:
            a, b = out[-1][0], r[1]
            seg = q[a:b + 1]
            c, d = FT.line_fit(seg)
            dev = np.abs((seg[:, 0] - c[0]) * d[1] - (seg[:, 1] - c[1]) * d[0])
            if dev.max() <= tol:
                out[-1] = [a, b]; changed = True
            else:
                out.append(r)
        runs = out
    lines = []
    for a, b in runs:
        seg = q[a:b + 1]
        # drop the end points (shared with the neighbours) when the run is long enough
        core = seg[1:-1] if len(seg) >= 5 else seg
        c, d = FT.line_fit(core)
        if np.dot(seg[-1] - seg[0], d) < 0:
            d = -d
        lines.append((c, d, a, b))
    n = len(lines)
    V = []
    rng = range(n) if closed else range(1, n)
    for k in rng:
        c1, d1, a1, b1 = lines[k - 1]; c2, d2, a2, b2 = lines[k]
        M = np.array([d1, -d2]).T
        det = np.linalg.det(M)
        guess = q[a2]
        if abs(det) > math.sin(math.radians(min_turn)):
            t = np.linalg.solve(M, c2 - c1)
            X = c1 + t[0] * d1
            if np.hypot(*(X - guess)) < 1.5:
                V.append(X); continue
        V.append(guess)
    if not closed:
        V = [FT.project(q[0], *lines[0][:2])] + V + [FT.project(q[-1], *lines[-1][:2])]
    return np.array(V)


def fit_uniform(V):
    """Cubic through V[0], V[-1] with V[k] at t=k/N; returns (bezier, max residual)."""
    N = len(V) - 1
    t = np.arange(N + 1) / N
    B = bern(t)
    rhs = V - B[:, [0]] * V[0] - B[:, [3]] * V[-1]
    A = B[:, 1:3]
    P, *_ = np.linalg.lstsq(A, rhs, rcond=None)
    b = np.array([V[0], P[0], P[1], V[-1]])
    res = np.hypot(*(B @ b - V).T)
    return b, float(res.max())


def collinear(V, tol):
    c, d = FT.line_fit(V)
    dev = np.abs((V[:, 0] - c[0]) * d[1] - (V[:, 1] - c[1]) * d[0])
    return dev.max() <= tol


def segment_chain(V, res_tol=0.09, maxN=64):
    """Shortest segmentation of vertex chain V into uniform-t cubics / lines (DP).
    Returns list of ('L', end) / ('C', c1, c2, end) and the fraction of chords validated."""
    M = len(V)
    INF = 1e9
    cost = np.full(M, INF); cost[0] = 0
    prev = [None] * M
    choice = [None] * M
    for j in range(1, M):
        for i in range(max(0, j - maxN), j):
            if cost[i] >= INF:
                continue
            N = j - i
            seg = V[i:j + 1]
            if N == 1:
                c, kind, data = 1.0, 'L', None
            elif collinear(seg, 0.06):
                c, kind, data = 1.0, 'L', None
            elif N >= 4:
                b, r = fit_uniform(seg)
                if r > res_tol:
                    continue
                c, kind, data = 1.0 + 0.001 * r, 'C', b
            else:
                continue
            if cost[i] + c < cost[j] - 1e-12:
                cost[j] = cost[i] + c; prev[j] = i; choice[j] = (kind, data)
    if cost[M - 1] >= INF:
        return None, 0.0
    segs = []
    j = M - 1
    good = 0
    while j > 0:
        i = prev[j]; kind, data = choice[j]
        if kind == 'L':
            segs.append(('L', V[j]))
            good += (j - i) if j - i > 1 else 0
        else:
            segs.append(('C', data[1], data[2], V[j]))
            good += j - i
        j = i
    return segs[::-1], good / max(M - 1, 1)
