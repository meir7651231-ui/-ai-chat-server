"""ctypes binding of libvr.so: render an SVG string exactly like Chromium 141 (Skia CPU raster, cc tiling).
render() returns uint8 (H, W, 3); last_flags() tells whether the SVG used anything the native renderer does
not emulate bit-exactly (hairline strokes, opacity, text, ...) -- callers must then fall back to Chromium."""
import ctypes, os, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
_lib = ctypes.CDLL(os.path.join(HERE, 'libvr.so'))
_lib.vr_render_svg.argtypes = [ctypes.c_char_p, ctypes.c_int, ctypes.c_int, ctypes.c_void_p]
_lib.vr_render_svg.restype = ctypes.c_int
_flags = ctypes.c_int.in_dll(_lib, 'vr_flags')
_SZ = re.compile(r'width="(\d+)" height="(\d+)"')
FLAG_HAIRLINE, FLAG_UNSUPPORTED, FLAG_GRADIENT_APPROX = 1, 2, 4


def size_of(svg):
    m = _SZ.search(svg)
    return int(m.group(1)), int(m.group(2))


def render(svg, W=None, H=None, out=None):
    """-> uint8 array (H, W, 3)"""
    if W is None:
        W, H = size_of(svg)
    if out is None:
        out = np.empty((H, W, 3), np.uint8)
    _lib.vr_render_svg(svg.encode() if isinstance(svg, str) else svg, W, H, out.ctypes.data)
    return out


def last_flags():
    return _flags.value


def exact_ok(flags=None):
    """False when the SVG used something not reproduced bit-exactly: hairline strokes, unsupported elements or
    attributes, and objectBoundingBox / transformed gradients (rare 1-level differences found in calibration)."""
    f = last_flags() if flags is None else flags
    return (f & (FLAG_HAIRLINE | FLAG_UNSUPPORTED | FLAG_GRADIENT_APPROX)) == 0
