#!/usr/bin/env python3
"""trace -- raster -> editable SVG vectorizer (works from the pixels only).

usage:  python3 trace.py IN.png OUT.svg [--json INFO.json] [--fast] [--smooth]
  --smooth  never replace a Bezier outline by the traced chord polygon (smoother when zoomed,
            slightly lower pixel fidelity when the source rasterizer flattened its curves)
  --fast    pixels only: no render-based calibration / refinement / stroke check

Pipeline
  segment.py  colour segmentation: smooth 'core' pixels -> seed regions with a colour model
              (flat / linear gradient / radial gradient, piecewise-linear stops); seeds merged
              into a palette; every pixel decomposed as an anti-aliasing blend
              alpha*c1 + (1-alpha)*c2 of its two best nearby palette entries; unexplained
              pixels become new thin groups (text strokes, hairlines); photographic input
              falls back to a k-means posterization.
  trace.py    regions = connected components of the hard labels; containment tree (holes);
              same-colour-as-container regions are dropped (container shows through);
              occlusion-aware convex completion (a bar under a line becomes a full rectangle,
              gridline pieces hidden by bars become one line) with z-order constraints;
              z-order = topological sort (parents first, occluders last, larger first);
              per shape a coverage field F = sum of alphas of the regions it covers.
  fit.py      iso-0.5 contours of F, corrected to sub-pixel accuracy by inverting the
              box-filter coverage of the cut pixel; sharp-corner detection; straight-run
              detection (sagitta test); greedy cubic Bezier fitting + joint least-squares
              chain optimisation (G1); primitive recognition (rect, rounded rect, circle,
              rotated ellipse); compact relative path data.
  stroke.py   constant-width regions -> stroked centre lines (rings and open polylines);
              join/cap/width chosen by rendering candidates.
  calib.py    analysis-by-synthesis: primitives are rendered alone and re-measured with the
              same estimator; parameters corrected by fixed-point iteration (removes the
              rasterizer's curve-flattening bias).
  refine.py   render-in-the-loop normal-offset refinement of traced paths.
The render-based steps need node + Chromium (render.mjs); without them the engine still runs
on pixels alone (TRACE_RENDER=/nonexistent), just less precisely.
"""
import sys, json, math, time
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

import segment as SG
import fit as FT

S8 = np.ones((3, 3), bool)
DEBUG = False
CALIBRATE = True
REFINE = 5
STROKES = True
POLY_ALT = True
POLY_EPS = 0.03
S4 = ndi.generate_binary_structure(2, 1)


class Region:
    __slots__ = ('id', 'group', 'mask', 'box', 'area', 'fill', 'fillarea', 'parent', 'desc', 'holes',
                 'kept', 'suppressed', 'z', 'shape', 'children', 'touch_border')


def hexcol(c):
    c = [int(round(min(255, max(0, v)))) for v in c]
    if all((v >> 4) == (v & 15) for v in c):
        return '#' + ''.join('%x' % (v & 15) for v in c)
    return '#%02x%02x%02x' % tuple(c)


def build_regions(groups, dec, shape):
    H, W = shape
    g1, g2, al = dec['g1'], dec['g2'], dec['alpha']
    Lg = np.where(al >= 0.5, g1, g2)
    # pixels without any explanation -> nearest labelled
    if (Lg < 0).any():
        idx = ndi.distance_transform_edt(Lg < 0, return_distances=False, return_indices=True)
        Lg = Lg[idx[0], idx[1]]
    # remove specks (<3 px components): give them the neighbour label
    for _ in range(2):
        changed = False
        for g in range(len(groups)):
            lab, n = ndi.label(Lg == g, S8)
            if n == 0:
                continue
            sizes = ndi.sum(np.ones_like(lab), lab, np.arange(1, n + 1))
            small = np.isin(lab, np.nonzero(sizes < 3)[0] + 1)
            if small.any():
                Lg = np.where(small, -1, Lg); changed = True
        if not changed:
            break
        idx = ndi.distance_transform_edt(Lg < 0, return_distances=False, return_indices=True)
        Lg = Lg[idx[0], idx[1]]
    Lr = np.full((H, W), -1, np.int32)
    regions = []
    for g in range(len(groups)):
        lab, n = ndi.label(Lg == g, S8)
        for i, sl in enumerate(ndi.find_objects(lab)):
            if sl is None:
                continue
            m = lab[sl] == i + 1
            R = Region()
            R.id = len(regions); R.group = g; R.mask = m; R.box = (sl[0].start, sl[1].start)
            R.area = int(m.sum())
            R.touch_border = sl[0].start == 0 or sl[1].start == 0 or sl[0].stop == H or sl[1].stop == W
            v = Lr[sl]; v[m] = R.id
            regions.append(R)
    # component -> region mapping (nearest region of that group within 2.5px)
    r1 = np.full((H, W), -1, np.int32); r2 = np.full((H, W), -1, np.int32)
    for g in range(len(groups)):
        m = Lg == g
        if not m.any():
            continue
        d, idx = ndi.distance_transform_edt(~m, return_indices=True)
        near = Lr[idx[0], idx[1]]
        ok = d <= 2.5
        s1 = (g1 == g) & ok; r1[s1] = near[s1]
        s2 = (g2 == g) & ok; r2[s2] = near[s2]
    return regions, Lr, Lg, r1, r2


def containment(regions, Lr, shape):
    H, W = shape
    byid_ = regions
    root = max((R for R in regions if R.touch_border), key=lambda R: R.area, default=max(regions, key=lambda R: R.area))
    for R in regions:
        R.desc = set(); R.holes = []; R.kept = []; R.suppressed = False; R.children = []
        if R is root:
            R.fill = None; R.fillarea = H * W
            continue
        y0, x0 = R.box
        h, w = R.mask.shape
        mp = np.pad(R.mask, 1)
        f = ndi.binary_fill_holes(mp)
        R.fill = f[1:-1, 1:-1]
        R.fillarea = int(R.fill.sum())
        hole = R.fill & ~R.mask
        if hole.any():
            sub = Lr[y0:y0 + h, x0:x0 + w]
            labs, cnts = np.unique(sub[hole], return_counts=True)
            R.desc = set()
            for lb, ct in zip(labs.tolist(), cnts.tolist()):
                if lb < 0 or lb == R.id:
                    continue
                X = byid_[lb]
                # X is inside R only if (almost) all of X lies in R's holes
                if ct >= 0.9 * X.area and X.area < R.fillarea:
                    R.desc.add(lb)
            hl, nh = ndi.label(hole, S4)
            ring = ndi.binary_dilation(R.mask, S4) & hole
            for k in range(1, nh + 1):
                hk = hl == k
                rim = set(np.unique(sub[ring & hk]).tolist()) - {-1}
                R.holes.append((hk, rim))
    for R in regions:
        if R is root:
            R.parent = None; continue
        best = root
        for Q in regions:
            if Q is not root and R.id in Q.desc and Q.fillarea < best.fillarea:
                best = Q
        R.parent = best
        best.children.append(R)
    return root


def coverage(R_ids_in, dec, r1, r2, box, shape, pad=3):
    """Coverage field of the union of regions R_ids_in (bool lookup array) within box."""
    H, W = shape
    y0, x0, y1, x1 = box
    y0 = max(y0 - pad, 0); x0 = max(x0 - pad, 0); y1 = min(y1 + pad, H); x1 = min(x1 + pad, W)
    a = dec['alpha'][y0:y1, x0:x1]
    A = r1[y0:y1, x0:x1]; B = r2[y0:y1, x0:x1]
    inA = np.where(A >= 0, R_ids_in[np.maximum(A, 0)], False)
    inB = np.where(B >= 0, R_ids_in[np.maximum(B, 0)], False)
    F = a * inA + (1 - a) * inB
    return F, (y0, x0)


def model_compatible(img, groups, R, model_group):
    """Is region R's colour explained by group model_group's model?"""
    if R.group == model_group:
        return True
    g = groups[model_group]
    y0, x0 = R.box
    yy, xx = np.nonzero(R.mask)
    P = img[yy + y0, xx + x0]
    e = np.sqrt(((P - g.eval(xx + x0 + 0.5, yy + y0 + 0.5)) ** 2).sum(1))
    return np.median(e) < 6


def subtree(byid, R):
    out = {R.id}
    st = [R]
    while st:
        X = st.pop()
        for c in X.children:
            if c.id not in out:
                out.add(c.id); st.append(c)
    return out


def ancestors(R):
    out = set()
    P = R.parent
    while P is not None and P.id not in out:
        out.add(P.id); P = P.parent
    return out


def hull_mask(v, shape, shrink=0.3):
    """Pixels whose centre lies inside convex polygon v (ccw or cw) by at least `shrink`."""
    H, W = shape
    x0 = max(int(np.floor(v[:, 0].min())), 0); x1 = min(int(np.ceil(v[:, 0].max())) + 1, W)
    y0 = max(int(np.floor(v[:, 1].min())), 0); y1 = min(int(np.ceil(v[:, 1].max())) + 1, H)
    m = np.zeros(shape, bool)
    if x1 <= x0 or y1 <= y0:
        return m
    yy, xx = np.mgrid[y0:y1, x0:x1]
    px = xx + 0.5; py = yy + 0.5
    area = FT.poly_area(v)
    sgn = 1 if area > 0 else -1
    ok = np.ones(px.shape, bool)
    for a, b in zip(v, np.roll(v, -1, 0)):
        e = b - a; L = math.hypot(*e)
        if L < 1e-9:
            continue
        # inward distance (positive inside) for polygon orientation sgn
        d = sgn * (e[0] * (py - a[1]) - e[1] * (px - a[0])) / L
        ok &= d >= shrink
    m[y0:y1, x0:x1] = ok
    return m


def hull_poly(points, raw=False):
    from scipy.spatial import ConvexHull
    h = ConvexHull(points)
    v = points[h.vertices]
    if raw:
        return v
    # densify (1px spacing) so corner/line detection works on it
    out = []
    for a, b in zip(v, np.roll(v, -1, 0)):
        L = math.hypot(*(b - a))
        k = max(1, int(math.ceil(L / 1.0)))
        t = np.arange(k)[:, None] / k
        out.append(a + t * (b - a))
    return np.vstack(out)


def try_hull(R, units, byid, Lr, dec, r1, r2, shape, emitted_ok, reach, unit_of):
    """Convex completion of R (plus same-colour pieces/units) under later-drawn occluders.
    Returns (members, occluders, hull points) or None."""
    H, W = shape
    anc = ancestors(R)

    def same_ok(x):
        X = byid[x]
        h = unit_of.get(x)
        return X.group == R.group and X.parent is R.parent and not X.suppressed and h is not None and h in units

    def expand(ms):
        out = set()
        for m in ms:
            h = unit_of.get(m, m)
            out |= set(units[h]['members']) if h in units else {m}
        return out

    def evaluate(members):
        members = expand(members)
        for _ in range(6):
            ids = set()
            for m in members:
                ids |= subtree(byid, byid[m])
            look = np.zeros(len(byid) + 1, bool); look[list(ids)] = True
            boxes = [(byid[m].box[0], byid[m].box[1], byid[m].box[0] + byid[m].mask.shape[0], byid[m].box[1] + byid[m].mask.shape[1]) for m in members]
            y0 = min(b[0] for b in boxes); x0 = min(b[1] for b in boxes); y1 = max(b[2] for b in boxes); x1 = max(b[3] for b in boxes)
            F, org = coverage(look, dec, r1, r2, (y0, x0, y1, x1), shape)
            cons = FT.contours(F, org[1], org[0])
            if not cons:
                return None
            pts = np.vstack(cons)
            try:
                hv = hull_poly(pts, raw=True)
                hp = hull_poly(pts)
            except Exception:
                return None
            hm = hull_mask(hv, shape, 0.3)
            full = np.zeros(shape, bool)
            full[org[0]:org[0] + F.shape[0], org[1]:org[1] + F.shape[1]] = F >= 0.5
            E = hm & ~full
            labs = Lr[E]
            if labs.size == 0:
                return members, set(), hp, boxes
            u, cnt = np.unique(labs, return_counts=True)
            add = [int(x) for x in u if x >= 0 and x not in members and same_ok(int(x))]
            if add:
                members |= expand(add)
                continue
            bad = 0; occ = set()
            for x, c in zip(u.tolist(), cnt.tolist()):
                if x in members:
                    continue
                if x < 0 or x in anc or not emitted_ok(byid[x]) or reach(x, R.id):
                    bad += c
                else:
                    occ.add(x)
            if bad > max(2, 0.004 * labs.size):
                if DEBUG:
                    print('   hull reject', sorted(members), 'bad', bad, 'of', labs.size, [(x, c) for x, c in zip(u.tolist(), cnt.tolist()) if x < 0 or x in anc or x in members or not emitted_ok(byid[x]) or reach(x, R.id)])
                return None
            return members, occ, hp, boxes
        return None

    cur = evaluate({R.id})
    if cur is None:
        return None
    cands = [byid[h] for h in units if h != R.id and same_ok(h)]
    tried = set()
    while True:
        members, occ, hp, boxes = cur
        ext = max(max(b[2] for b in boxes) - min(b[0] for b in boxes), max(b[3] for b in boxes) - min(b[1] for b in boxes))
        def ugap(S):
            return min(gap(boxes, byid[m]) for m in units[S.id]['members']) if S.id in units else gap(boxes, S)
        rest = sorted([S for S in cands if S.id not in members and S.id not in tried], key=ugap)
        rest = [S for S in rest if ugap(S) <= max(2 * ext, 40)][:8]
        grown = False
        for S in rest:
            tried.add(S.id)
            res = evaluate(members | {S.id})
            if res is not None:
                cur = res; grown = True; break
        if not grown:
            break
    members, occ, hp, boxes = cur
    if not occ and len(members) == 1:
        return None
    return members, occ, hp


def gap(boxes, S):
    sy0, sx0 = S.box; sy1, sx1 = sy0 + S.mask.shape[0], sx0 + S.mask.shape[1]
    g = 1e9
    for b in boxes:
        dy = max(0, b[0] - sy1, sy0 - b[2]); dx = max(0, b[1] - sx1, sx0 - b[3])
        g = min(g, math.hypot(dx, dy))
    return g


def run(path, out, info=None, dec_digits=2, verbose=True, use_hull=True):
    t0 = time.time()
    img = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    H, W, _ = img.shape
    groups, dec = SG.segment(img)
    regions, Lr, Lg, r1, r2 = build_regions(groups, dec, (H, W))
    root = containment(regions, Lr, (H, W))
    n = len(regions)
    byid = regions

    # a region with the colour of its container is just the container showing through
    for R in regions:
        if R is not root and model_compatible(img, groups, R, R.parent.group):
            R.suppressed = True
    # kept holes: a hole whose single rim region shows the parent's colour stays a hole
    for R in regions:
        if R is root or R.suppressed:
            continue
        for hk, rim in R.holes:
            if len(rim) == 1:
                c = byid[next(iter(rim))]
                if c.parent is R and not c.suppressed and model_compatible(img, groups, c, R.parent.group):
                    R.kept.append(c)

    # emission units (a unit may absorb same-colour pieces through hull completion)
    units = {R.id: dict(members={R.id}, hull=None) for R in regions if R is not root and not R.suppressed}
    unit_of = {i: i for i in units}
    extra_edges = set()

    def emitted_ok(X):
        return X.id in unit_of and not X.suppressed

    def reach(a, b):
        """is there a forced ordering a -> ... -> b already (parent links + extra edges)?"""
        ua, ub = unit_of.get(a, a), unit_of.get(b, b)
        seen = {ua}; st = [ua]
        while st:
            x = st.pop()
            if x == ub:
                return True
            nxt = [unit_of.get(c.id, c.id) for m in units.get(x, {'members': {x}})['members'] for c in byid[m].children]
            nxt += [e[1] for e in extra_edges if e[0] == x]
            for y in nxt:
                if y not in seen:
                    seen.add(y); st.append(y)
        return False

    # adjacency from blended pixels
    msk = (r1 >= 0) & (r2 >= 0) & (r1 != r2)
    adj = {i: set() for i in range(n)}
    for a, b in set(zip(r1[msk].tolist(), r2[msk].tolist())):
        adj[a].add(b); adj[b].add(a)

    heavy = len(regions) > 250
    if use_hull and not heavy:
        for R in sorted(regions, key=lambda R: -R.fillarea):
            if R.id not in units or unit_of.get(R.id) != R.id:
                continue
            anc = ancestors(R); sub = subtree(byid, R)
            occl = [b for b in adj[R.id] if b not in anc and b not in sub and emitted_ok(byid[b])]
            same = [S for S in regions if S.id != R.id and S.group == R.group and S.parent is R.parent and S.id in units and unit_of.get(S.id) == S.id]
            if not occl and not same:
                continue
            res = try_hull(R, units, byid, Lr, dec, r1, r2, (H, W), emitted_ok, reach, unit_of)
            if res is None:
                continue
            members, occ, hp = res
            if not occ and len(members) == 1:
                continue
            for m in members:
                h = unit_of.get(m, m)
                if h != R.id and h in units:
                    del units[h]
                    for e in list(extra_edges):
                        if e[0] == h:
                            extra_edges.discard(e); extra_edges.add((R.id, e[1]))
                        elif e[1] == h:
                            extra_edges.discard(e); extra_edges.add((e[0], R.id))
                unit_of[m] = R.id
            units[R.id] = dict(members=members, hull=hp)
            for x in occ:
                extra_edges.add((R.id, unit_of.get(x, x)))

    # z-order: topological (parents before children, hull occluders after), larger first
    import heapq
    indeg = {u: 0 for u in units}
    succ = {u: set() for u in units}
    for u, U in units.items():
        for m in U['members']:
            for c in byid[m].children:
                for v in child_units(byid, c, unit_of, units):
                    if v != u:
                        succ[u].add(v)
    for a, b in extra_edges:
        if a in units and b in units and a != b:
            succ[a].add(b)
    for u in succ:
        for v in succ[u]:
            indeg[v] += 1
    farea = {u: sum(byid[m].fillarea for m in units[u]['members']) for u in units}
    heap = [(-farea[u], u) for u in units if indeg[u] == 0]
    heapq.heapify(heap)
    order = []
    while heap:
        _, u = heapq.heappop(heap)
        order.append(u)
        for v in succ[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(heap, (-farea[v], v))
    if DEBUG:
        print("edges", sorted(extra_edges)); print("order", order); print("units", {u: sorted(U["members"]) for u, U in units.items()}); print("groups", {u: byid[u].group for u in units})
    if len(order) < len(units):  # cycle (should not happen): append the rest by area
        order += sorted([u for u in units if u not in order], key=lambda u: -farea[u])

    shapes = []
    found = {'circle': 0, 'ellipse': 0, 'rect': 0, 'rrect': 0, 'path': 0}
    FT.OPTIMIZE = not heavy
    for z, u in enumerate(order):
        R = byid[u]
        U = units[u]
        if R.suppressed:
            continue
        boxes = [(byid[m].box[0], byid[m].box[1], byid[m].box[0] + byid[m].mask.shape[0], byid[m].box[1] + byid[m].mask.shape[1]) for m in U['members']]
        box = union_box(boxes)
        Fkeep = None
        ring_alt = None
        if U['hull'] is not None:
            cons = [U['hull']]
            prim = FT.recognise(cons[0], robust=True)
        else:
            full_in = subtree(byid, R)
            look = np.zeros(n + 1, bool)
            look[list(full_in)] = True
            F, org = coverage(look, dec, r1, r2, box, (H, W))
            cons = FT.contours(F, org[1], org[0])
            cons = [c for c in cons if abs(FT.poly_area(c)) >= 2.0]
            prim = None
            Fkeep = (F, org)
            ring_alt = None
            if len(cons) == 1:
                prim = FT.recognise(cons[0])
            if prim is not None and R.kept and STROKES and groups[R.group].flat:
                look2 = look.copy()
                for c in R.kept:
                    look2[list(subtree(byid, c))] = False
                ring_alt = dict(F=coverage(look2, dec, r1, r2, box, (H, W)), kept=[c.id for c in R.kept])
            if prim is None and R.kept:
                look2 = look.copy()
                for c in R.kept:
                    look2[list(subtree(byid, c))] = False
                F2, org2 = coverage(look2, dec, r1, r2, box, (H, W))
                cons = FT.contours(F2, org2[1], org2[0])
                cons = [c for c in cons if abs(FT.poly_area(c)) >= 2.0]
                Fkeep = (F2, org2)
                for c in R.kept:
                    c.suppressed = True
        if not cons:
            continue
        if prim is not None:
            kind, prm, e = prim
            if kind == 'rect' and prm[4] > 0:
                kind = 'rrect'
            found[kind] += 1
            shapes.append(dict(z=z, group=R.group, kind=kind, prm=prm, region=R.id, bbox=box, ring_alt=ring_alt,
                               F=Fkeep if U['hull'] is None else None))
        else:
            subs = []
            poly = []
            for c in cons:
                st, segs = FT.fit_closed(c)
                subs.append((np.asarray(st, float), [tuple([sg[0]] + [np.asarray(v, float) for v in sg[1:]]) for sg in segs]))
                if POLY_ALT:
                    import invflat
                    try:
                        V = invflat.vertices(c, closed=True)
                        poly.append((V[0], [('L', v) for v in V[1:]] + [('L', V[0])]))
                    except Exception:
                        poly = None
            found['path'] += 1
            shapes.append(dict(z=z, group=R.group, kind='path', subs=subs, holes=len(cons) > 1, region=R.id, bbox=box,
                               F=Fkeep if U['hull'] is None else None, poly=poly or None))

    light = len(shapes) <= 120 and time.time() - t0 < 90
    FT.OPTIMIZE = True
    if STROKES and light:
        import stroke
        drop = set()
        for sh in shapes:
            if sh['kind'] == 'path' and sh.get('F') is not None and groups[sh['group']].flat:
                ev = ' fill-rule="evenodd"' if sh.get('holes') else ''
                r = stroke.try_stroke(sh, f'<path d="{path_d(sh)}" fill="#fff"{ev}/>')
                if r:
                    sh.update(r)
                    found['path'] -= 1
                    found['stroke'] = found.get('stroke', 0) + 1
            elif sh.get('ring_alt'):
                kept = [x for x in shapes if x['region'] in sh['ring_alt']['kept']]
                if len(kept) != len(sh['ring_alt']['kept']):
                    continue
                base = '<g>' + element(sh, '#fff', 2) + ''.join(element(x, '#000', 2) for x in kept) + '</g>'
                r = stroke.try_stroke(sh, base, F=sh['ring_alt']['F'], holes=False)
                if r:
                    found['rrect' if sh['kind'] == 'rect' and sh['prm'][4] > 0 else sh['kind']] -= 1
                    for x in kept:
                        drop.add(id(x))
                        found['rrect' if x['kind'] == 'rect' and x.get('prm', (0,) * 5)[4] > 0 else x['kind']] -= 1
                    sh.update(r)
                    found['stroke'] = found.get('stroke', 0) + 1
        shapes = [x for x in shapes if id(x) not in drop]
    merged = plan_merge(shapes)
    if CALIBRATE and light:
        import calib
        prims = [s for s in shapes if s['kind'] in ('circle', 'ellipse', 'rect', 'rrect')]
        for s in prims:
            s['nosnap'] = True
        calib.calibrate(prims, element, to_path)
        choose_snap(prims, element, to_path)
    if POLY_ALT and light:
        choose_poly([s for s in shapes if s['kind'] == 'path' and s.get('F') is not None and s.get('poly')], found)
    if REFINE and light:
        import refine
        refine.refine([s for s in shapes if s['kind'] == 'path' and s.get('F') is not None], path_d, iters=REFINE)
    svg = write_svg(W, H, groups, root, merged, dec_digits)
    open(out, 'w').write(svg)
    desc = describe(groups, root, shapes, found)
    if verbose:
        print(f'{path}: regions={n} units={len(units)} time={time.time()-t0:.1f}s :: {desc}')
    return desc


def choose_snap(prims, element, to_path):
    """Round primitive parameters only when the rounded version renders at least as well."""
    import calib, stroke
    cand = [s for s in prims if s.get('F') is not None]
    for s in prims:
        if s.get('F') is None:
            s['nosnap'] = False
    if not cand:
        return
    items = []
    for s in cand:
        for ns in (True, False):
            t = dict(s); t['nosnap'] = ns
            e = element(t, '#fff', 2) if s.get('form') != 'path' else f'<path d="{to_path(t, 2)}" fill="#fff"/>'
            items.append((e, s['bbox']))
    R = calib.render_tiles(items)
    if R is None:
        return
    for k, s in enumerate(cand):
        e0 = stroke.coverage_err(*s['F'], R[2 * k]); e1 = stroke.coverage_err(*s['F'], R[2 * k + 1])
        s['nosnap'] = not (e1 <= e0 * 1.02)


def choose_poly(shapes, found, ratio=0.75):
    """The source rasterizer flattens curves into chords; when the traced chord polygon reproduces
    the pixels markedly better than the smooth Bezier fit, keep the polygon."""
    import calib, stroke
    if not shapes:
        return
    items = []
    for s in shapes:
        ev = ' fill-rule="evenodd"' if s.get('holes') else ''
        items.append((f'<path d="{path_d(s)}" fill="#fff"{ev}/>', s['bbox']))
        alt = dict(s); alt['subs'] = s['poly']
        items.append((f'<path d="{path_d(alt)}" fill="#fff"{ev}/>', s['bbox']))
    R = calib.render_tiles(items)
    if R is None:
        return
    for k, s in enumerate(shapes):
        ec = stroke.coverage_err(*s['F'], R[2 * k]); ep = stroke.coverage_err(*s['F'], R[2 * k + 1])
        if ep < ratio * ec:
            s['subs'] = s['poly']; s['polygon'] = True


def child_units(byid, c, unit_of, units):
    """Units that region c maps to (suppressed regions pass through to their children)."""
    u = unit_of.get(c.id)
    if u is not None and u in units:
        return [u]
    out = []
    for g in c.children:
        out += child_units(byid, g, unit_of, units)
    return out


def describe(groups, root, shapes, found=None, merged=None):
    """One-line human description of what was found."""
    from collections import Counter
    def fill_of(gi):
        m = groups[gi].model
        if m.kind == 'flat':
            return hexcol(m.color)
        return f'{m.kind} gradient ({len(m.knots)} stops)'
    items = []
    for s in sorted(shapes, key=lambda s: s['z']):
        k = s['kind']; col = fill_of(s['group'])
        if k == 'stroke':
            g = s['geom']
            if g[0] == 'prim':
                what = f"stroked {'rounded rectangle' if g[1] == 'rrect' else ('rectangle' if g[1] == 'rect' else g[1])}"
            elif g[0] == 'poly':
                nv = len(g[1])
                what = (f'stroked {nv}-gon' if s['closed'] else f'stroked {nv - 1}-segment polyline')
                if s['join'] != 'miter':
                    what += f" ({s['join']} joins)"
            else:
                what = 'stroked curve'
            what += f" w={FT.fmtn(float(FT.snap(s['width'], 2, 0.03)), 2)}"
        elif k == 'path':
            nsub = len(s['subs'])
            nC = sum(1 for st, sg in s['subs'] for x in sg if x[0] == 'C')
            nL = sum(1 for st, sg in s['subs'] for x in sg if x[0] == 'L')
            if s.get('polygon'):
                what = f'path ({nL}-vertex chord polygon of a curved outline'
            elif nC == 0:
                what = f'polygon ({nL} edges'
            else:
                what = f'Bezier path ({nC} cubics, {nL} lines'
            what += f', {nsub - 1} hole{"s" if nsub > 2 else ""})' if nsub > 1 else ')'
        else:
            what = {'rect': 'rectangle', 'rrect': 'rounded rectangle', 'circle': 'circle', 'ellipse': 'ellipse'}[k]
            if k == 'ellipse':
                deg = math.degrees(s['prm'][4]) % 180
                if min(deg, 180 - deg) > 0.5:
                    what = 'rotated ellipse'
        items.append(f'{what} {col}')
    # many free-form paths of one colour (text, icons): summarise them
    pcount = Counter(fill_of(s['group']) for s in shapes if s['kind'] == 'path')
    agg = {c for c, n in pcount.items() if n >= 3}
    parts = []
    done = set()
    for s, it in zip(sorted(shapes, key=lambda s: s['z']), items):
        c = fill_of(s['group'])
        if s['kind'] == 'path' and c in agg:
            if c in done:
                continue
            done.add(c)
            ps = [x for x in shapes if x['kind'] == 'path' and fill_of(x['group']) == c]
            nh = sum(1 for x in ps if len(x['subs']) > 1)
            npoly = sum(1 for x in ps if x.get('polygon'))
            parts.append(f'{len(ps)} glyph-like paths {c} ({nh} with holes; {npoly} traced as chord polygons, {len(ps) - npoly} as Bezier/line outlines)')
            continue
        if it in done:
            continue
        done.add(it)
        n = items.count(it)
        parts.append((f'{n}x ' if n > 1 else '') + it)
    return f'background rect {fill_of(root.group)}; ' + '; '.join(parts)


def grad_defs(gid, g, dec):
    m = g.model
    f = lambda v: FT.fmtn(v, 2)
    k0, k1 = m.knots[0], m.knots[-1]
    span = max(k1 - k0, 1e-6)
    if m.kind == 'linear':
        n = m.n
        # points along n at t=k0 and t=k1 (t = x*n0 + y*n1)
        p0 = n * k0; p1 = n * k1
        stops = ''.join(f'<stop offset="{f((k - k0) / span)}" stop-color="{hexcol(c)}"/>' for k, c in zip(m.knots, m.cols))
        return (f'<linearGradient id="g{gid}" gradientUnits="userSpaceOnUse" x1="{f(p0[0])}" y1="{f(p0[1])}" '
                f'x2="{f(p1[0])}" y2="{f(p1[1])}">{stops}</linearGradient>')
    else:
        r = k1
        stops = ''.join(f'<stop offset="{f(max(k, 0) / r)}" stop-color="{hexcol(c)}"/>' for k, c in zip(m.knots, m.cols))
        return (f'<radialGradient id="g{gid}" gradientUnits="userSpaceOnUse" cx="{f(m.c[0])}" cy="{f(m.c[1])}" '
                f'r="{f(r)}">{stops}</radialGradient>')


def mkey(s):
    if s['kind'] == 'stroke':
        return ('stroke', s['group'], round(s['width'], 2), s['join'], s['cap'])
    return ('fill', s['group'])


def plan_merge(shapes):
    """Group same-fill shapes into one path element where z-order allows it."""
    shapes = sorted(shapes, key=lambda s: s['z'])
    merged = []
    for s in shapes:
        tgt = None
        for m in reversed(merged):
            if m['key'] == mkey(s):
                tgt = m; break
            if boxes_overlap(m['bbox'], s['bbox']):
                break
        if tgt is not None and not any(boxes_overlap(b, s['bbox']) for b in tgt['bboxes']):
            tgt['items'].append(s); tgt['bboxes'].append(s['bbox'])
        else:
            tgt = dict(group=s['group'], key=mkey(s), items=[s], bboxes=[s['bbox']], bbox=s['bbox'])
            merged.append(tgt)
        tgt['bbox'] = union_box(tgt['bboxes'])
    for m in merged:
        for s in m['items']:
            s['form'] = 'element' if len(m['items']) == 1 else 'path'
    return merged


def write_svg(W, H, groups, root, merged, dec):
    defs = []
    used = set([root.group] + [m['group'] for m in merged])
    fills = {}
    for gi in sorted(used):
        g = groups[gi]
        if g.model.kind == 'flat':
            fills[gi] = hexcol(g.model.color)
        else:
            defs.append(grad_defs(gi, g, dec))
            fills[gi] = f'url(#g{gi})'
    el = [f'<rect width="{W}" height="{H}" fill="{fills[root.group]}"/>']
    for m in merged:
        fill = fills[m['group']]
        items = m['items']
        if len(items) == 1:
            el.append(element(items[0], fill, dec))
        elif items[0]['kind'] == 'stroke':
            import stroke as STK
            it = items[0]
            el.append(STK.stroke_el(''.join(x['d'] for x in items), it['width'], it['join'], it['cap'], fill))
            continue
        else:
            d = ''.join(to_path(s, dec) for s in items)
            ev = ' fill-rule="evenodd"' if any(s.get('holes') for s in items) else ''
            el.append(f'<path d="{d}" fill="{fill}"{ev}/>')
    body = ''.join(el)
    d = f'<defs>{"".join(defs)}</defs>' if defs else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{d}{body}</svg>\n'


def boxes_overlap(a, b, m=2):
    return not (a[2] + m <= b[0] or b[2] + m <= a[0] or a[3] + m <= b[1] or b[3] + m <= a[1])


def union_box(bs):
    return (min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs))


def path_d(s, dec=2):
    eps = POLY_EPS if s.get('polygon') else 0.012
    return ''.join(FT.path_data(st, segs, 2, 1, eps) for st, segs in s['subs'])


def to_path(s, dec):
    k = s['kind']
    p = s.get('prm')
    if s.get('nosnap'):
        pass
    elif k == 'ellipse' and p is not None:
        p = snapped(p[:4]) + (p[4],)
    elif p is not None:
        p = snapped(p)
    if k == 'path':
        return path_d(s, dec)
    if k == 'circle':
        return FT.circle_path(*p, dec=2)
    if k == 'ellipse':
        return FT.ellipse_path(*p, dec=2)
    return FT.rect_path(*p, dec=2)


def snapped(p):
    """Primitive parameters: prefer round numbers when within 0.035 px (angles untouched)."""
    if p is None:
        return None
    return tuple(float(FT.snap(v, 2, 0.035)) for v in p)


def element(s, fill, dec):
    f = lambda v: FT.fmtn(v, 2)
    k = s['kind']; p = s.get('prm')
    if s.get('nosnap'):
        pass
    elif k == 'ellipse' and p is not None:
        p = snapped(p[:4]) + (p[4],)
    elif p is not None:
        p = snapped(p)
    if k == 'stroke':
        import stroke as STK
        return STK.geom_el(s['geom'], s['closed'], s['width'], s['join'], s['cap'], fill)
    if k == 'circle':
        return f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="{f(p[2])}" fill="{fill}"/>'
    if k == 'ellipse':
        cx, cy, rx, ry, th = p
        deg = math.degrees(th) % 180
        if deg > 90:
            deg -= 180
        tr = '' if abs(deg) < 0.05 else f' transform="rotate({FT.fmtn(deg, 2)} {f(cx)} {f(cy)})"'
        return f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}"{tr} fill="{fill}"/>'
    if k in ('rect', 'rrect'):
        x0, y0, x1, y1, r = p
        rr = f' rx="{f(r)}"' if r > 0 else ''
        return f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(x1 - x0)}" height="{f(y1 - y0)}"{rr} fill="{fill}"/>'
    ev = ' fill-rule="evenodd"' if s.get('holes') else ''
    return f'<path d="{path_d(s, dec)}" fill="{fill}"{ev}/>'


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__); sys.exit(1)
    if '--smooth' in a:
        POLY_ALT = False
    if '--fast' in a:
        CALIBRATE = False; REFINE = 0; STROKES = False; POLY_ALT = False
    desc = run(a[0], a[1])
    if '--json' in a:
        json.dump({'image': a[0], 'svg': a[1], 'found': desc}, open(a[a.index('--json') + 1], 'w'), indent=1)
