"""Colour segmentation for the 'trace' vectorizer.

Pipeline:
  1. core pixels  = pixels whose 4-neighbours are all within T_CORE (flat or smoothly varying)
  2. seed regions = connected components of core pixels; each gets a colour model
                    (flat / linear gradient / radial gradient)
  3. groups       = seeds merged by colour (flat) - every group is a 'palette entry'
  4. decomposition: every pixel = alpha*model_g1(p) + (1-alpha)*model_g2(p) for the two
                    best nearby groups (anti-aliasing aware: edge pixels are blends)
  5. residual loop: pixels no blend explains form new (thin) groups (text strokes, hairlines)
"""
import numpy as np
from scipy import ndimage as ndi
from scipy import optimize

T_CORE = 4          # max channel diff to 4-neighbours for a core pixel
FLAT_MERGE = 7.0    # max channel diff to merge two flat seeds into one group
CAND_R = 3.6        # search radius for candidate groups of a pixel
TOL_UNEXPL = 11.0   # L2 error above which a pixel is 'unexplained'
S8 = np.ones((3, 3), bool)


def shift(a, dy, dx):
    H, W = a.shape[:2]
    pad = [(1, 1), (1, 1)] + [(0, 0)] * (a.ndim - 2)
    ap = np.pad(a, pad, mode='edge')
    return ap[1 + dy:1 + dy + H, 1 + dx:1 + dx + W]


# ----------------------------------------------------------------------------- models
class Flat:
    kind = 'flat'

    def __init__(self, color):
        self.color = np.asarray(color, np.float32)

    def eval(self, x, y):
        return np.broadcast_to(self.color, (len(x), 3))


def fit_pwl(t, P, tol=1.6, max_knots=10):
    """Piecewise-linear fit of colours P (N,3) against scalar t. Returns knots (k,), colours (k,3)."""
    t0 = t.min()
    b = np.floor(t - t0).astype(int)
    nb = b.max() + 1
    cnt = np.bincount(b, minlength=nb).astype(np.float64)
    ok = cnt > 0
    tb = np.bincount(b, weights=t, minlength=nb)[ok] / cnt[ok]
    cb = np.stack([np.bincount(b, weights=P[:, k], minlength=nb)[ok] for k in range(3)], 1) / cnt[ok][:, None]
    wb = cnt[ok]
    if len(tb) < 2:
        return np.array([tb[0], tb[0] + 1]), np.vstack([cb[0], cb[0]])
    # Douglas-Peucker in (t, rgb) on binned means (max channel deviation)
    def dp(i, j, out):
        if j <= i + 1:
            return
        tt = tb[i + 1:j]
        f = (tt - tb[i]) / (tb[j] - tb[i])
        pred = cb[i] + f[:, None] * (cb[j] - cb[i])
        dev = np.abs(cb[i + 1:j] - pred).max(1) * np.minimum(1, np.sqrt(wb[i + 1:j] / 3))
        k = np.argmax(dev)
        if dev[k] > tol:
            dp(i, i + 1 + k, out)
            out.append(i + 1 + k)
            dp(i + 1 + k, j, out)
    mid = []
    dp(0, len(tb) - 1, mid)
    knots_idx = [0] + mid + [len(tb) - 1]
    if len(knots_idx) > max_knots:
        sel = np.linspace(0, len(knots_idx) - 1, max_knots).round().astype(int)
        knots_idx = [knots_idx[i] for i in sel]
    knots = tb[knots_idx]
    # least-squares refine the knot colours (hat basis), weighted by bin counts
    k = len(knots)
    A = np.zeros((len(tb), k))
    for i in range(k):
        e = np.zeros(k); e[i] = 1
        A[:, i] = np.interp(tb, knots, e)
    sw = np.sqrt(wb)[:, None]
    col, *_ = np.linalg.lstsq(A * sw, cb * sw, rcond=None)
    return knots, np.clip(col, 0, 255)


def pwl_eval(t, knots, cols):
    return np.stack([np.interp(t, knots, cols[:, k]) for k in range(3)], 1)


class Linear:
    kind = 'linear'

    def __init__(self, n, knots, cols):
        self.n = np.asarray(n, float); self.knots = knots; self.cols = cols

    def eval(self, x, y):
        return pwl_eval(x * self.n[0] + y * self.n[1], self.knots, self.cols).astype(np.float32)


class Radial:
    kind = 'radial'

    def __init__(self, c, knots, cols):
        self.c = np.asarray(c, float); self.knots = knots; self.cols = cols

    def eval(self, x, y):
        return pwl_eval(np.hypot(x - self.c[0], y - self.c[1]), self.knots, self.cols).astype(np.float32)


def rms(P, Q):
    return float(np.sqrt(((P - Q) ** 2).sum(1).mean()))


def fit_model(img, mask, box):
    """Choose flat / linear / radial colour model for the pixels of a seed."""
    y0, x0 = box
    yy, xx = np.nonzero(mask)
    P = img[yy + y0, xx + x0].astype(np.float64)
    X = xx + x0 + 0.5; Y = yy + y0 + 0.5
    flat = Flat(P.mean(0))
    e_flat = rms(P, flat.eval(X, Y))
    rng = np.percentile(P, 99, 0) - np.percentile(P, 1, 0)
    if e_flat < 2.0 or len(P) < 300 or rng.max() < 10:
        return flat, e_flat
    best, e_best = flat, e_flat
    # linear: plane fit gives direction, then piecewise-linear along it
    A = np.stack([np.ones_like(X), X, Y], 1)
    coef, *_ = np.linalg.lstsq(A, P, rcond=None)
    B = coef[1:3]
    U, S, Vt = np.linalg.svd(B)
    n = U[:, 0]
    t = X * n[0] + Y * n[1]
    kn, cl = fit_pwl(t, P)
    lin = Linear(n, kn, cl)
    e_lin = rms(P, lin.eval(X, Y))
    if e_lin < e_best * 0.8:
        best, e_best = lin, e_lin
    # radial: centre from least-squares intersection of colour-gradient lines
    try:
        rad, e_rad = fit_radial(P, X, Y, mask, img, box)
        if rad is not None and e_rad < e_best * 0.8:
            best, e_best = rad, e_rad
    except Exception as ex:  # pragma: no cover
        pass
    return best, e_best


def fit_radial(P, X, Y, mask, img, box):
    y0, x0 = box
    h, w = mask.shape
    # scalar field: projection on principal colour axis
    mu = P.mean(0)
    _, _, Vt = np.linalg.svd(P - mu, full_matrices=False)
    s = (P - mu) @ Vt[0]
    S = np.zeros((h, w)); S[mask] = s
    m = mask.astype(float)
    Sg = ndi.gaussian_filter(S, 2.0); mg = ndi.gaussian_filter(m, 2.0)
    Sm = np.where(mg > 1e-3, Sg / np.maximum(mg, 1e-3), 0)
    gy = ndi.sobel(Sm, 0); gx = ndi.sobel(Sm, 1)
    inner = ndi.binary_erosion(mask, iterations=4)
    yy, xx = np.nonzero(inner)
    if len(yy) < 100:
        return None, 1e9
    gxv = gx[yy, xx]; gyv = gy[yy, xx]
    g2 = gxv ** 2 + gyv ** 2
    keep = g2 > np.percentile(g2, 30)
    gxv, gyv, g2 = gxv[keep], gyv[keep], g2[keep]
    px = xx[keep] + x0 + 0.5; py = yy[keep] + y0 + 0.5
    gn = np.sqrt(g2)
    mx, my = -gyv / gn, gxv / gn          # perpendicular to gradient
    w_ = g2
    M = np.array([[np.sum(w_ * mx * mx), np.sum(w_ * mx * my)], [np.sum(w_ * mx * my), np.sum(w_ * my * my)]])
    rhs = np.array([np.sum(w_ * mx * (mx * px + my * py)), np.sum(w_ * my * (mx * px + my * py))])
    ev = np.linalg.eigvalsh(M)
    if ev[0] < 1e-3 * ev[1]:
        return None, 1e9
    c = np.linalg.solve(M, rhs)
    # sanity: centre not absurdly far
    bw = max(X.max() - X.min(), Y.max() - Y.min())
    if np.hypot(c[0] - X.mean(), c[1] - Y.mean()) > 2 * bw:
        return None, 1e9
    sub = np.arange(len(X))
    if len(sub) > 20000:
        sub = np.random.default_rng(0).choice(len(X), 20000, replace=False)
    Xs, Ys, Ps = X[sub], Y[sub], P[sub]

    def err(cc):
        r = np.hypot(Xs - cc[0], Ys - cc[1])
        kn, cl = fit_pwl(r, Ps)
        return rms(Ps, pwl_eval(r, kn, cl))
    res = optimize.minimize(err, c, method='Nelder-Mead', options={'xatol': 0.05, 'fatol': 0.01, 'maxiter': 80})
    c = res.x
    r = np.hypot(X - c[0], Y - c[1])
    kn, cl = fit_pwl(r, P)
    rad = Radial(c, kn, cl)
    return rad, rms(P, rad.eval(X, Y))


# ----------------------------------------------------------------------------- seeds
def find_seeds(img):
    H, W, _ = img.shape
    core = np.ones((H, W), bool)
    for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        core &= np.abs(img - shift(img, dy, dx)).max(-1) <= T_CORE
    lab, n = ndi.label(core)
    seeds = []
    objs = ndi.find_objects(lab)
    for i, sl in enumerate(objs):
        m = lab[sl] == i + 1
        area = int(m.sum())
        if area < 4:
            continue
        model, e = fit_model(img, m, (sl[0].start, sl[1].start))
        seeds.append(dict(mask=m, box=(sl[0].start, sl[1].start), model=model, area=area, err=e))
    return seeds


class Group:
    def __init__(self, model):
        self.model = model
        self.parts = []   # list of (mask, box)

    @property
    def flat(self):
        return self.model.kind == 'flat'

    def eval(self, x, y):
        return self.model.eval(x, y)


def make_groups(seeds):
    groups = []
    flats = []
    for s in sorted(seeds, key=lambda s: -s['area']):
        if s['model'].kind != 'flat':
            g = Group(s['model']); g.parts.append((s['mask'], s['box'])); groups.append(g)
            continue
        c = s['model'].color
        hit = None
        for g in flats:
            if np.abs(g.model.color - c).max() <= FLAT_MERGE:
                hit = g; break
        if hit is None:
            hit = Group(Flat(c)); hit.w = 0.0; hit.csum = np.zeros(3); flats.append(hit); groups.append(hit)
        hit.parts.append((s['mask'], s['box']))
        hit.csum += c * s['area']; hit.w += s['area']
    for g in flats:
        g.model = Flat(g.csum / g.w)
    return groups


def seedmap_of(groups, shape):
    sm = np.full(shape, -1, np.int32)
    for gi, g in enumerate(groups):
        for m, (y0, x0) in g.parts:
            h, w = m.shape
            v = sm[y0:y0 + h, x0:x0 + w]
            v[m] = gi
    return sm


# ----------------------------------------------------------------------------- decomposition
def decompose(img, groups, K=3, R=CAND_R):
    H, W, _ = img.shape
    sm = seedmap_of(groups, (H, W))
    G = len(groups)
    K = min(K, max(G, 1))
    dist = np.full((H, W, K), np.inf, np.float32)
    gid = np.full((H, W, K), -1, np.int32)
    pad = int(np.ceil(R)) + 1
    for g in range(G):
        m = sm == g
        if not m.any():
            continue
        ys, xs = np.nonzero(m)
        y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, H)
        x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, W)
        d = ndi.distance_transform_edt(~m[y0:y1, x0:x1]).astype(np.float32)
        dd = np.concatenate([dist[y0:y1, x0:x1], d[..., None]], 2)
        gg = np.concatenate([gid[y0:y1, x0:x1], np.full(d.shape + (1,), g, np.int32)], 2)
        o = np.argsort(dd, 2, kind='stable')[..., :K]
        dist[y0:y1, x0:x1] = np.take_along_axis(dd, o, 2)
        gid[y0:y1, x0:x1] = np.take_along_axis(gg, o, 2)
    valid = (dist <= R) & (gid >= 0)
    gid = np.where(valid, gid, -1)
    C = np.zeros((H, W, K, 3), np.float32)
    for g in range(G):
        sel = gid == g
        if not sel.any():
            continue
        yy, xx, kk = np.nonzero(sel)
        C[yy, xx, kk] = groups[g].eval(xx + 0.5, yy + 0.5)
    P = img.astype(np.float32)
    BIG = 1e9
    best = np.full((H, W), BIG, np.float32)
    g1 = np.full((H, W), -1, np.int32); g2 = np.full((H, W), -1, np.int32)
    al = np.ones((H, W), np.float32); er = np.full((H, W), BIG, np.float32)
    LAM = 0.35
    for i in range(K):
        e = np.sqrt(((P - C[:, :, i]) ** 2).sum(-1))
        sc = np.where(valid[..., i], e + LAM * dist[..., i], BIG)
        upd = sc < best
        best = np.where(upd, sc, best); g1 = np.where(upd, gid[..., i], g1); g2 = np.where(upd, gid[..., i], g2)
        al = np.where(upd, 1.0, al); er = np.where(upd, e, er)
    for i in range(K):
        for j in range(i + 1, K):
            d = C[:, :, i] - C[:, :, j]
            dd = (d * d).sum(-1)
            a = np.clip(((P - C[:, :, j]) * d).sum(-1) / np.maximum(dd, 1e-6), 0, 1)
            rec = C[:, :, j] + a[..., None] * d
            e = np.sqrt(((P - rec) ** 2).sum(-1))
            v = valid[..., i] & valid[..., j] & (dd > 25)
            sc = np.where(v, e + LAM * (dist[..., i] + dist[..., j]) + 1.0, BIG)
            upd = sc < best
            best = np.where(upd, sc, best); g1 = np.where(upd, gid[..., i], g1); g2 = np.where(upd, gid[..., j], g2)
            al = np.where(upd, a, al); er = np.where(upd, e, er)
    return dict(g1=g1, g2=g2, alpha=al, err=er, seedmap=sm, cand=gid, cdist=dist)


def residual_groups(img, groups, dec, it):
    """Turn clusters of unexplained pixels into new thin groups. Returns number added."""
    H, W, _ = img.shape
    un = dec['err'] > TOL_UNEXPL
    lab, n = ndi.label(un, S8)
    if n == 0:
        return 0
    added = 0
    P = img.astype(np.float32)
    for i, sl in enumerate(ndi.find_objects(lab)):
        m = lab[sl] == i + 1
        if m.sum() < 3:
            continue
        yy, xx = np.nonzero(m)
        yy = yy + sl[0].start; xx = xx + sl[1].start
        Pc = P[yy, xx]
        gref = dec['g1'][yy, xx]
        # reference colour: what the neighbourhood is (best explanation), else component mean
        ref = np.zeros_like(Pc)
        have = gref >= 0
        for g in np.unique(gref[have]):
            s = have & (gref == g)
            ref[s] = groups[g].eval(xx[s] + 0.5, yy[s] + 0.5)
        if not have.all():
            ref[~have] = np.median(Pc, 0)
        dist = np.sqrt(((Pc - ref) ** 2).sum(1))
        dmax = dist.max()
        if dmax < TOL_UNEXPL:
            continue
        top = dist >= 0.9 * dmax
        pure = np.median(Pc[top], 0)
        tol = max(5.0, 0.12 * dmax)
        dpure = np.sqrt(((Pc - pure) ** 2).sum(1))
        seedsel = dpure <= tol
        if not seedsel.any():
            seedsel = dpure <= dpure.min() + 1e-6
        # merge with existing flat group of same colour
        hit = None
        for g in groups:
            if g.flat and np.abs(g.model.color - pure).max() <= FLAT_MERGE:
                hit = g; break
        if hit is None:
            hit = Group(Flat(pure)); groups.append(hit)
        sm = np.zeros((H, W), bool)
        sm[yy[seedsel], xx[seedsel]] = True
        ys, xs = yy[seedsel], xx[seedsel]
        y0, x0 = ys.min(), xs.min()
        hit.parts.append((sm[y0:ys.max() + 1, x0:xs.max() + 1].copy(), (y0, x0)))
        added += 1
    return added


def palette_seeds(img, groups, min_run=6, tol=2.0):
    """Pixels that exactly match a flat palette colour in runs of >= min_run become seeds
    (thin lines whose colour is known elsewhere, e.g. a 1px line partly hidden)."""
    H, W, _ = img.shape
    sm = seedmap_of(groups, (H, W))
    for gi, g in enumerate(groups):
        if not g.flat:
            continue
        m = (np.abs(img - g.model.color).max(-1) <= tol) & (sm < 0)
        if not m.any():
            continue
        lab, n = ndi.label(m, S8)
        if n == 0:
            continue
        sizes = ndi.sum(np.ones_like(lab), lab, np.arange(1, n + 1))
        keep = np.isin(lab, np.nonzero(sizes >= min_run)[0] + 1)
        if keep.any():
            ys, xs = np.nonzero(keep)
            y0, x0 = ys.min(), xs.min()
            g.parts.append((keep[y0:ys.max() + 1, x0:xs.max() + 1].copy(), (y0, x0)))
            sm[keep] = gi


def segment(img, verbose=False):
    seeds = find_seeds(img)
    groups = make_groups(seeds)
    palette_seeds(img, groups)
    if verbose:
        print('seeds', len(seeds), 'groups', len(groups), [(g.model.kind, np.round(getattr(g.model, 'color', [0, 0, 0])).tolist()) for g in groups][:12])
    for it in range(5):
        dec = decompose(img, groups)
        if verbose:
            print(' it', it, 'unexplained', int((dec['err'] > TOL_UNEXPL).sum()))
        if residual_groups(img, groups, dec, it) == 0:
            break
        palette_seeds(img, groups)
    dec = decompose(img, groups)
    unexpl = float((dec['err'] > TOL_UNEXPL).mean())
    if verbose:
        print(' final unexplained', int((dec['err'] > TOL_UNEXPL).sum()), 'groups', len(groups))
    if unexpl > 0.2:
        # photographic / textured content: posterize with a k-means palette instead
        groups = posterize(img)
        dec = decompose(img, groups)
        if verbose:
            print(' posterized: groups', len(groups), 'unexplained', int((dec['err'] > TOL_UNEXPL).sum()))
    return groups, dec


def kmeans(X, k, iters=20, seed=0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), 1)]
    for _ in range(k - 1):   # k-means++ seeding
        d = ((X[:, None] - C[None]) ** 2).sum(-1).min(1)
        C = np.vstack([C, X[rng.choice(len(X), 1, p=d / d.sum())]])
    for _ in range(iters):
        lab = ((X[:, None] - C[None]) ** 2).sum(-1).argmin(1)
        for j in range(k):
            m = lab == j
            if m.any():
                C[j] = X[m].mean(0)
    return C


def posterize(img, k=20):
    H, W, _ = img.shape
    X = img.reshape(-1, 3)
    sub = X[np.random.default_rng(0).choice(len(X), min(len(X), 20000), replace=False)]
    C = kmeans(sub.astype(np.float64), k)
    lab = np.empty(H * W, np.int32)
    for i in range(0, H * W, 65536):
        lab[i:i + 65536] = ((X[i:i + 65536, None] - C[None]) ** 2).sum(-1).argmin(1)
    lab = lab.reshape(H, W)
    # mode filter to remove speckle
    from scipy import ndimage as ndi2
    best = np.zeros((H, W)); out = lab.copy()
    for j in range(k):
        cnt = ndi2.uniform_filter((lab == j).astype(np.float32), 3)
        upd = cnt > best
        best = np.where(upd, cnt, best); out = np.where(upd, j, out)
    groups = []
    for j in range(k):
        m = out == j
        if m.sum() < 4:
            continue
        g = Group(Flat(C[j]))
        ys, xs = np.nonzero(m)
        y0, x0 = ys.min(), xs.min()
        g.parts.append((m[y0:ys.max() + 1, x0:xs.max() + 1].copy(), (y0, x0)))
        groups.append(g)
    return groups
