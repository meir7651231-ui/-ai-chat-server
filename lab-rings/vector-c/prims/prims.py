#!/usr/bin/env python3
"""prims: a primitive-understanding raster -> SVG vectorizer.

Pipeline
  1. segmentation: pixels that are anti-aliasing blends of their opposite neighbours are 'transition' pixels;
     the rest are joined into smooth regions (flat colour or gentle gradient).
  2. per region: hole analysis (holes that show the surrounding colour are see-through, others are filled because
     something lies on top), sub-pixel contour from an anti-aliasing coverage field (marching squares at 0.5).
  3. candidates: circle / ellipse / (rounded, rotated) rectangle / polygon / stroke (polyline or closed polygon with width)
     / Bezier path; robust least squares on reliable boundary points (points next to possible occluders are down-weighted).
  4. fills: flat, linear gradient or radial gradient with fitted stops.
  5. merge collinear pieces of the same colour that are split by occluders; z-order from overlap votes.
  6. render with Chromium, verify each primitive against its traced-path alternative, try stroke cap/join variants,
     patch big residual errors.
"""
import sys, os, json, math, subprocess, tempfile, time, argparse
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components, minimum_spanning_tree, dijkstra
from skimage import measure, morphology, draw
import geom as G
from geom import fmt, hexcol

HERE = os.path.dirname(os.path.abspath(__file__))
VERBOSE = False
PATH_ERR = float(os.environ.get("PATH_ERR", "0.3"))


def log(*a):
    if VERBOSE:
        print(*a, file=sys.stderr, flush=True)


# ============================================================================ renderer
sys.path.insert(0, os.path.join(HERE, '..', 'native'))
import render_api as RAPI


class NativeRenderer:
    """vec-c: candidate renders go to the native bit-exact rasterizer (render_api: Chromium fallback per
    render for features it does not emulate).  Same interface as the Chromium Renderer below."""
    def __init__(self):
        self.n = 0

    def render(self, svg, scale=1):
        self.n += 1
        return RAPI.render_rgb(svg, scale).astype(np.float32)

    def close(self):
        pass


class Renderer:
    def __init__(self):
        os.makedirs(os.path.join(HERE, 'tmp'), exist_ok=True)
        self.dir = tempfile.mkdtemp(prefix='r', dir=os.path.join(HERE, 'tmp'))
        self.p = subprocess.Popen(['node', os.path.join(HERE, 'rserver.mjs')], stdin=subprocess.PIPE,
                                  stdout=subprocess.PIPE, text=True, bufsize=1)
        self.n = 0

    def render(self, svg, scale=1):
        self.n += 1
        sp = os.path.join(self.dir, f's{self.n}.svg')
        op = sp + '.png'
        with open(sp, 'w') as f:
            f.write(svg)
        self.p.stdin.write(json.dumps({'svg': sp, 'out': op, 'scale': scale}) + '\n')
        self.p.stdin.flush()
        line = self.p.stdout.readline()
        if not line.startswith('ok'):
            raise RuntimeError('render failed: ' + line)
        a = np.asarray(Image.open(op).convert('RGB')).astype(np.float32)
        os.remove(sp); os.remove(op)
        return a

    def close(self):
        try:
            self.p.stdin.close(); self.p.wait(timeout=10)
        except Exception:
            self.p.kill()
        try:
            os.rmdir(self.dir)
        except OSError:
            pass


def metrics(a, b):
    d = np.abs(a - b)
    mx = d.max(-1)
    mse = float((d ** 2).mean())
    return dict(exact=float((mx == 0).mean() * 100), close=float((mx <= 24).mean() * 100),
                mae=float(d.mean()), psnr=99.0 if mse == 0 else 10 * math.log10(255 * 255 / mse))


# ============================================================================ segmentation
def shifted(a, dy, dx):
    H, W = a.shape[:2]
    ys = np.clip(np.arange(H) + dy, 0, H - 1)
    xs = np.clip(np.arange(W) + dx, 0, W - 1)
    return a[ys][:, xs]


def transition_mask(img, t_con=20.0):
    tr = np.zeros(img.shape[:2], bool)
    for dy, dx in [(0, 1), (1, 0), (1, 1), (1, -1)]:
        q1 = shifted(img, dy, dx); q2 = shifted(img, -dy, -dx)
        d = q1 - q2
        dd = (d * d).sum(-1)
        con = np.abs(d).max(-1)
        a = ((img - q2) * d).sum(-1) / np.maximum(dd, 1e-6)
        res = np.abs(img - (q2 + a[..., None] * d)).max(-1)
        tr |= (con >= t_con) & (a > 0.04) & (a < 0.96) & (res <= 0.12 * con + 4)
    return tr


def segment(img, t_join=7.0, min_size=3):
    H, W = img.shape[:2]
    tr = transition_mask(img)
    idx = np.arange(H * W).reshape(H, W)
    rs, cs = [], []
    dh = np.abs(img[:, 1:] - img[:, :-1]).max(-1)
    mh = (dh <= t_join) & ~tr[:, 1:] & ~tr[:, :-1]
    rs.append(idx[:, :-1][mh]); cs.append(idx[:, 1:][mh])
    dv = np.abs(img[1:] - img[:-1]).max(-1)
    mv = (dv <= t_join) & ~tr[1:] & ~tr[:-1]
    rs.append(idx[:-1][mv]); cs.append(idx[1:][mv])
    r = np.concatenate(rs); c = np.concatenate(cs)
    g = coo_matrix((np.ones(len(r), np.int8), (r, c)), shape=(H * W, H * W))
    n, lab = connected_components(g, directed=False)
    lab = lab.reshape(H, W)
    lab[tr] = -1
    sizes = np.bincount(lab[lab >= 0], minlength=n)
    keep = sizes >= min_size
    remap = -np.ones(n, int)
    remap[keep] = np.arange(keep.sum())
    lab = np.where(lab >= 0, remap[np.maximum(lab, 0)], -1)
    return lab


class Region:
    pass


def build_regions(img, lab):
    H, W = lab.shape
    objs = ndi.find_objects(lab + 1)
    regs = []
    border = np.zeros((H, W), bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    for k, sl in enumerate(objs):
        if sl is None:
            continue
        R = Region()
        R.id = k
        R.sl = sl
        m = lab[sl] == k
        R.area = int(m.sum())
        px = img[sl][m]
        R.color = np.median(px, 0)
        R.dev = float(np.percentile(np.abs(px - R.color).max(1), 90))
        R.border = int((border[sl] & m).sum())
        R.bbox = (sl[0].start, sl[1].start, sl[0].stop, sl[1].stop)
        regs.append(R)
    return {R.id: R for R in regs}


def merge_fragments(img, lab, regs, max_area=40):
    """Tiny regions with the same colour as a region within 2px are fragments of it (split by AA noise)."""
    H, W = lab.shape
    changed = False
    for R in sorted(regs.values(), key=lambda R: R.area):
        if R.area >= max_area or R.dev > 6:
            continue
        y0, x0, y1, x1 = crop_box(R.bbox, 3, H, W)
        labc = lab[y0:y1, x0:x1]
        m = labc == R.id
        ring = ndi.binary_dilation(m, np.ones((3, 3), bool), iterations=2) & ~m & (labc >= 0)
        best = None
        for v in np.unique(labc[ring]):
            Q = regs.get(int(v))
            if Q is None or Q.id == R.id or Q.dev > 6:
                continue
            if np.abs(Q.color - R.color).max() <= 8 and (best is None or Q.area > best.area):
                best = Q
        if best is not None:
            lab[lab == R.id] = best.id
            changed = True
            R.merged_into = best.id
    if changed:
        regs = build_regions(img, lab)
    return lab, regs


# ============================================================================ coverage / contours
def crop_box(bbox, pad, H, W):
    y0, x0, y1, x1 = bbox
    return max(0, y0 - pad), max(0, x0 - pad), min(H, y1 + pad), min(W, x1 + pad)


def alpha_field(imgc, labc, inside_pure, inner_src, c_reg=None, same_other=None):
    """Coverage of the shape whose labelled ('pure') pixels are inside_pure.  Unlabelled (anti-aliasing) pixels get
    the projection of their colour on the segment between the nearest inside colour (or the region colour when no
    pure pixel is near, e.g. thin glyph strokes) and the nearest outside colour, if the colour really is such a blend."""
    outside = (labc >= 0) & ~inside_pure
    if not outside.any():
        outside = ~inside_pure
    din, (iy, ix) = ndi.distance_transform_edt(~inner_src, return_indices=True)
    dout, (oy, ox) = ndi.distance_transform_edt(~outside, return_indices=True)
    dpin = ndi.distance_transform_edt(~inside_pure)
    c = imgc[iy, ix]
    if c_reg is not None:
        c = np.where((din > 2.5)[..., None], np.asarray(c_reg, float), c)
    n = imgc[oy, ox]
    d = c - n
    dd = (d * d).sum(-1)
    a = ((imgc - n) * d).sum(-1) / np.maximum(dd, 1e-6)
    a = np.clip(a, 0, 1)
    res = np.abs(imgc - (n + a[..., None] * d)).max(-1)
    good = (dd >= 64) & (res <= 14 + 0.06 * np.sqrt(dd))
    fallback = ((dpin < dout) & (dpin <= 1.5)).astype(float)
    a = np.where(good, a, fallback)
    a = np.where(dpin > 6, 0.0, a)
    if same_other is not None and same_other.any():
        dso = ndi.distance_transform_edt(~same_other)
        a = np.where(dso < din, 0.0, a)
    alpha = np.where(inside_pure, 1.0, np.where(outside, 0.0, a))
    # linearise partial coverage so that marching-squares interpolation between pixel centres hits the true edge
    # (exact for axis-aligned edges: edge at c - (alpha - .5))
    hi = (alpha > 0) & (alpha < 1) & (alpha >= 0.5)
    lo = (alpha > 0) & (alpha < 1) & (alpha < 0.5)
    alpha[hi] = 0.5 / (1.5 - alpha[hi])
    alpha[lo] = alpha[lo] / (0.5 + alpha[lo])
    return alpha, oy, ox


def extract_contours(alpha, oy, ox, labc, off, min_area=2.0):
    A = np.pad(alpha, 1)
    out = []
    h, w = alpha.shape
    for c in measure.find_contours(A, 0.5):
        if len(c) < 4:
            continue
        if np.allclose(c[0], c[-1]):
            c = c[:-1]
        rr = np.clip(np.round(c[:, 0] - 1).astype(int), 0, h - 1)
        cc = np.clip(np.round(c[:, 1] - 1).astype(int), 0, w - 1)
        nb = labc[oy[rr, cc], ox[rr, cc]]
        P = np.c_[c[:, 1] - 1 + off[1] + 0.5, c[:, 0] - 1 + off[0] + 0.5]
        ar = G.poly_area(P)
        if abs(ar) < min_area:
            continue
        out.append(dict(P=P, nb=nb, area=ar))
    return out


# ============================================================================ fills
def _pw_stops(t, C, tol=1.6, nb=None):
    """Piecewise-linear colour profile along t -> stops [(t, color)] with LS-refined colours."""
    t0, t1 = float(t.min()), float(t.max())
    if t1 - t0 < 1e-6:
        return [(t0, C.mean(0)), (t1 + 1, C.mean(0))]
    nb = nb or int(min(256, max(8, (t1 - t0))))
    bi = np.clip(((t - t0) / (t1 - t0) * nb).astype(int), 0, nb - 1)
    cnt = np.bincount(bi, minlength=nb)
    sums = np.stack([np.bincount(bi, C[:, k], minlength=nb) for k in range(3)], 1)
    ok = cnt > 0
    tb = (np.arange(nb) + 0.5) / nb * (t1 - t0) + t0
    tb, cb = tb[ok], sums[ok] / cnt[ok][:, None]
    tb[0], tb[-1] = t0, t1
    keep = {0, len(tb) - 1}
    stack = [(0, len(tb) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        f = (tb[i + 1:j] - tb[i]) / max(tb[j] - tb[i], 1e-9)
        pred = cb[i] + f[:, None] * (cb[j] - cb[i])
        e = np.abs(pred - cb[i + 1:j]).max(1)
        k = int(np.argmax(e))
        if e[k] > tol:
            keep.add(i + 1 + k)
            stack += [(i, i + 1 + k), (i + 1 + k, j)]
    ks = sorted(keep)
    ts = tb[ks]
    # least-squares colours at stop positions (hat basis)
    B = np.zeros((len(t), len(ts)))
    j = np.clip(np.searchsorted(ts, t, side='right') - 1, 0, len(ts) - 2)
    f = np.clip((t - ts[j]) / np.maximum(ts[j + 1] - ts[j], 1e-9), 0, 1)
    B[np.arange(len(t)), j] = 1 - f
    B[np.arange(len(t)), j + 1] = f
    cols = np.linalg.lstsq(B, C, rcond=None)[0]
    return [(float(a), np.clip(c, 0, 255)) for a, c in zip(ts, cols)]


def _eval_stops(stops, t):
    ts = np.array([s[0] for s in stops]); cs = np.array([s[1] for s in stops])
    return np.stack([np.interp(t, ts, cs[:, k]) for k in range(3)], 1)


def eval_fill(f, X, Y):
    if f['type'] == 'flat':
        return np.tile(f['c'], (len(X), 1))
    return _eval_stops(f['stops'], grad_t(f, X, Y))


def grad_t(f, X, Y):
    """Normalised gradient parameter (0..1 between the stops' geometric ends) at points X, Y."""
    if f['type'] == 'lin':
        dx, dy = f['x2'] - f['x1'], f['y2'] - f['y1']
        return ((X - f['x1']) * dx + (Y - f['y1']) * dy) / max(dx * dx + dy * dy, 1e-12)
    return np.hypot(X - f['cx'], Y - f['cy']) / f['r']


def fit_fill(img, ys, xs, extent=None):
    C = img[ys, xs]
    med = np.median(C, 0)
    dev = np.abs(C - med).max(1)
    if np.percentile(dev, 90) <= 4 or len(C) < 30:
        return dict(type='flat', c=med), float(np.sqrt(((C - med) ** 2).mean()))
    X = xs + 0.5; Y = ys + 0.5
    rng = np.random.default_rng(0)
    sub = rng.choice(len(C), min(len(C), 6000), replace=False)
    # linear
    A = np.c_[np.ones(len(X)), X, Y]
    coef = np.linalg.lstsq(A[sub], C[sub], rcond=None)[0]
    J = coef[1:].T
    U, S, Vt = np.linalg.svd(J)
    d = Vt[0]
    if abs(d[0]) > abs(d[1]):
        d = d * np.sign(d[0])
    else:
        d = d * np.sign(d[1])
    t = X * d[0] + Y * d[1]
    st = _pw_stops(t[sub], C[sub])
    e_lin = float(np.sqrt(((_eval_stops(st, t) - C) ** 2).mean()))
    t0, t1 = st[0][0], st[-1][0]
    span = max(t1 - t0, 1e-9)
    lin = dict(type='lin', x1=d[0] * t0, y1=d[1] * t0, x2=d[0] * t1, y2=d[1] * t1,
               stops=[((t - t0) / span, c) for t, c in st], d=d)
    # radial: optimise centre
    from scipy.optimize import least_squares
    Xs, Ys, Cs = X[sub], Y[sub], C[sub]

    def res(p):
        r = np.hypot(Xs - p[0], Ys - p[1])
        rn = r / (r.max() + 1e-9)
        B = np.c_[np.ones(len(r)), rn, rn ** 2, rn ** 3, rn ** 4]
        cf = np.linalg.lstsq(B, Cs, rcond=None)[0]
        return (B @ cf - Cs).ravel()

    best = None
    cx0, cy0 = X.mean(), Y.mean()
    for (ix, iy) in [(cx0, cy0)]:
        o = least_squares(res, [ix, iy], x_scale=10.0, diff_step=1e-3)
        if best is None or o.cost < best.cost:
            best = o
    cx, cy = best.x
    r = np.hypot(X - cx, Y - cy)
    if extent is not None:
        R = extent
    else:
        R = float(r.max())
    st_r = _pw_stops(r[sub] / R, C[sub])
    e_rad = float(np.sqrt(((_eval_stops(st_r, r / R) - C) ** 2).mean()))
    rad = dict(type='rad', cx=cx, cy=cy, r=R, stops=st_r)
    e_flat = float(np.sqrt(((C - med) ** 2).mean()))
    log(f'   fill: flat {e_flat:.2f} lin {e_lin:.2f}({len(st)}) rad {e_rad:.2f}({len(st_r)})')
    lin['_samples'] = rad['_samples'] = (Xs, Ys, Cs)
    if e_flat <= min(e_lin, e_rad) + 0.3:
        return dict(type='flat', c=med), e_flat
    if e_lin <= e_rad + 0.3:
        return lin, e_lin
    return rad, e_rad


# ============================================================================ shapes
PARAMS = dict(circle=3, rect=4, rrect=5, ellipse=5, rellipse=5, rot_rect=5, rot_rrect=6)


def moments_init(Pts):
    c = Pts.mean(0)
    C = np.cov((Pts - c).T)
    ev, evec = np.linalg.eigh(C)
    th = math.atan2(evec[1, 1], evec[0, 1])
    return c, ev, th


def fit_filled_primitives(P, w, filled_xy):
    """P: contour points (N,2), w: weights; filled_xy: pixel centres of the filled mask (for moments)."""
    rel = w >= 0.5
    if rel.sum() < 0.35 * len(w) or rel.sum() < 12:
        return []
    cands = []

    def add(name, prm, res, npar):
        rr = res[rel]
        rms, p95, mx = G._stats(rr)
        cands.append(dict(name=name, prm=prm, rms=rms, p95=p95, npar=npar))

    try:
        prm, res = G.fit_circle(P, w)
        add('circle', prm, res, 3)
    except Exception as e:
        log('circle fail', e)
    c, ev, th = moments_init(filled_xy)
    a, b = 2 * math.sqrt(max(ev[1], 1e-6)), 2 * math.sqrt(max(ev[0], 1e-6))
    try:
        prm, res = G.fit_ellipse(P, w, (c[0], c[1], a, b, th))
        np_ = 4 if abs(math.degrees(prm['th'])) < 0.5 or abs(abs(math.degrees(prm['th'])) - 90) < 0.5 else 5
        add('ellipse', prm, res, np_)
    except Exception as e:
        log('ellipse fail', e)
    Q = P[rel]
    x0, x1 = np.percentile(Q[:, 0], [0.5, 99.5]); y0, y1 = np.percentile(Q[:, 1], [0.5, 99.5])
    init = ((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, 0.0, 0.0)
    try:
        prm, res = G.fit_rrect(P, w, init, rounded=False)
        add('rect', prm, res, 4)
        prm, res = G.fit_rrect(P, w, (*init[:4], 0.15 * min(init[2], init[3]), 0.0), rounded=True)
        add('rrect', prm, res, 5)
    except Exception as e:
        log('rect fail', e)
    # rotated rects
    thr = th
    Qr = G.rot(Q - c, thr)
    hx = (np.percentile(Qr[:, 0], 99.5) - np.percentile(Qr[:, 0], 0.5)) / 2
    hy = (np.percentile(Qr[:, 1], 99.5) - np.percentile(Qr[:, 1], 0.5)) / 2
    if abs(math.sin(2 * thr)) > 0.05:
        try:
            prm, res = G.fit_rrect(P, w, (c[0], c[1], hx, hy, 0, thr), rounded=False, rotated=True)
            add('rot_rect', prm, res, 5)
            prm, res = G.fit_rrect(P, w, (c[0], c[1], hx, hy, 0.15 * min(hx, hy), thr), rounded=True, rotated=True)
            add('rot_rrect', prm, res, 6)
        except Exception as e:
            log('rrect fail', e)
    # polygon
    try:
        V = G.dp_simplify(P, 1.5, True)
        V = G.remove_collinear(V, True, 10.0, 0.0)
        if 3 <= len(V) <= 8:
            V, d = G.refine_polygon(P, w, V)
            V = G.remove_collinear(V, True, 12.0, 0.0)
            if len(V) >= 3:
                d, _ = G.polyline_dist(P, V, True)
                add('polygon', dict(kind='polygon', V=V), d, 2 * len(V))
                cands[-1]['rms'] *= 2.0  # stricter acceptance for polygons (rounded corners must not pass)
                cands[-1]['p95'] *= 2.0
    except Exception as e:
        log('poly fail', e)
    return cands


def choose(cands, rms_t=0.3, p95_t=0.75):
    ok = [c for c in cands if c['rms'] <= rms_t and c['p95'] <= p95_t]
    if not ok:
        return None
    ok.sort(key=lambda c: (c['npar'], c['rms']))
    return ok[0]


def prune_skeleton(sk, k):
    sk = sk.copy()
    K = np.ones((3, 3), int); K[1, 1] = 0
    for _ in range(k):
        nb = ndi.convolve(sk.astype(int), K, mode='constant')
        end = sk & (nb <= 1)
        if not end.any():
            break
        sk &= ~end
    return sk


def centerline(mask, area):
    sk = morphology.skeletonize(mask)
    n0 = int(sk.sum())
    if n0 < 4:
        return None
    wid = area / n0
    sk = prune_skeleton(sk, int(math.ceil(wid / 2)) + 1)
    K = np.ones((3, 3), int); K[1, 1] = 0
    nbc = ndi.convolve(sk.astype(int), K, mode='constant')
    loop = bool(sk.any()) and not (sk & (nbc <= 1)).any()
    ys, xs = np.nonzero(sk)
    n = len(ys)
    if n < 4:
        return None
    idm = -np.ones(mask.shape, int)
    idm[ys, xs] = np.arange(n)
    r, c, wt = [], [], []
    H, W = mask.shape
    for dy, dx, ww in [(0, 1, 1.0), (1, 0, 1.0), (1, 1, 1.4142), (1, -1, 1.4142)]:
        yy, xx = ys + dy, xs + dx
        ok = (yy >= 0) & (yy < H) & (xx >= 0) & (xx < W)
        nb = np.full(n, -1)
        nb[ok] = idm[yy[ok], xx[ok]]
        m = nb >= 0
        r.append(np.arange(n)[m]); c.append(nb[m]); wt.append(np.full(m.sum(), ww))
    r = np.concatenate(r); c = np.concatenate(c); wt = np.concatenate(wt)
    Gm = coo_matrix((wt, (r, c)), shape=(n, n)).tocsr()
    ncomp, cl = connected_components(Gm, directed=False)
    if ncomp > 1:
        big = np.argmax(np.bincount(cl))
        sel = np.where(cl == big)[0]
        Gm = Gm[sel][:, sel]
        ys, xs = ys[sel], xs[sel]
        n = len(sel)
    T = minimum_spanning_tree(Gm)
    total = T.sum()
    d0 = dijkstra(T, directed=False, indices=0)
    u = int(np.argmax(np.where(np.isfinite(d0), d0, -1)))
    du, pred = dijkstra(T, directed=False, indices=u, return_predecessors=True)
    v = int(np.argmax(np.where(np.isfinite(du), du, -1)))
    path = [v]
    while path[-1] != u:
        path.append(pred[path[-1]])
        if path[-1] < 0:
            return None
    path = path[::-1]
    pts = np.c_[xs[path] + 0.5, ys[path] + 0.5].astype(float)
    plen = du[v]
    closed = loop and math.hypot(xs[u] - xs[v], ys[u] - ys[v]) <= 2.0 and plen > 10
    return pts, closed, float(plen), float(total)


def try_stroke(alpha, off, P, w, rel_extra=None):
    """Thin-shape test and stroke fit. alpha is the coverage crop; P/w contour points (all contours)."""
    m = alpha >= 0.5
    area = float(alpha[alpha > 0.02].sum())
    cl = centerline(m, area)
    if cl is None:
        return None
    pts, closed, plen, total = cl
    if plen < 0.8 * total:
        return None
    hole = ndi.binary_fill_holes(m) & ~m
    if not closed and hole.sum() > 4 and math.hypot(*(pts[0] - pts[-1])) < 3 * area / max(plen, 1) + 3:
        closed = True
    L = plen + (0 if closed else 0)
    wid = area / max(L, 1)
    if wid > 0.25 * L or wid > 60:
        return None
    dt = ndi.distance_transform_edt(m)
    pts = pts + [off[1], off[0]]
    tol = max(0.8, 0.06 * wid)
    V = G.dp_simplify(pts, tol, True) if closed else G._dp(pts, tol)
    V = G.remove_collinear(V, closed, 6.0, 0.0)
    if (closed and len(V) < 3) or len(V) < 2 or len(V) > 12:
        return None
    try:
        VV, hw, res = G.simplify_stroke(P, w, V, wid / 2, closed)
    except Exception as e:
        log('stroke fail', e)
        return None
    # stats on reliable, non-end points
    rel = w >= 0.5
    if not closed:
        a, b = VV[0], VV[1]
        e1 = ((P - a) @ (a - b)) > -0.5
        a, b = VV[-1], VV[-2]
        e2 = ((P - a) @ (a - b)) > -0.5
        rel = rel & ~e1 & ~e2
    if rel.sum() < 10:
        return None
    rms, p95, mx = G._stats(res[rel])
    return dict(name='stroke', prm=dict(kind='stroke', V=VV, hw=hw, closed=closed, cap='round', join='round'),
                rms=rms, p95=p95, npar=2 * len(VV) + 1)


# ============================================================================ the engine
class Engine:
    def __init__(self, img):
        self.img = img
        self.H, self.W = img.shape[:2]

    def run(self, rnd):
        t0 = time.time()
        img = self.img
        H, W = self.H, self.W
        lab = segment(img)
        self.lab = lab
        regs = build_regions(img, lab)
        lab, regs = merge_fragments(img, lab, regs)
        self.lab = lab
        self.regs = regs
        log(f'segmentation: {len(regs)} regions, {(lab < 0).mean() * 100:.1f}% transition  ({time.time() - t0:.1f}s)')
        bg = max(regs.values(), key=lambda R: (R.border, R.area))
        self.bg = bg
        ys, xs = np.nonzero(lab == bg.id)
        self.bg_fill, _ = fit_fill(img, ys, xs)
        if self.bg_fill['type'] != 'flat':
            self.bg_fill = self._grad_extent_full(self.bg_fill)
        # ---- hole / containment analysis
        info = {}
        for R in regs.values():
            if R.id == bg.id:
                continue
            info[R.id] = self.hole_info(R)
        depth = {k: 0 for k in info}
        for k, inf in info.items():
            for h in inf['holes']:
                for j in h['labels']:
                    if j in depth:
                        depth[j] += 1
        order = sorted(info, key=lambda k: (depth[k], -regs[k].area))
        absorbed = set()
        for k in info:
            R = regs[k]
            if depth[k] == 0 and self.matches_bg(R):
                absorbed.add(k)
                log(f'region {k}: background showing through -> absorbed')
            elif self.is_blend(R, info[k]):
                absorbed.add(k)
                log(f'region {k}: anti-aliasing sliver -> dropped')
        shapes = []
        for k in order:
            if k in absorbed:
                continue
            R = regs[k]
            if R.area < 3:
                continue
            sh = self.analyze(R, info[k], absorbed)
            if sh:
                shapes.append(sh)
        self.shapes = shapes
        log(f'analysis done: {len(shapes)} shapes ({time.time() - t0:.1f}s)')
        self.merge_aligned()
        self.merge_same_color()
        self.zorder()
        return self.shapes

    # ------------------------------------------------------------------ region tests
    def matches_bg(self, R):
        f = self.bg_fill
        if f['type'] == 'flat':
            return np.abs(R.color - f['c']).max() < 8 and R.dev < 6
        ys, xs = np.nonzero(self.lab[R.sl] == R.id)
        ys = ys + R.sl[0].start; xs = xs + R.sl[1].start
        pred = eval_fill(f, xs + 0.5, ys + 0.5)
        return float(np.abs(pred - self.img[ys, xs]).mean()) < 5

    def is_blend(self, R, inf):
        """An anti-aliasing sliver: thin, and (most of) its pixels are blends of the pure pixels on opposite sides."""
        m = inf['m']
        dtm = ndi.distance_transform_edt(np.pad(m, 1)).max()
        if dtm > 1.6 or (R.area >= 40 and dtm > 1.0):
            return False
        ys, xs = np.nonzero(self.lab[R.sl] == R.id)
        ys = ys + R.sl[0].start; xs = xs + R.sl[1].start
        img, lab = self.img, self.lab
        H, W = lab.shape
        ok = np.zeros(len(ys), bool)
        p = img[ys, xs]
        for dy, dx in [(0, 1), (1, 0), (1, 1), (1, -1)]:
            for k in (1, 2):
                y1 = np.clip(ys + k * dy, 0, H - 1); x1 = np.clip(xs + k * dx, 0, W - 1)
                y2 = np.clip(ys - k * dy, 0, H - 1); x2 = np.clip(xs - k * dx, 0, W - 1)
                l1, l2 = lab[y1, x1], lab[y2, x2]
                q1, q2 = img[y1, x1], img[y2, x2]
                d = q1 - q2
                dd = (d * d).sum(-1)
                a = ((p - q2) * d).sum(-1) / np.maximum(dd, 1e-6)
                res = np.abs(p - (q2 + a[:, None] * d)).max(-1)
                good = (l1 >= 0) & (l2 >= 0) & (l1 != R.id) & (l2 != R.id) & (l1 != l2) & \
                       (np.abs(d).max(-1) >= 20) & (a > 0.02) & (a < 0.98) & (res <= 10)
                ok |= good
        return ok.mean() >= 0.6

    # ------------------------------------------------------------------ holes
    def hole_info(self, R):
        lab, img = self.lab, self.img
        y0, x0, y1, x1 = crop_box(R.bbox, 6, self.H, self.W)
        labc = lab[y0:y1, x0:x1]
        m = labc == R.id
        unl = labc < 0
        ext = m | (unl & ndi.binary_dilation(m, np.ones((3, 3), bool)))
        filled = ndi.binary_fill_holes(ext)
        ring = ndi.binary_dilation(filled, np.ones((3, 3), bool), iterations=2) & ~filled
        rl = labc[ring & (labc >= 0)]
        if len(rl):
            sur = int(np.bincount(rl).argmax())
            surc = np.median(img[y0:y1, x0:x1][ring & (labc == sur)], 0)
        else:
            sur = self.bg.id
            surc = self.regs[sur].color
        hl, nh = ndi.label(filled & ~ext)
        holes = []
        for h in range(1, nh + 1):
            hm = hl == h
            L = labc[hm & (labc >= 0)]
            if len(L) == 0:
                holes.append(dict(mask=hm, labels=set(), see=False, ignorable=True))
                continue
            cnt = np.bincount(L)
            maj = int(cnt.argmax())
            col = np.median(img[y0:y1, x0:x1][hm & (labc == maj)], 0)
            see = (np.abs(col - surc).max() < 14) and (np.abs(col - R.color).max() > 14)
            holes.append(dict(mask=hm, labels=set(int(v) for v in np.unique(L)), see=see, maj=maj, col=col,
                              ignorable=False))
        return dict(off=(y0, x0), m=m, ext=ext, filled=filled, sur=sur, surc=surc, holes=holes)

    def weights(self, nb, sur, surc, P):
        regs = self.regs
        w = np.full(len(nb), 0.1)
        for v in np.unique(nb):
            if v < 0:
                continue
            if v == sur or v == self.bg.id or np.abs(regs[v].color - surc).max() < 14:
                w[nb == v] = 1.0
        # image border points are not real edges
        bd = (P[:, 0] < 0.75) | (P[:, 1] < 0.75) | (P[:, 0] > self.W - 0.75) | (P[:, 1] > self.H - 0.75)
        w[bd] = 0.0
        return w

    # ------------------------------------------------------------------ per region
    def analyze(self, R, inf, absorbed):
        img, lab = self.img, self.lab
        y0, x0 = inf['off']
        m, ext, filled = inf['m'], inf['ext'], inf['filled']
        h, w_ = m.shape
        imgc = img[y0:y0 + h, x0:x0 + w_]
        labc = lab[y0:y0 + h, x0:x0 + w_]
        sur, surc = inf['sur'], inf['surc']
        see_holes = [hh for hh in inf['holes'] if hh['see']]
        log(f'region {R.id}: area {R.area} color {hexcol(R.color)} bbox {R.bbox} holes {len(inf["holes"])} see {len(see_holes)}')

        # fill model from region pixels
        ys, xs = np.nonzero(m)
        fill, ferr = fit_fill(img, ys + y0, xs + x0)

        # filled interpretation
        inside_f = m | (filled & ~ext & (labc >= 0))
        same_other = (labc >= 0) & (labc != R.id)
        if same_other.any():
            colmap = {v: self.regs[v].color for v in np.unique(labc[same_other]) if v in self.regs}
            so = np.zeros_like(same_other)
            for v, col in colmap.items():
                if np.abs(col - R.color).max() <= 8:
                    so |= labc == v
            same_other = so
        alpha_f, oy, ox = alpha_field(imgc, labc, inside_f, m, R.color, same_other)
        cf = extract_contours(alpha_f, oy, ox, labc, (y0, x0))
        if not cf:
            return None
        outer = max(cf, key=lambda c: abs(c['area']))
        P = outer['P']
        wts = self.weights(outer['nb'], sur, surc, P)
        fy, fx = np.nonzero(filled)
        fxy = np.c_[fx + x0 + 0.5, fy + y0 + 0.5]
        cands = fit_filled_primitives(P, wts, fxy)
        best = choose(cands)
        for c in sorted(cands, key=lambda c: c['rms']):
            log(f'   cand {c["name"]:9s} rms {c["rms"]:.3f} p95 {c["p95"]:.3f} npar {c["npar"]}')

        # see-through (ring) interpretation
        ring_alpha = None
        if see_holes:
            inside = m.copy()
            for hh in inf['holes']:
                if not hh['see']:
                    inside |= hh['mask'] & (labc >= 0)
            ring_alpha, roy, rox = alpha_field(imgc, labc, inside, m, R.color, same_other)
            cr = extract_contours(ring_alpha, roy, rox, labc, (y0, x0))
        else:
            cr = cf
            ring_alpha = alpha_f
            roy, rox = oy, ox
        # stroke candidate
        allP = np.vstack([c['P'] for c in cr])
        allnb = np.concatenate([c['nb'] for c in cr])
        allw = self.weights(allnb, sur, surc, allP)
        st = try_stroke(ring_alpha, (y0, x0), allP, allw)
        if st:
            log(f'   cand stroke    rms {st["rms"]:.3f} p95 {st["p95"]:.3f} npar {st["npar"]} closed {st["prm"]["closed"]}')
        stroke_ok = st is not None and st['rms'] <= 0.2 and st['p95'] <= 0.5

        shape = dict(fill=fill, regions={R.id}, color=R.color, area=R.area, sur=sur, surc=surc, fitP=P, fitw=wts,
                     filled_xy=fxy)
        # ---- decide interpretation and main representation; keep alternatives for render verification
        strong_prim = best is not None and (best['name'] != 'polygon' or best['rms'] <= 0.2)
        if see_holes and not (strong_prim and not (stroke_ok and st['npar'] < best['npar'])):
            interp = 'see'
        else:
            interp = 'filled'
        alts = []
        if interp == 'see':
            for hh in see_holes:
                for j in hh['labels']:
                    if np.abs(self.regs[j].color - surc).max() < 14:
                        absorbed.add(j)
            path_prm = dict(kind='path', contours=[c['P'] for c in cr])
            if stroke_ok:
                shape.update(kind='stroke', prm=st['prm'])
            else:
                shape.update(kind='path', prm=path_prm)
            if st is not None and st['rms'] <= 0.6 and shape['kind'] != 'stroke':
                alts.append(('stroke', st['prm']))
            mask = np.zeros((self.H, self.W), bool)
            mask[y0:y0 + h, x0:x0 + w_] = ring_alpha >= 0.5
        else:
            path_prm = dict(kind='path', contours=[c['P'] for c in cf if c['area'] * outer['area'] > 0 or abs(c['area']) >= 4])
            if stroke_ok and (best is None or st['npar'] < best['npar']):
                shape.update(kind='stroke', prm=st['prm'])
            elif best is not None:
                shape.update(kind=best['name'], prm=best['prm'])
            else:
                shape.update(kind='path', prm=path_prm)
            loose = [c for c in cands if c['rms'] <= 0.6 and c['p95'] <= 1.5 and c is not best]
            if loose and shape['kind'] == 'path':
                lb = min(loose, key=lambda c: c['rms'])
                alts.append((lb['name'], lb['prm']))
            if st is not None and st['rms'] <= 0.6 and shape['kind'] != 'stroke':
                alts.append(('stroke', st['prm']))
            mask = np.zeros((self.H, self.W), bool)
            mask[y0:y0 + h, x0:x0 + w_] = alpha_f >= 0.5
        if shape['kind'] != 'path':
            alts.append(('path', path_prm))
        shape['alts'] = alts
        shape['pmask'] = mask
        return shape

    def _grad_extent_full(self, fill):
        return fill

    # ------------------------------------------------------------------ merging
    def merge_aligned(self):
        """Merge same-colour rect/stroke pieces that are collinear and separated only by other shapes."""
        sh = self.shapes
        changed = True
        while changed:
            changed = False
            for i in range(len(sh)):
                for j in range(i + 1, len(sh)):
                    a, b = sh[i], sh[j]
                    if a['fill']['type'] != 'flat' or b['fill']['type'] != 'flat':
                        continue
                    if np.abs(a['fill']['c'] - b['fill']['c']).max() > 8:
                        continue
                    m = self._try_merge(a, b)
                    if m is not None:
                        sh[i] = m
                        del sh[j]
                        changed = True
                        break
                if changed:
                    break

    def merge_same_color(self):
        """Same-colour pieces of one primitive split by an occluder (e.g. a bar cut by a line): fit one primitive to
        the union of their reliable boundary points; accept if it fits and does not cover visible background."""
        sh = self.shapes
        changed = True
        while changed:
            changed = False
            for i in range(len(sh)):
                for j in range(len(sh)):
                    if i == j:
                        continue
                    a, b = sh[i], sh[j]
                    if a['fill']['type'] != 'flat' or b['fill']['type'] != 'flat' or 'fitP' not in a or 'fitP' not in b:
                        continue
                    if a['kind'] in ('path', 'stroke') and b['kind'] in ('path', 'stroke'):
                        continue
                    if np.abs(a['fill']['c'] - b['fill']['c']).max() > 8 or a['area'] < b['area']:
                        continue
                    ba, bb = a['pmask'], b['pmask']
                    ya, xa = np.nonzero(ba); yb, xb = np.nonzero(bb)
                    if len(ya) == 0 or len(yb) == 0:
                        continue
                    gap = 12
                    if xb.min() > xa.max() + gap or xa.min() > xb.max() + gap or yb.min() > ya.max() + gap or ya.min() > yb.max() + gap:
                        continue
                    m = self._union_fit(a, b)
                    if m is not None:
                        sh[i] = m
                        del sh[j]
                        changed = True
                        break
                if changed:
                    break

    def _union_fit(self, a, b):
        P = np.vstack([a['fitP'], b['fitP']])
        w = np.r_[a['fitw'], b['fitw']]
        fxy = np.vstack([a['filled_xy'], b['filled_xy']])
        cands = fit_filled_primitives(P, w, fxy)
        best = choose(cands)
        if best is None:
            return None
        m = dict(a)
        m['kind'] = best['name']; m['prm'] = best['prm']
        m['regions'] = a['regions'] | b['regions']
        m['area'] = a['area'] + b['area']
        m['fitP'] = P; m['fitw'] = w; m['filled_xy'] = fxy
        rm = self.raster(m)
        L = self.lab[rm]
        bad = 0
        for v in np.unique(L):
            if v < 0 or v in m['regions']:
                continue
            Q = self.regs[v]
            if v == a['sur'] or v == self.bg.id or np.abs(Q.color - a['surc']).max() < 14:
                bad += int((L == v).sum())
        if bad > max(6, 0.004 * rm.sum()):
            log(f'   union fit {best["name"]} rejected: covers {bad} visible background px')
            return None
        m['pmask'] = a['pmask'] | b['pmask']
        m['alts'] = []
        log(f'   merged two {hexcol(a["color"])} pieces -> {best["name"]} rms {best["rms"]:.3f}')
        return m

    def _seg_of(self, s):
        """Return (p0, p1, half-width) if the shape is a straight thin bar (rect or 2-point stroke)."""
        if s['kind'] == 'rect' and s['prm'].get('th', 0) == 0 and s['prm']['r'] < 0.5:
            p = s['prm']
            if p['hy'] <= p['hx']:
                return np.array([p['cx'] - p['hx'], p['cy']]), np.array([p['cx'] + p['hx'], p['cy']]), p['hy'], 'butt'
            return np.array([p['cx'], p['cy'] - p['hy']]), np.array([p['cx'], p['cy'] + p['hy']]), p['hx'], 'butt'
        if s['kind'] == 'stroke' and len(s['prm']['V']) == 2 and not s['prm']['closed']:
            V = s['prm']['V']
            return V[0], V[1], s['prm']['hw'], s['prm']['cap']
        return None

    def _try_merge(self, a, b):
        sa, sb = self._seg_of(a), self._seg_of(b)
        if sa is None or sb is None:
            return None
        (a0, a1, ha, ca), (b0, b1, hb, cb) = sa, sb
        log(f'      try merge {a["kind"]} {a0} {a1} {ha:.2f} + {b["kind"]} {b0} {b1} {hb:.2f}')
        if abs(ha - hb) > 0.6:
            return None
        da = G._unit(a1 - a0); db = G._unit(b1 - b0)
        if abs(da[0] * db[1] - da[1] * db[0]) > 0.02:
            return None
        nrm = np.array([-da[1], da[0]])
        if abs((b0 - a0) @ nrm) > 0.6 or abs((b1 - a0) @ nrm) > 0.6:
            return None
        ts = [0, (a1 - a0) @ da, (b0 - a0) @ da, (b1 - a0) @ da]
        lo, hi = min(ts), max(ts)
        # gap must be occluded by other (non-surround) regions
        ia = sorted([0, (a1 - a0) @ da]); ib = sorted([(b0 - a0) @ da, (b1 - a0) @ da])
        g0, g1 = (ia[1], ib[0]) if ia[1] <= ib[0] else (ib[1], ia[0])
        if g1 > g0:
            tt = np.arange(g0 + 1, g1 - 1, 1.0)
            if len(tt):
                Q = a0 + tt[:, None] * da
                yy = np.clip(Q[:, 1].astype(int), 0, self.H - 1); xx = np.clip(Q[:, 0].astype(int), 0, self.W - 1)
                L = self.lab[yy, xx]
                bad = 0
                for v in L:
                    if v < 0:
                        continue
                    if v == a['sur'] or v == self.bg.id or v in a['regions'] or v in b['regions']:
                        bad += 1
                if bad > 0.1 * len(tt):
                    return None
        p0 = a0 + lo * da; p1 = a0 + hi * da
        hw = (ha * a['area'] + hb * b['area']) / (a['area'] + b['area'])
        m = dict(a)
        m['kind'] = 'stroke'
        m['prm'] = dict(kind='stroke', V=np.array([p0, p1]), hw=hw, closed=False, cap='butt' if ca == 'butt' else ca, join='round')
        m['regions'] = a['regions'] | b['regions']
        m['area'] = a['area'] + b['area']
        m['pmask'] = a['pmask'] | b['pmask'] | self.raster(m)
        m['alts'] = []
        m['merged'] = m.get('merged', 1) + b.get('merged', 1)
        log(f'   merged pieces -> line {p0} {p1} hw {hw:.2f}')
        return m

    # ------------------------------------------------------------------ raster of a shape (pixel centres)
    def raster(self, s):
        H, W = self.H, self.W
        p = s['prm']
        k = s['kind']
        yy, xx = np.mgrid[0:H, 0:W]
        if k == 'path':
            return s['pmask']
        if k == 'polygon':
            V = p['V']
            return draw.polygon2mask((H, W), np.c_[V[:, 1] - 0.5, V[:, 0] - 0.5])
        P = np.c_[xx.ravel() + 0.5, yy.ravel() + 0.5]
        if k == 'circle':
            d = np.hypot(P[:, 0] - p['cx'], P[:, 1] - p['cy']) - p['r']
        elif k == 'ellipse':
            d = G.sdf_ellipse_approx(P, p['cx'], p['cy'], p['rx'], p['ry'], p['th'])
        elif k in ('rect', 'rrect', 'rot_rect', 'rot_rrect'):
            d = G.sdf_rrect(P, p['cx'], p['cy'], p['hx'], p['hy'], p['r'], p['th'])
        elif k == 'stroke':
            d, _ = G.polyline_dist(P, p['V'], p['closed'])
            d = d - p['hw']
        else:
            return s['pmask']
        return (d <= 0).reshape(H, W)

    # ------------------------------------------------------------------ z-order
    def zorder(self):
        sh = self.shapes
        n = len(sh)
        masks = []
        for s in sh:
            mk = self.raster(s) if s['kind'] != 'path' else s['pmask']
            s['rmask'] = mk
            masks.append(mk)
        lab = self.lab
        above = np.zeros((n, n))
        for i in range(n):
            for j in range(i + 1, n):
                ov = masks[i] & masks[j]
                if ov.sum() < 3:
                    continue
                L = lab[ov]
                vi = np.isin(L, list(sh[i]['regions'])).sum()
                vj = np.isin(L, list(sh[j]['regions'])).sum()
                above[i, j] = vi; above[j, i] = vj
                log(f'   z: {i}:{sh[i]["kind"]}{hexcol(sh[i]["color"])} vs {j}:{sh[j]["kind"]}{hexcol(sh[j]["color"])} ov {ov.sum()} votes {vi} {vj}')
        # edges: i above j if above[i,j] > above[j,i]
        indeg = np.zeros(n)
        succ = {i: [] for i in range(n)}
        for i in range(n):
            for j in range(n):
                if i != j and above[i, j] > above[j, i] and above[i, j] >= 3:
                    succ[j].append(i)  # j below i
                    indeg[i] += 1
        done = []
        avail = set(range(n))
        while avail:
            ready = [i for i in avail if indeg[i] == 0]
            if not ready:
                ready = [min(avail, key=lambda i: indeg[i])]
            k = max(ready, key=lambda i: sh[i]['rmask'].sum())
            done.append(k)
            avail.remove(k)
            for v in succ[k]:
                indeg[v] -= 1
        self.shapes = [sh[i] for i in done]


# ============================================================================ SVG output
def grad_def(fill, gid, nd=2):
    st = fill['stops']
    stops = ''.join(f'<stop offset="{fmt(t, 3)}" stop-color="{hexcol(c)}"/>' for t, c in st)
    if fill['type'] == 'lin':
        return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{fmt(fill["x1"])}" y1="{fmt(fill["y1"])}" '
                f'x2="{fmt(fill["x2"])}" y2="{fmt(fill["y2"])}">{stops}</linearGradient>')
    return (f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{fmt(fill["cx"])}" '
            f'cy="{fmt(fill["cy"])}" r="{fmt(fill["r"])}">{stops}</radialGradient>')


def shape_svg(s, paint):
    k = s['kind']; p = s['prm']
    if k == 'circle':
        return f'<circle cx="{fmt(p["cx"])}" cy="{fmt(p["cy"])}" r="{fmt(p["r"])}" fill="{paint}"/>'
    if k == 'ellipse':
        deg = math.degrees(p['th'])
        tr = '' if abs(deg) < 0.05 else f' transform="rotate({fmt(deg, 2)} {fmt(p["cx"])} {fmt(p["cy"])})"'
        return f'<ellipse cx="{fmt(p["cx"])}" cy="{fmt(p["cy"])}" rx="{fmt(p["rx"])}" ry="{fmt(p["ry"])}"{tr} fill="{paint}"/>'
    if k in ('rect', 'rrect', 'rot_rect', 'rot_rrect'):
        deg = (math.degrees(p['th']) + 90) % 180 - 90   # a rectangle is symmetric under 180 deg rotation
        tr = '' if abs(deg) < 0.05 else f' transform="rotate({fmt(deg, 2)} {fmt(p["cx"])} {fmt(p["cy"])})"'
        rx = f' rx="{fmt(p["r"])}"' if p['r'] > 0.05 else ''
        return (f'<rect x="{fmt(p["cx"] - p["hx"])}" y="{fmt(p["cy"] - p["hy"])}" width="{fmt(2 * p["hx"])}" '
                f'height="{fmt(2 * p["hy"])}"{rx}{tr} fill="{paint}"/>')
    if k == 'polygon':
        pts = ' '.join(f'{fmt(x)},{fmt(y)}' for x, y in p['V'])
        return f'<polygon points="{pts}" fill="{paint}"/>'
    if k == 'stroke':
        V = p['V']
        sw = fmt(2 * p['hw'])
        cap = '' if p['cap'] == 'butt' else f' stroke-linecap="{p["cap"]}"'
        join = '' if p['join'] == 'miter' else f' stroke-linejoin="{p["join"]}"'
        if len(V) == 2 and not p['closed']:
            return (f'<line x1="{fmt(V[0][0])}" y1="{fmt(V[0][1])}" x2="{fmt(V[1][0])}" y2="{fmt(V[1][1])}" '
                    f'stroke="{paint}" stroke-width="{sw}"{cap}/>')
        pts = ' '.join(f'{fmt(x)},{fmt(y)}' for x, y in V)
        tag = 'polygon' if p['closed'] else 'polyline'
        return f'<{tag} points="{pts}" fill="none" stroke="{paint}" stroke-width="{sw}"{cap if not p["closed"] else ""}{join}/>'
    if k == 'path':
        d = p.get('d')
        if d is None:
            d = ''.join(G.segs_to_d(G.fit_closed_contour(c, err=p.get('err', PATH_ERR), bias=p.get('bias', 0.0)))
                        for c in p['contours'])
            p['d'] = d
        rule = ' fill-rule="evenodd"' if p.get('evenodd', len(p['contours']) > 1) else ''
        return f'<path d="{d}"{rule} fill="{paint}"/>'
    raise ValueError(k)


def to_svg(eng, shapes, bg_fill):
    W, H = eng.W, eng.H
    defs = []
    body = []
    gi = 0

    def paint_of(fill):
        nonlocal gi
        if fill['type'] == 'flat':
            return hexcol(fill['c'])
        gid = f'g{gi}'
        gi += 1
        defs.append(grad_def(fill, gid))
        return f'url(#{gid})'

    bgp = paint_of(bg_fill)
    if bgp.lower() not in ('#fff', '#ffffff'):
        body.append(f'<rect width="{W}" height="{H}" fill="{bgp}"/>')
    for s in shapes:
        if s.get('disabled'):
            continue
        body.append(shape_svg(s, paint_of(s['fill'])))
    out = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
    if defs:
        out += '<defs>' + ''.join(defs) + '</defs>'
    out += '\n' + '\n'.join(body) + '\n</svg>\n'
    return out


# ============================================================================ main
def describe(eng, shapes):
    names = []
    for s in shapes:
        if s.get('disabled'):
            continue
        k, p = s['kind'], s['prm']
        f = s['fill']['type']
        gd = {'lin': ' (linear gradient)', 'rad': ' (radial gradient)'}.get(f, '')
        if k == 'circle':
            nm = 'circle'
        elif k == 'ellipse':
            nm = 'rotated ellipse' if abs(math.degrees(p['th'])) > 0.5 else 'ellipse'
        elif k in ('rect', 'rrect', 'rot_rect', 'rot_rrect'):
            if p['r'] > 0.5:
                nm = 'pill' if p['r'] >= min(p['hx'], p['hy']) - 0.5 else 'rounded rectangle'
            else:
                nm = 'rectangle'
            if abs(p['th']) > 0.01:
                nm = 'rotated ' + nm
        elif k == 'polygon':
            nm = {3: 'triangle', 4: 'quadrilateral'}.get(len(p['V']), f'{len(p["V"])}-gon')
        elif k == 'stroke':
            n = len(p['V'])
            if p['closed']:
                nm = 'stroked ' + {3: 'triangle', 4: 'quadrilateral'}.get(n, f'{n}-gon')
            elif n == 2:
                nm = 'line' + (f' (merged from {s.get("merged", 1)} pieces)' if s.get('merged', 1) > 1 else '')
            else:
                nm = f'{n - 1}-segment polyline stroke'
        else:
            nc = p.get('nsub', len(p['contours']))
            if s.get('glyphs', 1) > 1:
                nm = f'compound Bezier path ({s["glyphs"]} outlines, {nc} subpaths)'
            else:
                nm = f'Bezier path ({nc} subpaths)' if nc > 1 else 'Bezier path'
        names.append(nm + gd)
    from collections import Counter
    cnt = Counter(names)
    bgd = {'flat': 'flat background', 'lin': 'linear-gradient background', 'rad': 'radial-gradient background'}[eng.bg_fill['type']]
    return ', '.join(f'{v} {k}' if v > 1 else f'1 {k}' for k, v in cnt.items()) + ', ' + bgd


def main():
    global VERBOSE
    ap = argparse.ArgumentParser()
    ap.add_argument('inp'); ap.add_argument('out')
    ap.add_argument('-v', action='store_true')
    ap.add_argument('--noverify', action='store_true')
    ap.add_argument('--nocheck', action='store_true', help='skip the final Chromium check (vec-c)')
    a = ap.parse_args()
    VERBOSE = a.v
    img = np.asarray(Image.open(a.inp).convert('RGB')).astype(np.float32)
    eng = Engine(img)
    rnd = Renderer() if RAPI.MODE == 'chrome' else NativeRenderer()
    try:
        shapes = eng.run(rnd)
        svg = to_svg(eng, shapes, eng.bg_fill)
        r = rnd.render(svg)
        log('initial', metrics(img, r), len(svg))
        if not a.noverify:
            import verify
            shapes, svg = verify.refine(eng, shapes, rnd, img, log=log)
        if RAPI.MODE != 'chrome' and not a.nocheck:
            # final check of the chosen SVG with Chromium; on disagreement beyond the threshold
            # rerun the whole search with Chromium in the loop (the original engine)
            chk, _ = RAPI.final_check(svg, log=lambda m: print(m, file=sys.stderr))
            if not chk['ok']:
                print('native/chromium disagreement -> rerunning with VEC_RENDER=chrome', file=sys.stderr)
                rnd.close()
                env = dict(os.environ, VEC_RENDER='chrome')
                sys.stdout.flush()
                os.execve(sys.executable, [sys.executable, os.path.abspath(__file__)] + sys.argv[1:], env)
        with open(a.out, 'w') as f:
            f.write(svg)
        desc = describe(eng, shapes)
        with open(a.out + '.desc', 'w') as f:
            f.write(desc + '\n')
        print(desc)
        print('render_stats ' + json.dumps(RAPI.STATS), file=sys.stderr)
        if G._VC is not None:
            print('vcfit_stats ' + json.dumps(G._VC.STATS), file=sys.stderr)
    finally:
        rnd.close()


if __name__ == '__main__':
    main()
