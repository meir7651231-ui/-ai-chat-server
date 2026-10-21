#!/usr/bin/env python3
"""engine.py -- generic image -> standalone Python program that redraws it pixel-exactly.

Approach "predict": every sample is predicted from already-drawn neighbours (MED for G, a
colour-line predictor for R/B, a 2-D match model for repeats) and only the prediction residuals
are stored, coded by a binary context-mixing model + arithmetic coder.  The encoder is C
(pxenc.c, compiled with gcc on first use); the generated program carries the bit-exact decoder
in pure Python (lzma-compressed inside the program) plus the coded residuals as a base-124 ASCII
bytes literal.  The engine only looks at the pixels of the input image.

usage: python3 engine.py input.png output.py [--verify] [--search] [KEY=value ...]
   --verify  run the generated program (OUT=...) and count differing pixels
   --search  per-image greedy tuning of the model switches (slower encode, smaller program)
"""
import os, sys, json, subprocess, tempfile, time, shutil
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pxgen as G

DEFAULT = {"CM": 6390440155575, "MS": 53, "TB": 25, "LR": 12, "LIM": 30, "LRF": 4, "APMW": 3,
           "LT": 2, "MR": 4, "NQ": 5, "WI": 4000, "ETH": 256}

def encoder():
    src = os.path.join(HERE, "pxenc.c"); exe = os.path.join(HERE, "pxenc")
    if not os.path.exists(exe) or os.path.getmtime(exe) < os.path.getmtime(src):
        subprocess.check_call(["gcc", "-O2", "-o", exe, src, "-lm"])
    return exe

def run_enc(raw, W, H, cfg, out):
    args = [encoder(), raw, str(W), str(H), out] + ["%s=%d" % (k, v) for k, v in cfg.items()]
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout.strip()

def search_cfg(raw, W, H, cfg, tmp, log, rounds=2):
    """greedy per-image tuning; objective = exact byte size of the generated program"""
    cache = {}; cnt = [0]
    def size(c):
        key = tuple(sorted(c.items()))
        if key not in cache:
            cnt[0] += 1
            o = os.path.join(tmp, "s%d.dig" % cnt[0])
            run_enc(raw, W, H, c, o)
            d = open(o, "rb").read(); os.remove(o)
            cache[key] = len(G.gen(d, W, H, c)[0].encode())
        return cache[key]
    ncpu = max(1, min(4, os.cpu_count() or 1))
    def sizes_of(cands):
        with ThreadPoolExecutor(ncpu) as ex:
            return list(ex.map(size, cands))
    grid = {"LR": (8, 10, 12, 14), "NQ": (4, 5, 6), "LIM": (24, 30), "WI": (3000, 4000, 6000),
            "LT": (2, 3), "APMW": (2, 3), "LRF": (3, 4, 6)}
    toggles = sorted(G.CTXPY)
    cur, cs = cfg, size(cfg)
    log("search: start %d bytes" % cs)
    for rnd in range(rounds):
        before = cs
        for k, vals in grid.items():
            cands = [dict(cur, **{k: v}) for v in vals]
            s = sizes_of(cands); i = min(range(len(s)), key=s.__getitem__)
            if s[i] < cs: cur, cs = cands[i], s[i]
        # context toggles: try every single on/off flip, then all helpful flips together
        cands = [dict(cur, CM=cur["CM"] ^ (1 << i)) for i in toggles]
        s = sizes_of(cands)
        good = [toggles[i] for i in range(len(s)) if s[i] < cs]
        if good:
            i = min(range(len(s)), key=s.__getitem__)
            allc = dict(cur, CM=cur["CM"] ^ sum(1 << t for t in good))
            sa = size(allc)
            cur, cs = (allc, sa) if sa < s[i] else (cands[i], s[i])
        log("search: round %d -> %d bytes (%d encodes)" % (rnd + 1, cs, cnt[0]))
        if cs >= before: break
    return cur

def build(png, outpy, cfg=None, search=False, verify=False, log=print):
    im = Image.open(png).convert("RGB"); W, H = im.size
    # counter-table size: 2^25 slots for ~0.35 Mpixel and up, smaller tables for small images
    cfg = dict(DEFAULT, TB=min(25, max(16, (W * H * 48).bit_length())), **(cfg or {}))
    work = os.path.join(HERE, "work"); os.makedirs(work, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="pxeng-", dir=work)
    try:
        raw = os.path.join(tmp, "img.rgb"); open(raw, "wb").write(im.tobytes())
        t0 = time.time()
        if search:
            cfg = search_cfg(raw, W, H, cfg, tmp, log)
        dig = os.path.join(tmp, "img.dig")
        info = run_enc(raw, W, H, cfg, dig)
        digits = open(dig, "rb").read()
        prog, code_bytes, data_bytes = G.gen(digits, W, H, cfg)
        open(outpy, "w").write(prog)
        res = {"image": png, "program": outpy, "bytes": len(prog.encode()), "code_bytes": code_bytes,
               "data_bytes": data_bytes, "encode_seconds": round(time.time() - t0, 1), "cfg": cfg}
        log("pxenc: " + info)
        log("wrote %s: %d bytes (code %d + data %d)" % (outpy, res["bytes"], code_bytes, data_bytes))
        if verify:
            outpng = os.path.join(tmp, "out.png")
            t1 = time.time()
            subprocess.run([sys.executable, "-c", "OUT=%r; exec(open(%r).read())" % (outpng, outpy)], check=True)
            res["run_seconds"] = round(time.time() - t1, 1)
            a = Image.open(png).convert("RGB"); b = Image.open(outpng).convert("RGB")
            if a.size != b.size: res["differing_pixels"] = W * H
            else:
                pa, pb = a.load(), b.load()
                res["differing_pixels"] = sum(1 for y in range(H) for x in range(W) if pa[x, y] != pb[x, y])
            log("verify: %d differing pixels, run %.1fs" % (res["differing_pixels"], res["run_seconds"]))
        return res
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    pos = [x for x in sys.argv[1:] if not x.startswith("--") and "=" not in x]
    if len(pos) != 2: print(__doc__); sys.exit(2)
    kv = dict(x.split("=", 1) for x in sys.argv[1:] if "=" in x and not x.startswith("--"))
    r = build(pos[0], pos[1], {k: int(v, 0) for k, v in kv.items()},
              search="--search" in sys.argv, verify="--verify" in sys.argv)
    print(json.dumps(r))
