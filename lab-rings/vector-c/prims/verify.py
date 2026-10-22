"""Render-and-compare verification: stroke caps/joins, primitive vs traced path, residual patches."""
import math
import numpy as np
from scipy import ndimage as ndi
import geom as G
import prims as P


def sse(a, b):
    if G._VC is not None:
        r = G._VC.sse_f32(a, b)
        if r is not None:
            if G._VC.CHECK and r != float(((a - b) ** 2).sum()):
                raise AssertionError('vcfit.sse_f32 differs from numpy')
            return r
    return float(((a - b) ** 2).sum())


class Ctx:
    def __init__(self, eng, shapes, rnd, img):
        self.eng, self.shapes, self.rnd, self.img = eng, list(shapes), rnd, img
        self.svg = P.to_svg(eng, self.shapes, eng.bg_fill)
        self.r = rnd.render(self.svg)
        self.err = sse(self.r, img)

    def trial(self, shapes):
        svg = P.to_svg(self.eng, shapes, self.eng.bg_fill)
        r = self.rnd.render(svg)
        return sse(r, self.img), svg, r

    def accept(self, shapes, e, svg, r):
        self.shapes, self.err, self.svg, self.r = shapes, e, svg, r

    def snapshot(self):
        return (list(self.shapes), self.err, self.svg, self.r)

    def restore(self, s):
        self.shapes, self.err, self.svg, self.r = list(s[0]), s[1], s[2], s[3]


def stroke_variants(s):
    p = s['prm']
    out = []
    V = p['V']
    if not p['closed']:
        # butt / square caps: put the flat end at the visible extreme
        Pp = s.get('fitP')
        VV = V.copy()
        if Pp is not None:
            for i, j in ((0, 1), (len(V) - 1, len(V) - 2)):
                dv = G._unit(V[i] - V[j])
                e = float(((Pp - V[i]) @ dv).max())
                VV[i] = V[i] + dv * e
        for cap, shift in (('butt', 0.0), ('square', -1.0)):
            q = dict(p)
            W = VV.copy()
            if shift:
                for i, j in ((0, 1), (len(V) - 1, len(V) - 2)):
                    dv = G._unit(VV[i] - VV[j])
                    W[i] = VV[i] - dv * p['hw']
            q['V'] = W
            q['cap'] = cap
            out.append(q)
    if len(V) >= 3:
        for join in ('miter', 'bevel'):
            q = dict(p)
            q['join'] = join
            out.append(q)
    return out


RECT = ('rect', 'rrect', 'rot_rect', 'rot_rrect')


def get_params(s):
    """-> (x, steps, make(x)->shape) for primitives; None for paths."""
    k, p = s['kind'], s['prm']
    if k == 'circle':
        names = ['cx', 'cy', 'r']
    elif k == 'ellipse':
        names = ['cx', 'cy', 'rx', 'ry', 'th']
    elif k in RECT:
        names = ['cx', 'cy', 'hx', 'hy'] + (['r'] if p['r'] > 0.3 else []) + (['th'] if abs(p['th']) > 1e-9 else [])
    elif k in ('polygon', 'stroke'):
        V = np.asarray(p['V'], float)
        x = V.ravel().copy()
        steps = np.full(len(x), 0.2)
        if k == 'stroke':
            x = np.r_[x, p['hw']]
            steps = np.r_[steps, 0.1]
        n = len(V)

        def make(x, s=s, n=n, k=k):
            t = dict(s)
            q = dict(s['prm'])
            q['V'] = x[:2 * n].reshape(n, 2).copy()
            if k == 'stroke':
                q['hw'] = abs(x[-1])
            t['prm'] = q
            return t
        return x, steps, make
    else:
        return None
    x = np.array([p[nm] for nm in names], float)
    size = max(p.get('r', 0), p.get('rx', 0), p.get('hx', 0), p.get('hy', 0), 5)
    steps = np.array([0.2 / size if nm == 'th' else 0.15 for nm in names])

    def make(x, s=s, names=names):
        t = dict(s)
        q = dict(s['prm'])
        for nm, val in zip(names, x):
            q[nm] = abs(val) if nm in ('r', 'rx', 'ry', 'hx', 'hy') else val
        t['prm'] = q
        return t
    return x, steps, make


def _roi(eng, s, pad=4):
    m = eng.raster(s) if s['kind'] != 'path' else s['pmask']
    ys, xs = np.nonzero(m)
    if len(ys) == 0:
        return None
    return (slice(max(0, ys.min() - pad), min(eng.H, ys.max() + pad + 1)),
            slice(max(0, xs.min() - pad), min(eng.W, xs.max() + pad + 1)))


def polish(C, idx, log, iters=4):
    """Levenberg-Marquardt on the shape's parameters with Jacobians from finite-difference Chromium renders."""
    s = C.shapes[idx]
    gp = get_params(s)
    if gp is None:
        return
    x, steps, make = gp
    img = C.img
    e_start = C.err
    for it in range(iters):
        roi = _roi(C.eng, make(x))
        if roi is None:
            return
        r0 = (C.r[roi] - img[roi]).ravel()
        J = np.zeros((len(r0), len(x)))
        for j in range(len(x)):
            xp = x.copy(); xp[j] += steps[j]
            sh = C.shapes[:idx] + [make(xp)] + C.shapes[idx + 1:]
            _, _, rp = C.trial(sh)
            J[:, j] = ((rp[roi] - C.r[roi]).ravel()) / steps[j]
        A = J.T @ J
        g = J.T @ r0
        if not np.isfinite(A).all() or np.trace(A) <= 0:
            return
        improved = False
        for lam in (1e-3, 1e-1, 1.0):
            try:
                dx = -np.linalg.solve(A + lam * np.diag(np.diag(A) + 1e-9), g)
            except np.linalg.LinAlgError:
                continue
            lim = np.maximum(steps * 5, 1e-9)
            dx = np.clip(dx, -lim, lim)
            xn = x + dx
            sh = C.shapes[:idx] + [make(xn)] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            if e < C.err:
                C.accept(sh, e, svg, r)
                x = xn
                improved = True
                break
        if not improved or np.abs(dx / steps).max() < 0.05:
            break
    if C.err < e_start:
        log(f'  polish {idx} {s["kind"]}: sse {e_start:.4g} -> {C.err:.4g}')


def snap_path(C, idx, log):
    s = C.shapes[idx]
    prm = s['prm']
    segl = _path_segs(prm)
    tol = max(C.err * 0.002, 2000.0)
    for q in (1.0, 0.5):
        R = lambda a: np.round(np.asarray(a, float) / q) * q
        new = [[('L', R(sg[1]), R(sg[2])) if sg[0] == 'L' else (sg[0], R(sg[1])) for sg in segs] for segs in segl]
        t = dict(s)
        t['prm'] = dict(prm, segs=new, d=''.join(G.segs_to_d(sg) for sg in new))
        sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
        e, svg, r = C.trial(sh)
        if e <= C.err + tol:
            log(f'  snap path {idx} to {q}: sse {C.err:.4g} -> {e:.4g}')
            C.accept(sh, e, svg, r)
            return
    # small paths: snap node / handle coordinates one at a time (keep each that does not hurt)
    items, make = path_param_model(prm)
    if not items or items[0][1] != 'nx':
        return
    flat = []
    for ci, segs in enumerate(segl):
        for i, sg in enumerate(segs):
            flat.append((ci, i, 'node'))
            if sg[0] != 'L':
                for h in range(1, len(sg[1]) - 1):
                    flat.append((ci, i, h))
    cur = [[('L', np.array(sg[1], float), np.array(sg[2], float)) if sg[0] == 'L' else (sg[0], np.array(sg[1], float))
            for sg in segs] for segs in segl]
    nacc = 0
    for (ci, i, h) in flat:
        for ax in (0, 1):
            new = [[(sg[0], sg[1].copy(), sg[2].copy()) if sg[0] == 'L' else (sg[0], sg[1].copy()) for sg in segs] for segs in cur]
            segs = new[ci]
            if h == 'node':
                p = segs[i][1] if segs[i][0] == 'L' else segs[i][1][0]
                dv = np.zeros(2); dv[ax] = round(p[ax]) - p[ax]
                if abs(dv[ax]) < 1e-6:
                    continue
                m = len(segs)
                if segs[i][0] == 'L':
                    segs[i] = ('L', segs[i][1] + dv, segs[i][2])
                else:
                    segs[i][1][0] += dv
                j = (i - 1) % m
                if segs[j][0] == 'L':
                    segs[j] = ('L', segs[j][1], segs[j][2] + dv)
                else:
                    segs[j][1][-1] += dv
            else:
                v0 = segs[i][1][h][ax]
                if abs(round(v0) - v0) < 1e-6:
                    continue
                segs[i][1][h][ax] = round(v0)
            t = dict(C.shapes[idx])
            t['prm'] = dict(prm, segs=new, d=''.join(G.segs_to_d(sg) for sg in new))
            sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            if e <= C.err + 300:
                C.accept(sh, e, svg, r)
                cur = new
                nacc += 1
    if nacc:
        log(f'  snap path {idx}: {nacc} coordinates rounded, sse now {C.err:.4g}')


def snap(C, idx, log):
    """Designers use round numbers: try snapping parameters to 0.5 / 1 multiples, keep if the render is no worse."""
    s = C.shapes[idx]
    if s['kind'] == 'path':
        return snap_path(C, idx, log)
    gp = get_params(s)
    if gp is None:
        return
    x, steps, make = gp
    names_th = [j for j in range(len(x)) if steps[j] < 0.05]  # angles
    def snapped(x, q):
        y = x.copy()
        for j in range(len(x)):
            if j in names_th:
                deg = np.degrees(x[j]); y[j] = np.radians(np.round(deg * 2 / q) * q / 2)
            else:
                y[j] = np.round(x[j] / q) * q
        return y
    tol = max(C.err * 0.002, 2000.0)
    for q in (1.0, 0.5):
        y = snapped(x, q)
        if np.abs(y - x).max() > 0.6 * q + 1e-9:
            continue
        sh = C.shapes[:idx] + [make(y)] + C.shapes[idx + 1:]
        e, svg, r = C.trial(sh)
        if e <= C.err + tol:
            log(f'  snap {idx} {s["kind"]} to {q}: sse {C.err:.4g} -> {e:.4g}')
            C.accept(sh, e, svg, r)
            return
    # per-parameter
    for j in range(len(x)):
        for q in (1.0, 0.5):
            y = x.copy()
            y[j] = snapped(x, q)[j]
            if abs(y[j] - x[j]) < 1e-9 or abs(y[j] - x[j]) > 0.3 * q + 1e-9:
                continue
            sh = C.shapes[:idx] + [make(y)] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            if e <= C.err + tol * 0.5:
                C.accept(sh, e, svg, r)
                x = y
                break


def _path_segs(prm):
    if prm.get('segs') is not None:
        return prm['segs']
    return [G.fit_closed_contour(c, err=prm.get('err', P.PATH_ERR), bias=prm.get('bias', 0.0)) for c in prm['contours']]


def _perp(v):
    v = G._unit(v)
    return np.array([-v[1], v[0]])


def _move_node(segs, i, dv):
    """Move the node that starts segment i (and ends segment i-1), dragging cubic handles along."""
    m = len(segs)
    if segs[i][0] == 'L':
        segs[i] = ('L', segs[i][1] + dv, segs[i][2])
    else:
        c = segs[i][1]; c[0] += dv
        if segs[i][0] == 'C':
            c[1] += dv
    j = (i - 1) % m
    if segs[j][0] == 'L':
        segs[j] = ('L', segs[j][1], segs[j][2] + dv)
    else:
        c = segs[j][1]; c[-1] += dv
        if segs[j][0] == 'C':
            c[-2] += dv


def path_param_model(prm):
    """Deformation model of a traced path.  Small paths: every node / handle coordinate is free.  Larger paths:
    per node a normal offset, per cubic a bulge."""
    segl = _path_segs(prm)
    nfree = sum(sum(2 + {'C': 4, 'Q': 2}.get(s[0], 0) for s in segs) for segs in segl)
    items = []  # (contour index, kind, segment index)
    for ci, segs in enumerate(segl):
        m = len(segs)
        for i in range(m):
            if nfree <= 24:
                items += [(ci, 'nx', i), (ci, 'ny', i)]
                if segs[i][0] == 'C':
                    items += [(ci, 'h1x', i), (ci, 'h1y', i), (ci, 'h2x', i), (ci, 'h2y', i)]
                elif segs[i][0] == 'Q':
                    items += [(ci, 'h1x', i), (ci, 'h1y', i)]
            else:
                items.append((ci, 'node', i))
                if segs[i][0] in 'CQ':
                    items.append((ci, 'bulge', i))

    def start(s):
        return s[1] if s[0] == 'L' else s[1][0]

    def end(s):
        return s[2] if s[0] == 'L' else s[1][-1]

    def make(x):
        out = []
        for ci, segs in enumerate(segl):
            out.append([(s[0], np.array(s[1], float).copy(), np.array(s[2], float).copy()) if s[0] == 'L'
                        else (s[0], np.array(s[1], float).copy()) for s in segs])
        for val, (ci, kind, i) in zip(x, items):
            segs = out[ci]
            m = len(segs)
            s = segl[ci][i]
            if kind in ('h1x', 'h1y', 'h2x', 'h2y'):
                c = segs[i][1]
                c[1 if kind[1] == '1' else 2][0 if kind[2] == 'x' else 1] += val
                continue
            if kind in ('nx', 'ny'):
                dv = np.array([val, 0.0]) if kind == 'nx' else np.array([0.0, val])
                _move_node(segs, i, dv)
                continue
            if kind == 'node':
                prev = segl[ci][i - 1]
                tin = G._unit(end(prev) - (prev[1][-2] if prev[0] != 'L' else prev[1]))
                tout = G._unit((s[1][1] if s[0] != 'L' else s[2]) - start(s))
                n = _perp(tin + tout) if np.hypot(*(tin + tout)) > 1e-6 else _perp(tout)
                _move_node(segs, i, val * n)
            else:
                c = segs[i][1]
                n = _perp(s[1][-1] - s[1][0])
                c[1:-1] += val * n
        return out
    return items, make


def polish_path(C, idx, log, iters=5, max_params=40):
    s = C.shapes[idx]
    prm = s['prm']
    items, make = path_param_model(prm)
    k = len(items)
    if k == 0 or k > max_params:
        return
    x = np.zeros(k)
    step = 0.15

    def shape_of(x):
        segl = make(x)
        t = dict(s)
        t['prm'] = dict(prm, segs=segl, d=''.join(G.segs_to_d(sg) for sg in segl))
        return t
    e0 = C.err
    for it in range(iters):
        roi = _roi(C.eng, s, pad=3)
        if roi is None:
            return
        r0 = (C.r[roi] - C.img[roi]).ravel()
        J = np.zeros((len(r0), k))
        for j in range(k):
            xp = x.copy(); xp[j] += step
            sh = C.shapes[:idx] + [shape_of(xp)] + C.shapes[idx + 1:]
            _, _, rp = C.trial(sh)
            J[:, j] = (rp[roi] - C.r[roi]).ravel() / step
        A = J.T @ J; g = J.T @ r0
        ok = False
        for lam in (1e-2, 1e-1, 1.0):
            try:
                dx = -np.linalg.solve(A + lam * np.diag(np.diag(A) + 1e-6), g)
            except np.linalg.LinAlgError:
                continue
            dx = np.clip(dx, -0.6, 0.6)
            sh = C.shapes[:idx] + [shape_of(x + dx)] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            if e < C.err:
                C.accept(sh, e, svg, r)
                x = x + dx
                ok = True
                break
        if not ok:
            break
    if C.err < e0:
        log(f'  path polish {idx} ({k} params): sse {e0:.4g} -> {C.err:.4g}')


def path_bias(C, idx, log):
    s = C.shapes[idx]
    best = None
    for b in (0.05, 0.1, 0.15):
        t = dict(s)
        t['prm'] = dict(s['prm'], bias=b, d=None)
        sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
        e, svg, r = C.trial(sh)
        if e < C.err and (best is None or e < best[0]):
            best = (e, sh, svg, r, b)
        elif best is not None and e > best[0]:
            break
    if best is not None:
        log(f'  path {idx}: curve bias {best[4]} sse {C.err:.4g} -> {best[0]:.4g}')
        C.accept(best[1], best[0], best[2], best[3])


def _as_path_d(s):
    """Path data of a shape that can join a compound path (traced path, polygon, plain axis-aligned rectangle)."""
    p = s['prm']
    if s['kind'] == 'path':
        return p.get('d')
    if s['kind'] == 'polygon':
        V = p['V']
        return G.segs_to_d([('L', V[i], V[(i + 1) % len(V)]) for i in range(len(V))])
    if s['kind'] in ('rect', 'rrect') and p['r'] <= 0.05 and abs(p['th']) < 1e-9:
        x0, y0, x1, y1 = p['cx'] - p['hx'], p['cy'] - p['hy'], p['cx'] + p['hx'], p['cy'] + p['hy']
        V = np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
        return G.segs_to_d([('L', V[i], V[(i + 1) % 4]) for i in range(4)], nd=2)
    return None


def punch_holes(C, log):
    """A shape painted in the surrounding colour entirely inside a lower traced/polygon shape is really a hole in it
    (e.g. the counter of a glyph): append it as an even-odd subpath and drop the element."""
    sh = list(C.shapes)
    masks = [C.eng.raster(s) if s['kind'] != 'path' else s['pmask'] for s in sh]
    changed = False
    j = 0
    while j < len(sh):
        s = sh[j]
        dS = _as_path_d(s)
        if dS is None or s['fill']['type'] != 'flat' or not masks[j].any():
            j += 1
            continue
        done = False
        for i in range(j - 1, -1, -1):
            t = sh[i]
            ov = (masks[i] & masks[j]).sum()
            if ov == 0:
                continue
            dT = _as_path_d(t)
            inside = ov >= 0.97 * masks[j].sum()
            if (dT is not None and inside and t['fill']['type'] == 'flat' and 'surc' in t
                    and np.abs(np.asarray(t['surc']) - s['fill']['c']).max() < 10):
                t = dict(t)
                pa = t['prm']
                na = pa.get('nsub', len(pa['contours'])) if t['kind'] == 'path' else 1
                t['prm'] = dict(kind='path', contours=(pa['contours'] if t['kind'] == 'path' else []), d=dT + dS,
                                nsub=na + 1, evenodd=True, bias=pa.get('bias', 0))
                t['kind'] = 'path'
                t['alts'] = []
                t['pmask'] = masks[i] & ~masks[j]
                sh[i] = t
                masks[i] = t['pmask']
                del sh[j]; del masks[j]
                changed = done = True
            break
        if not done:
            j += 1
    if changed:
        e, svg, r = C.trial(sh)
        if e <= C.err * 1.02 + 1000:
            log(f'  holes punched: {len(C.shapes)} -> {len(sh)} elements, sse {C.err:.4g} -> {e:.4g}')
            C.accept(sh, e, svg, r)


def merge_compound(C, log):
    """Same-colour traced outlines (e.g. the glyphs of a text run, with polygon / bar pieces of the same run) become
    one <path> element, as long as the z-order allows it."""
    sh = list(C.shapes)
    masks = [C.eng.raster(s) if s['kind'] != 'path' else s['pmask'] for s in sh]

    def rows(m):
        ys = np.nonzero(m.any(1))[0]
        return (ys.min(), ys.max()) if len(ys) else (0, -1)
    j = 0
    merged_any = False
    while j < len(sh):
        s = sh[j]
        if s['fill']['type'] != 'flat' or _as_path_d(s) is None:
            j += 1
            continue
        target = None
        for i in range(j - 1, -1, -1):
            t = sh[i]
            if (_as_path_d(t) is not None and t['fill']['type'] == 'flat'
                    and np.abs(t['fill']['c'] - s['fill']['c']).max() < 1 and (masks[i] & masks[j]).sum() <= 10
                    and (t['kind'] == 'path' or s['kind'] == 'path')):
                if t['kind'] != 'path' or s['kind'] != 'path':
                    # a primitive joins a traced outline only when it sits on the same text line
                    a0, a1 = rows(masks[i]); b0, b1 = rows(masks[j])
                    ov = min(a1, b1) - max(a0, b0)
                    if ov < 0.5 * min(a1 - a0, b1 - b0):
                        if (masks[i] & masks[j]).sum() > 10:
                            break
                        continue
                target = i
                break
            if (masks[i] & masks[j]).sum() > 10 or ((masks[i] & masks[j]).any() and
                                                    np.abs(t['fill'].get('c', -99) - s['fill']['c']).max() >= 1):
                break   # s must stay above this shape
        if target is None:
            j += 1
            continue
        t = dict(sh[target])
        pa, pb = t['prm'], s['prm']
        d = _as_path_d(t) + _as_path_d(s)
        na = pa.get('nsub', len(pa['contours'])) if t['kind'] == 'path' else 1
        nb = pb.get('nsub', len(pb['contours'])) if s['kind'] == 'path' else 1
        ca = pa['contours'] if t['kind'] == 'path' else []
        cb = pb['contours'] if s['kind'] == 'path' else []
        t['prm'] = dict(kind='path', contours=ca + cb, d=d, nsub=na + nb, evenodd=True, bias=pa.get('bias', 0))
        t['pmask'] = masks[target] | masks[j]
        t['regions'] = t['regions'] | s['regions']
        t['glyphs'] = t.get('glyphs', 1) + s.get('glyphs', 1)
        t['kind'] = 'path'
        t['alts'] = []
        sh[target] = t
        masks[target] = masks[target] | masks[j]
        del sh[j]; del masks[j]
        merged_any = True
        j = target + 1
    if merged_any:
        e, svg, r = C.trial(sh)
        # one element instead of many is worth a tiny loss (Chromium rasterises big compound paths slightly differently)
        if e <= C.err * 1.04 + 1000:
            log(f'  compound merge: {len(C.shapes)} -> {len(sh)} elements, sse {C.err:.4g} -> {e:.4g}')
            C.accept(sh, e, svg, r)
        else:
            log(f'  compound merge rejected: sse {C.err:.4g} -> {e:.4g}')


def _stops_ls(t, Cs, offs):
    offs = np.asarray(offs, float)
    tt = np.clip(t, offs[0], offs[-1])
    j = np.clip(np.searchsorted(offs, tt, side='right') - 1, 0, len(offs) - 2)
    f = (tt - offs[j]) / np.maximum(offs[j + 1] - offs[j], 1e-9)
    B = np.zeros((len(t), len(offs)))
    B[np.arange(len(t)), j] = 1 - f
    B[np.arange(len(t)), j + 1] = f
    cols = np.linalg.lstsq(B, Cs, rcond=None)[0]
    used = np.abs(B).sum(0) > 1e-6
    for k in range(len(offs)):
        if not used[k]:
            nb = [q for q in range(len(offs)) if used[q]]
            if nb:
                cols[k] = cols[min(nb, key=lambda q: abs(q - k))]
    cols = np.clip(np.round(cols), 0, 255)
    rms = float(np.sqrt(((B @ cols - Cs) ** 2).mean()))
    return cols, rms


def grad_variants(fill, bbox, shape):
    """Alternative gradient definitions: geometry snapped to the shape (bounding box / circle) and stop sets at
    round offsets, colours by least squares.  Returned best-first by sample rms."""
    if '_samples' not in fill:
        return []
    X, Y, Cs = fill['_samples']
    geos = [dict(fill)]
    x0, y0, x1, y1 = bbox
    if fill['type'] == 'lin':
        d = G._unit(np.array([fill['x2'] - fill['x1'], fill['y2'] - fill['y1']]))
        if abs(d[0]) > 0.999:
            a, b = (x0, x1) if d[0] > 0 else (x1, x0)
            geos.append(dict(fill, x1=a, y1=0.0, x2=b, y2=0.0))
        elif abs(d[1]) > 0.999:
            a, b = (y0, y1) if d[1] > 0 else (y1, y0)
            geos.append(dict(fill, x1=0.0, y1=a, x2=0.0, y2=b))
        else:
            c = np.array([(x0 + x1) / 2, (y0 + y1) / 2])
            pr = [(np.array(p) - c) @ d for p in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]]
            p1 = c + d * min(pr); p2 = c + d * max(pr)
            geos.append(dict(fill, x1=p1[0], y1=p1[1], x2=p2[0], y2=p2[1]))
    else:
        if shape is not None and shape['kind'] == 'circle':
            p = shape['prm']
            geos.append(dict(fill, cx=p['cx'], cy=p['cy'], r=p['r']))
        elif abs((x1 - x0) - (y1 - y0)) < 1:
            geos.append(dict(fill, cx=(x0 + x1) / 2, cy=(y0 + y1) / 2, r=(x1 - x0) / 2))
    grid = np.round(np.arange(0.05, 0.951, 0.05), 2)
    sets = [(0.0, 1.0)] + [(0.0, m, 1.0) for m in grid] + \
           [(0.0, a, b, 1.0) for i, a in enumerate(grid) for b in grid[i + 1:]]
    out = []
    from prims import grad_t
    for gi, geo in enumerate(geos):
        t = grad_t(geo, X, Y)
        best = {}
        for offs in sets:
            cols, rms = _stops_ls(t, Cs, offs)
            k = len(offs)
            if k not in best or rms < best[k][0]:
                best[k] = (rms, offs, cols)
        for k, (rms, offs, cols) in best.items():
            f = dict(geo)
            f['stops'] = [(float(o), c) for o, c in zip(offs, cols)]
            out.append((rms + 0.05 * k, f))
    out.sort(key=lambda z: z[0])
    return [f for _, f in out[:6]]


def refine_gradients(C, log):
    eng = C.eng
    # background
    if eng.bg_fill['type'] != 'flat':
        orig = eng.bg_fill
        best = None
        for f in grad_variants(orig, (0, 0, eng.W, eng.H), None):
            eng.bg_fill = f
            e, svg, r = C.trial(C.shapes)
            if e < C.err and (best is None or e < best[0]):
                best = (e, f, svg, r)
        eng.bg_fill = orig
        if best is not None:
            log(f'  background gradient refit: sse {C.err:.4g} -> {best[0]:.4g} ({len(best[1]["stops"])} stops)')
            eng.bg_fill = best[1]
            C.accept(C.shapes, best[0], best[2], best[3])
    for idx in range(len(C.shapes)):
        s = C.shapes[idx]
        if s['fill']['type'] == 'flat':
            continue
        m = eng.raster(s) if s['kind'] != 'path' else s['pmask']
        ys, xs = np.nonzero(m)
        if len(ys) == 0:
            continue
        bbox = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
        if s['kind'] == 'circle':
            p = s['prm']; bbox = (p['cx'] - p['r'], p['cy'] - p['r'], p['cx'] + p['r'], p['cy'] + p['r'])
        best = None
        for f in grad_variants(s['fill'], bbox, s):
            t = dict(s); t['fill'] = f
            sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            if e < C.err and (best is None or e < best[0]):
                best = (e, sh, svg, r, len(f['stops']))
        if best is not None:
            log(f'  gradient refit {idx}: sse {C.err:.4g} -> {best[0]:.4g} ({best[4]} stops)')
            C.accept(best[1], best[0], best[2], best[3])


def refine(eng, shapes, rnd, img, log=print):
    C = Ctx(eng, shapes, rnd, img)
    log(f'verify: start sse {C.err:.4g}')
    # 1. stroke caps & joins
    for idx in range(len(C.shapes)):
        s = C.shapes[idx]
        if s['kind'] != 'stroke':
            continue
        for _round in range(2):
            improved = False
            for q in stroke_variants(C.shapes[idx]):
                t = dict(C.shapes[idx]); t['prm'] = q
                sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
                e, svg, r = C.trial(sh)
                if e < C.err * 0.999:
                    log(f'  stroke {idx}: cap={q["cap"]} join={q["join"]} sse {C.err:.4g} -> {e:.4g}')
                    C.accept(sh, e, svg, r)
                    improved = True
            if not improved:
                break
    # 2. render-in-the-loop parameter polish of primitives; curve-flattening bias of traced paths
    for idx in range(len(C.shapes)):
        if C.shapes[idx]['kind'] == 'path':
            path_bias(C, idx, log)
            polish_path(C, idx, log)
        else:
            polish(C, idx, log)
    # 3. alternatives (primitive / stroke / traced path): keep the simpler one unless another is clearly better
    rank = {'path': 2, 'stroke': 1}
    for idx in range(len(C.shapes)):
        s = C.shapes[idx]
        if not s.get('alts'):
            continue
        for kind, prm in s['alts']:
            cur = C.shapes[idx]
            snap0 = C.snapshot()
            r_old = C.r
            t = dict(cur)
            t['kind'] = kind
            t['prm'] = dict(prm)
            sh = C.shapes[:idx] + [t] + C.shapes[idx + 1:]
            e, svg, r = C.trial(sh)
            C.accept(sh, e, svg, r)
            lo0, ln0 = _local(r_old, C.r, img)
            if ln0 < 2.5 * lo0 + 5000:
                if kind == 'path':
                    path_bias(C, idx, lambda *a: None)
                else:
                    polish(C, idx, lambda *a: None, iters=3)
            loc_old, loc_new = _local(r_old, C.r, img)
            simpler = rank.get(kind, 0) < rank.get(cur['kind'], 0)
            if simpler:
                ok = loc_new <= loc_old * 1.15 + 3000
            else:
                ok = loc_new < loc_old * 0.85 - 3000
            log(f'  shape {idx} {cur["kind"]} vs {kind}: local sse {loc_old:.4g} -> {loc_new:.4g} {"ACCEPT" if ok else ""}')
            if not ok:
                C.restore(snap0)
    # 4. snapping to round numbers
    for idx in range(len(C.shapes)):
        snap(C, idx, log)
    # 4b. gradients: snap geometry to the shape, stops at round offsets
    refine_gradients(C, log)
    # 5. compound paths: same-colour traced paths (e.g. glyphs of one text run) become one <path> element
    merge_compound(C, log)
    punch_holes(C, log)
    log(f'verify: end sse {C.err:.4g}  ({C.rnd.n} renders)')
    return C.shapes, C.svg


def _local(r_old, r_new, img):
    ch = np.abs(r_old - r_new).max(-1) > 0
    if not ch.any():
        return 0.0, 0.0
    ch = ndi.binary_dilation(ch, iterations=2)
    return float(((r_old - img) ** 2).sum(-1)[ch].sum()), float(((r_new - img) ** 2).sum(-1)[ch].sum())


def _local_gain(r_old, r_new, img):
    d_old = ((r_old - img) ** 2).sum(-1)
    d_new = ((r_new - img) ** 2).sum(-1)
    ch = np.abs(r_old - r_new).max(-1) > 0
    if not ch.any():
        return 0.0
    a, b = d_old[ch].sum(), d_new[ch].sum()
    return float((a - b) / max(a, 1e-9))
