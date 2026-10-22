"""ctypes front-end of libvcfit.so (C kernels for the engines' Python hot loops).

Bit-exactness rests on calling numpy's own AVX-512 SVML pow (__svml_pow8_ha, located through the
module's symbol table) for x**3; a self-test against numpy runs at import and disables the C path
(-> original Python code) if anything does not match bit for bit.  VEC_C=0 disables it explicitly;
VEC_C_CHECK=1 runs C and Python side by side and raises on any difference (validation runs)."""
import os, sys, ctypes, subprocess, json
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ENABLED = os.environ.get('VEC_C', '1') != '0'
CHECK = os.environ.get('VEC_C_CHECK', '0') == '1'
STATS = dict(c=0, fallback=0, checked=0)
_lib = None


def _svml_pow8_ha():
    import numpy._core._multiarray_umath as mu
    so = mu.__file__
    cache = os.path.join(HERE, '.svml_offsets.json')
    st = os.stat(so)
    key = f'{so}:{st.st_size}:{int(st.st_mtime)}'
    off = None
    try:
        c = json.load(open(cache))
        if c.get('key') == key:
            off = c['off']
    except Exception:
        pass
    if off is None:
        out = subprocess.run(['nm', so], capture_output=True, text=True).stdout
        sym = {}
        for line in out.splitlines():
            p = line.split()
            if len(p) == 3 and p[2] in ('__svml_pow8_ha', 'PyInit__multiarray_umath'):
                sym[p[2]] = int(p[0], 16)
        if len(sym) != 2:
            return None
        off = sym['__svml_pow8_ha'] - sym['PyInit__multiarray_umath']
        try:
            json.dump({'key': key, 'off': off}, open(cache, 'w'))
        except Exception:
            pass
    h = ctypes.CDLL(so, mode=ctypes.RTLD_GLOBAL)   # already loaded: returns the same handle
    base = ctypes.cast(h.PyInit__multiarray_umath, ctypes.c_void_p).value
    return base + off


def _load():
    global _lib, ENABLED
    if not ENABLED:
        return None
    try:
        lib = ctypes.CDLL(os.path.join(HERE, 'libvcfit.so'))
        addr = _svml_pow8_ha()
        if addr is None:
            raise RuntimeError('svml symbol not found')
        lib.vc_set_pow8(ctypes.c_void_p(addr))
        # self-test: numpy x**3 == C pow3, bit for bit
        rng = np.random.default_rng(12345)
        x = np.concatenate([rng.random(4099), 1 - rng.random(1000), rng.normal(size=1000) * 40])
        o = np.empty_like(x)
        lib.vc_selftest_pow3(x.ctypes.data_as(ctypes.c_void_p), o.ctypes.data_as(ctypes.c_void_p), len(x))
        if not np.array_equal(o, x ** 3):
            raise RuntimeError('pow self-test mismatch')
        V, I = ctypes.c_void_p, ctypes.c_int
        lib.pm_project.restype = I
        lib.pm_project.argtypes = [I, ctypes.c_char_p, V, V, V, I, V, V, V]
        lib.vc_seg_dist.argtypes = [V, I, V, V, V]
        lib.vc_stroke_res_jac.argtypes = [V, I, V, I, I, V, V, V, V]
        lib.vc_solve_A.restype = I
        lib.vc_solve_A.argtypes = [I, ctypes.c_char_p, V, V, I, V, V, V, I, V]
        lib.vc_solve_A_coo.restype = I
        lib.vc_solve_A_coo.argtypes = [I, ctypes.c_char_p, V, V, V, V, V, I, V, V, V]
        lib.vc_solve_sparse.restype = I
        lib.vc_solve_sparse.argtypes = [I, ctypes.c_char_p, V, V, I, V, V, V, V, I, V, V, V]
        lib.vc_sse_f32.restype = ctypes.c_double
        lib.vc_sse_f32.argtypes = [V, V, ctypes.c_ssize_t]
        _lib = lib
    except Exception as e:
        print(f'vcfit: C kernels disabled ({e})', file=sys.stderr)
        ENABLED = False
        _lib = None
    return _lib


_load()
_P = ctypes.c_void_p


def pm_project(kinds, nodes, inner_of, D):
    """-> (seg int64, t, dist) exactly as geom.PathModel.project, or None (caller uses Python)."""
    if _lib is None:
        return None
    m = len(kinds)
    kb = ''.join(kinds).encode()
    nodes = np.ascontiguousarray(nodes, dtype=np.float64)
    inner = np.zeros((m, 2, 2))
    for i, v in inner_of.items():
        v = np.asarray(v, float)
        inner[i, :len(v)] = v
    D = np.ascontiguousarray(D, dtype=np.float64)
    nd = len(D)
    seg = np.empty(nd, np.int64); t = np.empty(nd); dist = np.empty(nd)
    rc = _lib.pm_project(m, kb, nodes.ctypes.data, inner.ctypes.data, D.ctypes.data, nd, seg.ctypes.data,
                         t.ctypes.data, dist.ctypes.data)
    if rc != 0:
        STATS['fallback'] += 1
        return None
    STATS['c'] += 1
    return seg, t, dist


def seg_dist(P, A, B):
    if _lib is None:
        return None
    P = np.ascontiguousarray(P, dtype=np.float64)
    if P.ndim != 2 or P.shape[1] != 2:
        return None
    A = np.ascontiguousarray(A, dtype=np.float64); B = np.ascontiguousarray(B, dtype=np.float64)
    out = np.empty(len(P))
    _lib.vc_seg_dist(P.ctypes.data, len(P), A.ctypes.data, B.ctypes.data, out.ctypes.data)
    STATS['c'] += 1
    return out


def stroke_res_jac(P, VV, closed):
    if _lib is None:
        return None
    P = np.ascontiguousarray(P, dtype=np.float64); VV = np.ascontiguousarray(VV, dtype=np.float64)
    n = len(P)
    bd = np.empty(n); best = np.empty((n, 4)); nx = np.empty(n); ny = np.empty(n)
    _lib.vc_stroke_res_jac(P.ctypes.data, n, VV.ctypes.data, len(VV), 1 if closed else 0, bd.ctypes.data,
                           best.ctypes.data, nx.ctypes.data, ny.ctypes.data)
    STATS['c'] += 1
    return bd, best, nx, ny


def solve_A(kinds, var, nv, seg, t, w, nd):
    """A (nd x nv) of PathModel.solve, or None."""
    if _lib is None:
        return None
    m = len(kinds)
    v0 = np.zeros(m, np.int32); v1 = np.zeros(m, np.int32)
    for i, vv in var.items():
        v0[i] = vv[0]
        if len(vv) > 1:
            v1[i] = vv[1]
    seg = np.ascontiguousarray(seg, dtype=np.int64); t = np.ascontiguousarray(t, dtype=np.float64)
    w = np.ascontiguousarray(w, dtype=np.float64)
    A = np.zeros((nd, nv))
    rc = _lib.vc_solve_A(m, ''.join(kinds).encode(), v0.ctypes.data, v1.ctypes.data, nv, seg.ctypes.data,
                         t.ctypes.data, w.ctypes.data, nd, A.ctypes.data)
    if rc != 0:
        return None
    STATS['c'] += 1
    return A


def sse_f32(a, b):
    """float(((a - b) ** 2).sum()) for equal-shape C-contiguous float32 arrays (numpy pairwise order), or None."""
    if _lib is None or a.dtype != np.float32 or b.dtype != np.float32 or a.shape != b.shape \
            or not a.flags.c_contiguous or not b.flags.c_contiguous:
        return None
    return _lib.vc_sse_f32(a.ctypes.data, b.ctypes.data, a.size)


def solve_A_coo(kinds, var, seg, t, w, nd):
    """Sparse A of PathModel.solve as (rows, cols, vals), same entries as the dense A; or None."""
    if _lib is None:
        return None
    m = len(kinds)
    v0 = np.zeros(m, np.int32); v1 = np.zeros(m, np.int32)
    for i, vv in var.items():
        v0[i] = vv[0]
        if len(vv) > 1:
            v1[i] = vv[1]
    seg = np.ascontiguousarray(seg, dtype=np.int64); t = np.ascontiguousarray(t, dtype=np.float64)
    w = np.ascontiguousarray(w, dtype=np.float64)
    rows = np.empty(4 * nd, np.int32); cols = np.empty(4 * nd, np.int32); vals = np.empty(4 * nd)
    n = _lib.vc_solve_A_coo(m, ''.join(kinds).encode(), v0.ctypes.data, v1.ctypes.data, seg.ctypes.data, t.ctypes.data,
                            w.ctypes.data, nd, rows.ctypes.data, cols.ctypes.data, vals.ctypes.data)
    if n < 0:
        return None
    STATS['c'] += 1
    return rows[:n], cols[:n], vals[:n]


def solve_sparse(kinds, var, nv, seg, t, w, D, reg, tgt):
    """Solution X (nv x 2) of the PathModel normal equations via the C envelope Cholesky, or None."""
    if _lib is None:
        return None
    m = len(kinds)
    v0 = np.zeros(m, np.int32); v1 = np.zeros(m, np.int32)
    for i, vv in var.items():
        v0[i] = vv[0]
        if len(vv) > 1:
            v1[i] = vv[1]
    seg = np.ascontiguousarray(seg, dtype=np.int64); t = np.ascontiguousarray(t, dtype=np.float64)
    w = np.ascontiguousarray(w, dtype=np.float64); D = np.ascontiguousarray(D, dtype=np.float64)
    reg = np.ascontiguousarray(reg, dtype=np.float64); tgt = np.ascontiguousarray(tgt, dtype=np.float64)
    X = np.empty((nv, 2))
    rc = _lib.vc_solve_sparse(m, ''.join(kinds).encode(), v0.ctypes.data, v1.ctypes.data, nv, seg.ctypes.data,
                              t.ctypes.data, w.ctypes.data, D.ctypes.data, len(D), reg.ctypes.data, tgt.ctypes.data,
                              X.ctypes.data)
    if rc != 0:
        STATS['fallback'] += 1
        return None
    STATS['sparse'] = STATS.get('sparse', 0) + 1
    return X
