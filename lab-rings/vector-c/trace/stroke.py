"""Stroke recognition: a region of (nearly) constant width becomes a stroked centre line.

Closed rings (outer + inner contour) -> centre line = inner contour offset by w/2.
Open strokes (one contour)          -> centre line from the pruned skeleton, refined to sub-pixel
                                       by casting normals to the 0.5 coverage crossings.
Join / cap / width are chosen by rendering candidates with the real renderer and comparing their
coverage with the traced coverage field.  The stroke replaces the filled outline only if it
reproduces the pixels at least as well.
"""
import math
import numpy as np
from scipy import ndimage as ndi
from skimage.morphology import skeletonize
import fit as FT
import calib
DEBUG = False


def bilinear(F, x, y):
    """F sampled at continuous window coords (pixel centres at i+0.5)."""
    h, w = F.shape
    fx = np.asarray(x) - 0.5; fy = np.asarray(y) - 0.5
    x0 = np.floor(fx).astype(int); y0 = np.floor(fy).astype(int)
    ax = fx - x0; ay = fy - y0
    def g(yy, xx):
        ok = (yy >= 0) & (yy < h) & (xx >= 0) & (xx < w)
        return np.where(ok, F[np.clip(yy, 0, h - 1), np.clip(xx, 0, w - 1)], 0.0)
    return ((1 - ax) * (1 - ay) * g(y0, x0) + ax * (1 - ay) * g(y0, x0 + 1) +
            (1 - ax) * ay * g(y0 + 1, x0) + ax * ay * g(y0 + 1, x0 + 1))


def crossing(F, p, d, maxd, step=0.25):
    """Distance along direction d from p to where F drops below 0.5 (sub-pixel)."""
    ts = np.arange(0, maxd, step)
    v = bilinear(F, p[0] + d[0] * ts, p[1] + d[1] * ts)
    below = np.nonzero(v < 0.5)[0]
    if len(below) == 0 or below[0] == 0:
        return None
    k = below[0]
    t0, t1 = ts[k - 1], ts[k]; v0, v1 = v[k - 1], v[k]
    return t0 + (v0 - 0.5) / max(v0 - v1, 1e-9) * (t1 - t0)


def skeleton_chain(mask, w):
    sk = skeletonize(mask)
    K = np.ones((3, 3)); K[1, 1] = 0
    for _ in range(4):
        nb = ndi.convolve(sk.astype(int), K, mode='constant') * sk
        ends = list(zip(*np.nonzero(sk & (nb == 1))))
        changed = False
        for e in ends:
            # walk to junction
            path = [e]; prev = None; cur = e
            while True:
                y, x = cur
                nbrs = [(y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                        if (dy or dx) and 0 <= y + dy < sk.shape[0] and 0 <= x + dx < sk.shape[1] and sk[y + dy, x + dx]]
                nbrs = [q for q in nbrs if q != prev and q not in path]
                if len(nbrs) != 1:
                    break
                prev, cur = cur, nbrs[0]
                if nb[cur] >= 3:
                    break
                path.append(cur)
            if nb[cur] >= 3 and len(path) < max(3, 0.9 * w):
                for q in path:
                    sk[q] = False
                changed = True
        if not changed:
            break
    nb = ndi.convolve(sk.astype(int), K, mode='constant') * sk
    ends = list(zip(*np.nonzero(sk & (nb == 1))))
    if len(ends) != 2:
        return None
    # shortest 8-connected path between the two ends (robust to small skeleton clumps)
    from collections import deque
    prev = {ends[0]: None}
    dq = deque([ends[0]])
    H, W = sk.shape
    while dq:
        cur = dq.popleft()
        if cur == ends[1]:
            break
        y, x = cur
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                q = (y + dy, x + dx)
                if (dy or dx) and 0 <= q[0] < H and 0 <= q[1] < W and sk[q] and q not in prev:
                    prev[q] = cur; dq.append(q)
    if ends[1] not in prev:
        return None
    chain = []
    cur = ends[1]
    while cur is not None:
        chain.append(cur); cur = prev[cur]
    chain = chain[::-1]
    # the skeleton must be essentially this single path (no long side branches left)
    if sk.sum() > len(chain) * 1.08 + 4:
        return None
    return np.array([(x + 0.5, y + 0.5) for y, x in chain], float)


def open_corners(p, theta=40.0, L=4.0):
    n = len(p)
    s = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])
    out = []
    ang = np.zeros(n)
    for i in range(n):
        a = np.searchsorted(s, s[i] - L); b = np.searchsorted(s, s[i] + L)
        a = max(0, min(a, i - 1)); b = min(n - 1, max(b, i + 1))
        if a == i or b == i or s[i] - s[a] < L * 0.6 or s[b] - s[i] < L * 0.6:
            continue
        u = p[i] - p[a]; v = p[b] - p[i]
        c = np.dot(u, v) / (np.hypot(*u) * np.hypot(*v) + 1e-12)
        ang[i] = math.degrees(math.acos(max(-1, min(1, c))))
    for i in np.argsort(-ang):
        if ang[i] < theta:
            break
        if all(abs(s[i] - s[j]) > 2 * L for j in out):
            out.append(i)
    return sorted(out)


def polyline_from_points(P, closed):
    """Lines-only simplification with corner refinement by line intersection."""
    if closed:
        st, segs = FT.fit_closed(P)
        if any(s[0] != 'L' for s in segs):
            return None
        return np.array([st] + [s[1] for s in segs[:-1]] if np.allclose(segs[-1][1], st) else [st] + [s[1] for s in segs])
    cs = open_corners(P)
    idx = [0] + cs + [len(P) - 1]
    lines = []
    for a, b in zip(idx[:-1], idx[1:]):
        q = P[a:b + 1]
        # ignore points near the corners when fitting the line
        d0 = np.hypot(*(q - q[0]).T); d1 = np.hypot(*(q - q[-1]).T)
        keep = (d0 > 3) & (d1 > 3)
        qq = q[keep] if keep.sum() >= 3 else q
        c, d = FT.line_fit(qq)
        dev = np.abs((qq[:, 0] - c[0]) * d[1] - (qq[:, 1] - c[1]) * d[0])
        if dev.max() > 0.6:
            return None
        lines.append((c, d))
    V = [FT.project(P[0], *lines[0])]
    for (c1, d1), (c2, d2) in zip(lines[:-1], lines[1:]):
        M = np.array([d1, -d2]).T
        if abs(np.linalg.det(M)) < 0.05:
            return None
        t = np.linalg.solve(M, c2 - c1)
        V.append(c1 + t[0] * d1)
    V.append(FT.project(P[-1], *lines[-1]))
    return np.array(V)


def offset_polygon(V, dist):
    """Offset closed polygon edges by dist along their left normal and re-intersect."""
    n = len(V)
    lines = []
    for i in range(n):
        a, b = V[i], V[(i + 1) % n]
        d = FT.unit(b - a); nrm = np.array([-d[1], d[0]])
        lines.append((a + nrm * dist, d))
    out = []
    for i in range(n):
        (c1, d1), (c2, d2) = lines[i - 1], lines[i]
        M = np.array([d1, -d2]).T
        if abs(np.linalg.det(M)) < 1e-6:
            out.append(c2); continue
        t = np.linalg.solve(M, c2 - c1)
        out.append(c1 + t[0] * d1)
    return np.array(out)


def poly_d(V, closed, dec=2):
    f = lambda v: FT.fmtn(v, dec)
    Vs = FT.snap(V, dec)
    s = 'M' + FT.join_nums([f(Vs[0][0]), f(Vs[0][1])])
    cur = Vs[0]
    nums = []
    for v in Vs[1:]:
        d = np.round(v - cur, dec)
        nums += [f(d[0]), f(d[1])]
        cur = v
    s += 'l' + FT.join_nums(nums)
    return s + ('z' if closed else '')


def stroke_attrs(w, join, cap, color):
    a = f' stroke-linejoin="{join}"' if join != 'miter' else ''
    c = f' stroke-linecap="{cap}"' if cap != 'butt' else ''
    return f'fill="none" stroke="{color}" stroke-width="{FT.fmtn(float(FT.snap(w, 2, 0.03)), 2)}"{a}{c}'


def stroke_el(d, w, join, cap, color='#fff'):
    return f'<path d="{d}" {stroke_attrs(w, join, cap, color)}/>'


def geom_d(geom, closed):
    """Path data of a centre-line geometry (for merged output)."""
    if geom[0] == 'poly':
        return poly_d(geom[1], closed)
    if geom[0] == 'open':
        d = FT.path_data(geom[1], geom[2], 2)
        return d[:-1] if d.endswith('z') else d
    if geom[0] == 'path':
        return FT.path_data(geom[1], geom[2], 2)
    k, p = geom[1], geom[2]
    if k == 'circle':
        return FT.circle_path(*p, dec=2)
    if k == 'ellipse':
        return FT.ellipse_path(*p, dec=2)
    return FT.rect_path(*p, dec=2)


def geom_el(geom, closed, w, join, cap, color='#fff'):
    att = stroke_attrs(w, join, cap, color)
    f = lambda v: FT.fmtn(v, 2)
    if geom[0] == 'prim':
        k, p = geom[1], geom[2]
        if k == 'circle':
            return f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="{f(p[2])}" {att}/>'
        if k == 'ellipse':
            cx, cy, rx, ry, th = p
            deg = math.degrees(th) % 180
            deg = deg - 180 if deg > 90 else deg
            tr = '' if abs(deg) < 0.05 else f' transform="rotate({FT.fmtn(deg, 2)} {f(cx)} {f(cy)})"'
            return f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}"{tr} {att}/>'
        x0, y0, x1, y1, r = p
        rr = f' rx="{f(r)}"' if r > 0 else ''
        return f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(x1 - x0)}" height="{f(y1 - y0)}"{rr} {att}/>'
    return f'<path d="{geom_d(geom, closed)}" {att}/>'


def candidates(F, org, holes):
    """Return list of candidate centre lines: (V, closed, w) in absolute coords, or []."""
    oy, ox = org
    mask = F >= 0.5
    A = float(F.sum())
    cons = FT.contours(F, ox, oy)
    cons = [c for c in cons if abs(FT.poly_area(c)) >= 2.0]
    out = []
    if len(cons) == 2:
        outer, inner = sorted(cons, key=lambda c: -abs(FT.poly_area(c)))
        Po = np.hypot(*(np.roll(outer, -1, 0) - outer).T).sum()
        Pi = np.hypot(*(np.roll(inner, -1, 0) - inner).T).sum()
        w = A / ((Po + Pi) / 2)
        if w < 1.5 or w > 0.25 * math.sqrt(abs(FT.poly_area(inner))):
            return []
        # constant width check: outer contour points sit ~w from the inner contour
        d = FT.seg_dist(outer[::3], inner)
        if np.percentile(d, 60) < 0.85 * w or np.percentile(d, 40) > 1.15 * w:
            return []
        w = float(np.median(d))
        V = polyline_from_points(inner, True)
        if V is not None and len(V) >= 3:
            area = FT.poly_area(V)
            # offset towards the ring (away from the hole): outward of the inner polygon
            for sgn in (1, -1):
                C = offset_polygon(V, sgn * w / 2)
                if abs(FT.poly_area(C)) > abs(area):
                    out.append((('poly', C), True, w))
                    break
            return out
        # ring between two primitives of the same kind: centre line = mean of both
        pi_, po_ = FT.recognise(inner), FT.recognise(outer)
        if pi_ is not None and po_ is not None and pi_[0] == po_[0]:
            a, b = np.array(pi_[1], float), np.array(po_[1], float)
            if pi_[0] == 'circle':
                out.append((('prim', 'circle', tuple((a + b) / 2)), True, float(b[2] - a[2])))
            elif pi_[0] == 'rect':
                wr = float(np.mean([a[0] - b[0], a[1] - b[1], b[2] - a[2], b[3] - a[3]]))
                c = (a + b) / 2
                c[4] = (a[4] + b[4]) / 2 if a[4] > 0 else max(b[4] - wr / 2, 0)
                out.append((('prim', 'rrect' if c[4] > 0 else 'rect', tuple(c)), True, wr))
            elif pi_[0] == 'ellipse' and abs(math.sin(a[4] - b[4])) < 0.05:
                c = (a + b) / 2
                out.append((('prim', 'ellipse', tuple(c)), True, float((b[2] - a[2] + b[3] - a[3]) / 2)))
        # smooth ring: centre points = inner contour pushed half a width into the ring
        T = FT.local_tangents(np.vstack([inner[-8:], inner, inner[:8]]), 3.0)[8:-8]
        Nn = np.stack([-T[:, 1], T[:, 0]], 1)
        probe = inner + Nn * (w / 2)
        val = bilinear(F, probe[:, 0] - ox, probe[:, 1] - oy)
        sgn = 1.0 if np.median(val) > 0.5 else -1.0
        C = inner + sgn * Nn * (w / 2)
        prim = FT.recognise(C, maxtol=0.8, rmstol=0.25)
        if prim is not None:
            out.append((('prim', prim[0] if not (prim[0] == 'rect' and prim[1][4] > 0) else 'rrect', prim[1]), True, w))
        st, segs = FT.fit_closed(C)
        out.append((('path', st, segs), True, w))
        return out
    if len(cons) == 1 and not holes:
        dt = ndi.distance_transform_edt(mask)
        w0 = 2 * np.percentile(dt[dt > 0], 95) - 1 if (dt > 0).any() else 0
        if w0 < 2.0:
            return []
        P = skeleton_chain(mask, w0)
        if P is None or len(P) < 6:
            return []
        P = P + np.array([ox, oy])
        L = np.hypot(*np.diff(P, axis=0).T).sum()
        if L < 4 * w0:
            return []
        # sub-pixel centre points by casting normals
        T = FT.local_tangents(P, 3.0)
        Q = []; W = []
        Fw = lambda x, y: bilinear(F, np.asarray(x) - ox, np.asarray(y) - oy)
        Floc = np.pad(F, 0)
        for p, t in zip(P[::2], T[::2]):
            nrm = np.array([-t[1], t[0]])
            pl = p - np.array([ox, oy])
            a = crossing(Floc, pl, nrm, 3 * w0); b = crossing(Floc, pl, -nrm, 3 * w0)
            if a is None or b is None:
                continue
            Q.append(p + nrm * (a - b) / 2); W.append(a + b)
        if len(Q) < 6:
            return []
        Q = np.array(Q); W = np.array(W)
        w = float(np.median(W))
        if np.percentile(np.abs(W - w), 70) > max(0.6, 0.12 * w):
            return []
        V = polyline_from_points(Q, False)
        if V is None:
            # curved centre line: extend ends to the coverage boundary, then fit Beziers
            for end, nxt in ((0, 1), (-1, -2)):
                dvec = FT.unit(Q[end] - Q[nxt])
                e = crossing(Floc, Q[end] - np.array([ox, oy]), dvec, 4 * w)
                if e is not None:
                    Q[end] = Q[end] + dvec * e
            segs = FT.fit_piece(Q, Q[0], Q[-1], None, None, 0.2, 0.16, False, False)
            if not segs:
                return []
            out.append((('open', Q[0].copy(), segs), False, w))
            return out
        # extend the ends to where coverage ends (butt cap position)
        for end, nxt in ((0, 1), (-1, -2)):
            dvec = FT.unit(V[end] - V[nxt])
            e = crossing(Floc, V[end] - np.array([ox, oy]), dvec, 4 * w)
            if e is not None:
                V[end] = V[end] + dvec * e
        out.append((('poly', V), False, w))
    return out


def try_stroke(shape, base_el, F=None, holes=None):
    """Returns replacement dict for the shape or None.  base_el renders the current (filled)
    representation alone; the stroke must match the traced coverage at least as well."""
    Fo, org = F if F is not None else shape['F']
    if holes is None:
        holes = shape.get('holes', False) and len(shape['subs']) > 2
    cands = candidates(Fo, org, holes)
    if not cands:
        return None
    opts = []
    for geom, closed, w in cands:
        joins = ['miter', 'round', 'bevel'] if geom[0] == 'poly' else (['miter'] if geom[0] in ('prim', 'open') else ['round', 'miter'])
        caps = ['butt'] if closed else ['butt', 'round', 'square']
        for j in joins:
            for c in caps:
                g = geom
                if not closed and c != 'butt' and geom[0] == 'open':
                    st, sg = geom[1], list(geom[2])
                    t0 = FT.unit(sg[0][1] - st)
                    last = sg[-1]; prevp = (sg[-2][-1] if len(sg) > 1 else st)
                    t1 = FT.unit(last[-1] - (last[2] if last[0] == 'C' else prevp))
                    st2 = st + t0 * w / 2
                    e2 = last[-1] - t1 * w / 2
                    sg[-1] = tuple(list(last[:-1]) + [e2])
                    g = ('open', st2, sg)
                elif not closed and c != 'butt':
                    V = geom[1].copy()
                    V[0] = V[0] - FT.unit(V[0] - V[1]) * w / 2
                    V[-1] = V[-1] - FT.unit(V[-1] - V[-2]) * w / 2
                    g = ('poly', V)
                opts.append((g, closed, w, j, c))
    items = [(base_el, shape['bbox'])] + [(geom_el(g, cl, w, j, c), shape['bbox']) for g, cl, w, j, c in opts]
    R = calib.render_tiles(items)
    if R is None:
        return None
    errs = [coverage_err(Fo, org, r) for r in R]
    k = int(np.argmin(errs[1:])) + 1
    if DEBUG:
        print('   stroke errs: fill %.1f' % errs[0], [(o[0][0], o[3], o[4], round(e, 1)) for o, e in zip(opts, errs[1:])])
    g, closed, ww, j, c = opts[k - 1]
    best_err = errs[k]
    ws = [ww * f for f in (0.98, 0.99, 0.995, 1.005, 1.01, 1.02)]
    R2 = calib.render_tiles([(geom_el(g, closed, x, j, c), shape['bbox']) for x in ws])
    if R2:
        e2 = [coverage_err(Fo, org, r) for r in R2]
        i2 = int(np.argmin(e2))
        if e2[i2] < best_err:
            best_err, ww = e2[i2], ws[i2]
    if best_err > errs[0] * 1.05 + 0.5:
        return None
    return dict(kind='stroke', geom=g, d=geom_d(g, closed), width=ww, join=j, cap=c, closed=closed, err=best_err, err_fill=errs[0])


def coverage_err(Fo, org, rendered):
    Fr, org_r = rendered
    oy, ox = org
    h, w = Fo.shape
    R = np.zeros_like(Fo)
    ry, rx = org_r
    ys0 = max(oy, ry); xs0 = max(ox, rx)
    ys1 = min(oy + h, ry + Fr.shape[0]); xs1 = min(ox + w, rx + Fr.shape[1])
    if ys1 > ys0 and xs1 > xs0:
        R[ys0 - oy:ys1 - oy, xs0 - ox:xs1 - ox] = Fr[ys0 - ry:ys1 - ry, xs0 - rx:xs1 - rx]
    return float(np.abs(Fo - R).sum())
