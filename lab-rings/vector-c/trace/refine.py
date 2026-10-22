"""Render-in-the-loop refinement of traced paths.

Each path is rendered alone (white on black) by the same renderer that produced the input.
Its rendered coverage is compared with the coverage field the path was traced from; the
coverage difference near each segment, divided by the segment length, is the normal offset
that segment needs (area error per unit length).  Segments and vertices are moved accordingly,
which removes the rasterizer's curve-flattening bias and the fitter's residual offsets.
"""
import math
import numpy as np
from scipy.spatial import cKDTree
import calib
import fit as FT
DEBUG = False


def seg_points(start, segs, k=10):
    """Flatten: returns points (M,2), seg index (M,), param t (M,)."""
    P = []; I = []; Tt = []
    cur = start
    for i, s in enumerate(segs):
        t = np.linspace(0, 1, k + 1)[1:-1] if s[0] == 'C' else np.linspace(0, 1, k + 1)[1:-1]
        if s[0] == 'L':
            b = np.array([cur, cur + (s[1] - cur) / 3, cur + 2 * (s[1] - cur) / 3, s[1]])
        else:
            b = np.array([cur, s[1], s[2], s[3]])
        P.append(FT.bez_pt(b, t)); I.append(np.full(len(t), i)); Tt.append(t)
        cur = s[-1]
    return np.vstack(P), np.concatenate(I), np.concatenate(Tt)


def seg_bez(start, segs, i):
    cur = start if i == 0 else segs[i - 1][-1]
    s = segs[i]
    if s[0] == 'L':
        return np.array([cur, cur + (s[1] - cur) / 3, cur + 2 * (s[1] - cur) / 3, s[1]])
    return np.array([cur, s[1], s[2], s[3]])


def normal_at(b, t):
    d = FT.bez_d1(b, np.array([t]))[0]
    n = np.array([d[1], -d[0]])
    L = math.hypot(*n)
    return n / L if L > 1e-9 else np.array([0.0, 0.0])


def sample(F, org, x, y):
    """Bilinear sample of coverage field at absolute coords (pixel centres at i+0.5)."""
    oy, ox = org
    fx = x - 0.5 - ox; fy = y - 0.5 - oy
    h, w = F.shape
    x0 = int(math.floor(fx)); y0 = int(math.floor(fy))
    ax = fx - x0; ay = fy - y0
    def g(yy, xx):
        if 0 <= yy < h and 0 <= xx < w:
            return F[yy, xx]
        return 0.0
    return ((1 - ax) * (1 - ay) * g(y0, x0) + ax * (1 - ay) * g(y0, x0 + 1) +
            (1 - ax) * ay * g(y0 + 1, x0) + ax * ay * g(y0 + 1, x0 + 1))


def refine(shapes, path_d, iters=3, damp=0.6, max_step=0.6):
    """Keeps, per shape, the geometry with the lowest rendered coverage error."""
    if not shapes:
        return
    best = [None] * len(shapes)
    for it in range(iters + 1):
        items = []
        for s in shapes:
            ev = ' fill-rule="evenodd"' if s.get('holes') else ''
            items.append((f'<path d="{path_d(s, 2)}" fill="#fff"{ev}/>', s['bbox']))
        rendered = calib.render_tiles(items)
        if rendered is None:
            return
        for si_, (s, (Fr, org_r)) in enumerate(zip(shapes, rendered)):
            Fo, org = s['F']
            # bring the rendered coverage into the original window
            oy, ox = org
            h, w = Fo.shape
            R = np.zeros_like(Fo)
            ry, rx = org_r
            ys0 = max(oy, ry); xs0 = max(ox, rx)
            ys1 = min(oy + h, ry + Fr.shape[0]); xs1 = min(ox + w, rx + Fr.shape[1])
            if ys1 > ys0 and xs1 > xs0:
                R[ys0 - oy:ys1 - oy, xs0 - ox:xs1 - ox] = Fr[ys0 - ry:ys1 - ry, xs0 - rx:xs1 - rx]
            band = ((Fo > 0.01) & (Fo < 0.99)) | ((R > 0.01) & (R < 0.99))
            yy, xx = np.nonzero(band)
            if len(yy) == 0:
                continue
            dA = (Fo - R)[yy, xx]
            tot = float(np.abs(Fo - R).sum())
            if best[si_] is None or tot < best[si_][0]:
                best[si_] = (tot, s['subs'])
            if it == iters:
                continue
            if DEBUG:
                print('  it', it, 'shape', s['region'], 'band', len(yy), 'sum|dA|', round(float(np.abs(dA).sum()), 2), 'max', round(float(np.abs(dA).max()), 2))
            px = np.stack([xx + ox + 0.5, yy + oy + 0.5], 1)
            for si, (start, segs) in enumerate(s['subs']):
                pass
            # nearest segment over all subpaths
            allP = []; allS = []; allI = []
            for si, (start, segs) in enumerate(s['subs']):
                P, I, T = seg_points(start, segs)
                allP.append(P); allS.append(np.full(len(I), si)); allI.append(I)
            allP = np.vstack(allP); allS = np.concatenate(allS); allI = np.concatenate(allI)
            tree = cKDTree(allP)
            dist, j = tree.query(px)
            near = dist < 1.6
            new_subs = []
            for si, (start, segs) in enumerate(s['subs']):
                nseg = len(segs)
                delta = np.zeros(nseg)
                normals = []
                for i in range(nseg):
                    b = seg_bez(start, segs, i)
                    L = sum(math.hypot(*(b[k + 1] - b[k])) for k in range(3)) if segs[i][0] == 'C' else math.hypot(*(b[3] - b[0]))
                    sel = near & (allS[j] == si) & (allI[j] == i)
                    n0, n1, n2, n3 = (normal_at(b, t) for t in (0.0, 1 / 3, 2 / 3, 1.0))
                    # orient normals towards lower original coverage (outside of the fill)
                    mid = FT.bez_pt(b, np.array([0.5]))[0]; nm = normal_at(b, 0.5)
                    sgn = 1.0 if sample(Fo, org, *(mid + nm)) <= sample(Fo, org, *(mid - nm)) else -1.0
                    normals.append((n0 * sgn, n1 * sgn, n2 * sgn, n3 * sgn))
                    if L > 0.5 and sel.sum() >= 2:
                        delta[i] = np.clip(dA[sel].sum() / L * damp, -max_step, max_step)
                    if DEBUG:
                        print('    seg', i, segs[i][0], 'L %.1f' % L, 'npx', int(sel.sum()), 'sumdA %.2f' % dA[sel].sum(), 'delta %.3f' % delta[i], 'sgn', sgn, 'mid', mid.round(1), 'n', (nm * sgn).round(2))
                # vertex displacements
                def vdisp(na, da, nb, db):
                    M = np.array([na, nb])
                    if abs(np.linalg.det(M)) > 0.3:
                        v = np.linalg.solve(M, np.array([da, db]))
                        if math.hypot(*v) < 2 * max_step:
                            return v
                    nn = na + nb
                    L = math.hypot(*nn)
                    return (nn / L if L > 1e-9 else na) * (da + db) / 2
                closed_v = [vdisp(normals[i - 1][3], delta[i - 1], normals[i][0], delta[i]) for i in range(nseg)]
                # closed_v[i] is the displacement of the start vertex of segment i
                st2 = start + closed_v[0]
                segs2 = []
                for i, sg in enumerate(segs):
                    vend = closed_v[(i + 1) % nseg]
                    if sg[0] == 'L':
                        segs2.append(('L', sg[1] + vend))
                    else:
                        c1 = sg[1] + normals[i][1] * delta[i]
                        c2 = sg[2] + normals[i][2] * delta[i]
                        segs2.append(('C', c1, c2, sg[3] + vend))
                new_subs.append((st2, segs2))
            s['subs'] = new_subs
    for s, b in zip(shapes, best):
        if b is not None:
            s['subs'] = b[1]
