"""test_lz_c.py IMG... : compile+run the C dict+lzma decoder for EVERY layout variant the search tries
(palette/rgb, tiles, colour transform, 5 predictors, planar, lzma lc/lp/pb) and count differing pixels."""
import sys, os, subprocess, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from PIL import Image
import dictlz
CMP = os.environ.get('PX_COMPARE') or os.path.join(HERE, '..', '..', 'pixels', 'compare.py')
tmp = tempfile.mkdtemp(dir=os.path.join(HERE, '..', 'work'))
bad = 0; n = 0
for path in sys.argv[1:]:
    img = Image.open(path).convert('RGB')
    allc = []
    dictlz.search(img, keep_all=allc)
    seen = set()
    for cand in allc:
        key = cand[1:6]
        if key in seen: continue
        seen.add(key)
        prog, info = dictlz.build_c(img, best=cand)
        c = os.path.join(tmp, 'p.c'); exe = os.path.join(tmp, 'p'); out = os.path.join(tmp, 'o.ppm')
        open(c, 'wb').write(prog)
        for f in (exe, out):
            if os.path.exists(f): os.remove(f)
        r = subprocess.run(['gcc', '-O2', c, '-o', exe, '-llzma'], capture_output=True, text=True)
        if r.returncode: print('COMPILE FAIL', key, r.stderr[:300]); bad += 1; continue
        subprocess.run([exe, out], check=True)
        res = subprocess.run(['python3', CMP, path, out], capture_output=True, text=True).stdout.strip()
        ok = res.endswith(' 0 different'); n += 1; bad += not ok
        if not ok: print('MISMATCH', os.path.basename(path), key, res)
    print(os.path.basename(path), len(seen), 'variants tested')
print('variants', n, 'failures', bad)
