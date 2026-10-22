"""test_c.py IMG... : build the C program for many model configurations (every context switch flipped,
match model off, other mixer gates, PNG writer) and check each compiles and redraws IMG exactly."""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import engine, pxgen as G
bad = n = 0
for path in sys.argv[1:]:
    cfgs = [{}, {"MR": 0}, {"MS": 63}, {"MS": 1}, {"APMW": 0}, {"APMW": 4}, {"LT": 9}, {"MR": 1}]
    cm = engine.DEFAULT["CM"]
    cfgs += [{"CM": cm ^ (1 << i)} for i in sorted(G.CTXPY)]
    cfgs += [{"CM": sum(1 << i for i in sorted(G.CTXPY))}]
    for k, c in enumerate(cfgs):
        for png in ((False, True) if k < 2 else (False,)):
            out = os.path.join(HERE, '..', 'work', 'tc_%d.c' % os.getpid())
            r = engine.build(path, out, dict(c), verify=True, target="c", pngout=png, log=lambda *a: None)
            n += 1
            if r["differing_pixels"]:
                bad += 1; print("MISMATCH", path, c, png, r["differing_pixels"])
    print(os.path.basename(path), "done")
print("configs", n, "failures", bad)
