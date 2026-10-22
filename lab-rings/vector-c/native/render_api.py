"""Search-loop renderer: native libvr (bit-exact Chromium/Skia emulation) with per-render Chromium fallback.

VEC_RENDER=chrome   forces Chromium for every render (the original behaviour)
VEC_RENDER=native   (default) native renderer; a render whose SVG uses a feature libvr does not
                    emulate exactly (vr.last_flags() & (HAIRLINE|UNSUPPORTED)) is sent to Chromium.
VEC_RENDER_CHECK=N  additionally renders every N-th native render with Chromium and counts mismatches
                    (debug/validation aid; 0 = off).
"""
import os, sys, json, subprocess, tempfile, atexit
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import vr  # noqa: E402

MODE = os.environ.get('VEC_RENDER', 'native')
CHECK_EVERY = int(os.environ.get('VEC_RENDER_CHECK', '0'))
RSERVER = os.path.join(HERE, '..', 'prims', 'rserver.mjs')
STATS = dict(native=0, fallback=0, chrome=0, checked=0, check_mismatch=0)


class _Chrome:
    """Persistent Chromium (same page setup as vec/render.mjs)."""
    def __init__(self):
        self.dir = tempfile.mkdtemp(prefix='chr')
        self.p = subprocess.Popen(['node', RSERVER], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True,
                                  bufsize=1)
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
        a = np.asarray(Image.open(op).convert('RGB')).copy()
        os.remove(sp); os.remove(op)
        return a

    def close(self):
        try:
            self.p.kill(); self.p.wait(timeout=5)
        except Exception:
            pass


_chrome = None


def chrome():
    global _chrome
    if _chrome is None:
        _chrome = _Chrome()
        atexit.register(_chrome.close)
    return _chrome


def render_rgb(svg, scale=1):
    """-> uint8 (H, W, 3) exactly as Chromium would rasterize the SVG."""
    if MODE == 'chrome' or scale != 1:
        STATS['chrome'] += 1
        return chrome().render(svg, scale)
    out = vr.render(svg)
    if not vr.exact_ok():
        STATS['fallback'] += 1
        return chrome().render(svg)
    STATS['native'] += 1
    if CHECK_EVERY and STATS['native'] % CHECK_EVERY == 0:
        STATS['checked'] += 1
        ref = chrome().render(svg)
        if not np.array_equal(ref, out):
            STATS['check_mismatch'] += 1
            print(f'render_api: native/chrome mismatch (max {int(np.abs(ref.astype(int) - out).max())})',
                  file=sys.stderr)
    return out


def to_gray(rgb):
    """PIL convert('L') (ITU-R 601-2, fixed point) of a uint8 RGB array."""
    r = rgb[..., 0].astype(np.uint32); g = rgb[..., 1].astype(np.uint32); b = rgb[..., 2].astype(np.uint32)
    return ((r * 19595 + g * 38470 + b * 7471 + 0x8000) >> 16).astype(np.uint8)


def _find_render():
    # VEC_RENDER_MJS, else vec/render.mjs (scratchpad layout) or vector/render.mjs (repo layout), two levels up
    if os.environ.get('VEC_RENDER_MJS'):
        return os.environ['VEC_RENDER_MJS']
    for d in ('vec', 'vector'):
        p = os.path.join(HERE, '..', '..', d, 'render.mjs')
        if os.path.exists(p):
            return p
    raise FileNotFoundError('render.mjs not found: set VEC_RENDER_MJS to the path of vector/render.mjs')



def chrome_oneshot(svg):
    """One Chromium render exactly as vec/score.py does it (node vec/render.mjs)."""
    with tempfile.TemporaryDirectory() as td:
        sp = os.path.join(td, 'c.svg'); op = sp + '.png'
        with open(sp, 'w') as f:
            f.write(svg)
        subprocess.run(['node', _find_render(), sp, op], check=True, capture_output=True)
        return np.asarray(Image.open(op).convert('RGB')).copy()


def final_check(svg, log=None):
    """Render the chosen SVG with Chromium (as score.py does) and with libvr; returns dict(max, n, ok)."""
    ref = chrome_oneshot(svg)
    nat = vr.render(svg)
    fl = vr.last_flags()
    d = np.abs(ref.astype(np.int16) - nat.astype(np.int16)).max(-1)
    res = dict(max=int(d.max()), n=int((d > 0).sum()), flags=fl, stats=dict(STATS))
    # threshold: identical, or at most 1 level on <= 0.01% of the pixels
    res['ok'] = res['max'] == 0 or (res['max'] <= 1 and res['n'] <= d.size * 1e-4)
    if log:
        log(f'final check native vs chromium: {res}')
    return res, ref
