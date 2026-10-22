#!/usr/bin/env python3
"""engine.py -- generic image -> standalone Python program that redraws it pixel-exactly.

Approach "predict": every sample is predicted from already-drawn neighbours (MED for G, a
colour-line predictor for R/B, a 2-D match model for repeats) and only the prediction residuals
are stored, coded by a binary context-mixing model + arithmetic coder.  The encoder is C
(pxenc.c, compiled with gcc on first use); the generated program carries the bit-exact decoder
in pure Python (lzma-compressed inside the program) plus the coded residuals as a base-124 ASCII
bytes literal.  The engine only looks at the pixels of the input image.

usage: python3 engine.py input.png output.py [--verify] [--search] [KEY=value ...]
       python3 engine.py input.png output.c  --c [--png] [--verify] [--search] [KEY=value ...]
   --verify  run the generated program (OUT=...) and count differing pixels
   --search  per-image greedy tuning of the model switches (slower encode, smaller program)
   --c       px-c target: emit ONE standalone C file instead of Python (decoder = cgen.py, the
             bit-exact C mirror of pxenc.c; coder radix 251 = one raw byte per digit in a C string).
             The search objective is then the byte size of the .c file before cmin's macro pass (which
             only shrinks the final file) and before the rare '""' splits of the data literal.  C-target search: the context-toggle step tries the
             k most helpful flips together for a ladder of k (not only "all of them"), and up to 4 rounds
             run while a round still gains >= 0.2%.  The Python target keeps the original search exactly,
             so it still reproduces the archived px-predict programs byte for byte.
             Run: gcc -O2 prog.c -o prog && ./prog OUT.ppm   (--png: ./prog OUT.png, own PNG writer)
Encoder processes: a pool of `pxenc --serve` workers (tables stay allocated between the search's encodes);
PXENC_SERVE=0 = one process per encode (same digits).  PX_CFLAGS overrides the encoder's -O2.
"""
import os, sys, json, subprocess, tempfile, time, shutil
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pxgen as G
import cgen

DEFAULT = {"CM": 6390440155575, "MS": 53, "TB": 25, "LR": 12, "LIM": 30, "LRF": 4, "APMW": 3,
           "LT": 2, "MR": 4, "NQ": 5, "WI": 4000, "ETH": 256}

def encoder():
    src = os.path.join(HERE, "pxenc.c"); exe = os.path.join(HERE, "pxenc")
    if not os.path.exists(exe) or os.path.getmtime(exe) < os.path.getmtime(src):
        subprocess.check_call(["gcc"] + os.environ.get("PX_CFLAGS", "-O2").split() + ["-o", exe, src, "-lm"])
    return exe

# pool of long-lived `pxenc --serve` workers: the encoder's ~230 MB of tables stay allocated (huge pages)
# between the many encodes of a parameter search instead of being faulted in again for every run.
# The digits are identical to one-shot runs (PXENC_SERVE=0 switches back to one process per encode).
import queue, threading, atexit
_idle = queue.Queue(); _all = []; _lock = threading.Lock()

def _close_workers():
    while _all:
        w = _all.pop()
        try:
            w.stdin.close(); w.wait(timeout=10)
        except Exception:
            w.kill()
atexit.register(_close_workers)

def run_enc(raw, W, H, cfg, out, rb=124):
    args = [raw, str(W), str(H), out] + ["%s=%d" % (k, v) for k, v in cfg.items()] + ["RB=%d" % rb]
    if os.environ.get("PXENC_SERVE", "1") == "0" or any(c.isspace() for a in args for c in a):
        return subprocess.run([encoder()] + args, capture_output=True, text=True, check=True).stdout.strip()
    try:
        w = _idle.get_nowait()
    except queue.Empty:
        w = subprocess.Popen([encoder(), "--serve"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
        with _lock:
            _all.append(w)
    try:
        w.stdin.write(" ".join(args) + "\n"); w.stdin.flush()
        r = w.stdout.readline().strip()
    except Exception:
        w.kill(); raise
    if not r or r.startswith("ERROR"):
        w.kill(); raise RuntimeError("pxenc failed: %r for %s" % (r, args))
    _idle.put(w)
    return r

def search_cfg(raw, W, H, cfg, tmp, log, rounds=2, target="py", png=False):
    """greedy per-image tuning; objective = exact byte size of the generated program"""
    cache = {}; cnt = [0]
    def size(c):
        key = tuple(sorted(c.items()))
        if key not in cache:
            cnt[0] += 1
            o = os.path.join(tmp, "s%d.dig" % cnt[0])
            run_enc(raw, W, H, c, o, cgen.RB if target == "c" else 124)
            d = open(o, "rb").read(); os.remove(o)
            if target == "c":
                cache[key] = cgen.code_size(W, H, c, len(d), png)
            else:
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
        if good and target == "c":
            # C target: in C nearly every context costs more code than in the lzma-packed Python program, so
            # often almost every single flip "helps" and flipping all of them at once overshoots.  Try the k
            # most helpful flips together for a ladder of k and keep the best (single best flip included).
            rank = sorted((i for i in range(len(s)) if s[i] < cs), key=lambda i: (s[i], i))
            ks = sorted(set([len(rank)] + [k for k in (2, 3, 4, 6, 8, 12, 16, 24, 32, 48) if k < len(rank)]))
            combos = [dict(cur, CM=cur["CM"] ^ sum(1 << toggles[i] for i in rank[:k])) for k in ks]
            sc = sizes_of(combos)
            best = min([(s[rank[0]], 0, cands[rank[0]])] + [(sc[j], j + 1, combos[j]) for j in range(len(ks))], key=lambda t: t[:2])
            cs, cur = best[0], best[2]
        elif good:
            i = min(range(len(s)), key=s.__getitem__)
            allc = dict(cur, CM=cur["CM"] ^ sum(1 << t for t in good))
            sa = size(allc)
            cur, cs = (allc, sa) if sa < s[i] else (cands[i], s[i])
        log("search: round %d -> %d bytes (%d encodes)" % (rnd + 1, cs, cnt[0]))
        if cs >= before: break
        if target == "c" and before - cs < before * 0.002: break     # C target: up to `rounds`, while a round still gains >= 0.2%
    return cur

def build(png, outpy, cfg=None, search=False, verify=False, log=print, target="py", pngout=False):
    im = Image.open(png).convert("RGB"); W, H = im.size
    # counter-table size: 2^25 slots for ~0.35 Mpixel and up, smaller tables for small images
    cfg = dict(DEFAULT, TB=min(25, max(16, (W * H * 48).bit_length())), **(cfg or {}))
    work = os.path.join(HERE, "work"); os.makedirs(work, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="pxeng-", dir=work)
    try:
        raw = os.path.join(tmp, "img.rgb"); open(raw, "wb").write(im.tobytes())
        t0 = time.time()
        if search:
            cfg = search_cfg(raw, W, H, cfg, tmp, log, rounds=4 if target == "c" else 2, target=target, png=pngout)
        dig = os.path.join(tmp, "img.dig")
        info = run_enc(raw, W, H, cfg, dig, cgen.RB if target == "c" else 124)
        digits = open(dig, "rb").read()
        if target == "c":
            prog, code_bytes, data_bytes = cgen.gen(digits, W, H, cfg, pngout)
            open(outpy, "wb").write(prog)
            nbytes = len(prog)
        else:
            prog, code_bytes, data_bytes = G.gen(digits, W, H, cfg)
            open(outpy, "w").write(prog)
            nbytes = len(prog.encode())
        res = {"image": png, "program": outpy, "target": target, "bytes": nbytes, "code_bytes": code_bytes,
               "data_bytes": data_bytes, "encode_seconds": round(time.time() - t0, 1), "cfg": cfg}
        log("pxenc: " + info)
        log("wrote %s: %d bytes (code %d + data %d)" % (outpy, res["bytes"], code_bytes, data_bytes))
        if verify and target == "c":
            exe = os.path.join(tmp, "prog"); outpng = os.path.join(tmp, "out.png" if pngout else "out.ppm")
            t1 = time.perf_counter()
            subprocess.run(["gcc", "-O2", outpy, "-o", exe], check=True, capture_output=True)
            res["compile_seconds"] = round(time.perf_counter() - t1, 2)
            t1 = time.perf_counter()
            subprocess.run([exe, outpng], check=True, cwd=tmp)
            res["run_seconds"] = round(time.perf_counter() - t1, 2)
        elif verify:
            outpng = os.path.join(tmp, "out.png")
            t1 = time.time()
            subprocess.run([sys.executable, "-c", "OUT=%r; exec(open(%r).read())" % (outpng, outpy)], check=True)
            res["run_seconds"] = round(time.time() - t1, 1)
        if verify:
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
              search="--search" in sys.argv, verify="--verify" in sys.argv,
              target="c" if "--c" in sys.argv else "py", pngout="--png" in sys.argv)
    print(json.dumps(r))
