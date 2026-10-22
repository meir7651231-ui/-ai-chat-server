"""xcheck.py IMG [order...] : run the original Python encoder (model_tpl.py) and the C port (dictcm, RB=256)
on IMG and compare the digit streams byte for byte."""
import sys, os, json, subprocess, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from PIL import Image
import engine
img = Image.open(sys.argv[1]).convert('RGB'); W, H = img.size
order = json.loads(sys.argv[2]) if len(sys.argv) > 2 else engine.DEFAULT['order']
p = dict(engine.DEFAULT, order=order)
tmp = os.path.join(HERE, '..', 'work', 'dt'); os.makedirs(tmp, exist_ok=True)
raw = os.path.join(tmp, 'x%d.rgb' % os.getpid()); open(raw, 'wb').write(img.tobytes())
t0 = time.time(); digs, P = engine.encode_cm(img, p, verbose=False); t1 = time.time()
out = os.path.join(tmp, 'x%d.dig' % os.getpid())
subprocess.run([os.path.join(HERE, os.environ.get('DICTCM', 'dictcm')), raw, str(W), str(H), out] + [str(o) for o in order] +
               [str(p['nc']), str(p['T']), str(p['lim']), repr(p['lr']), repr(p['ar']), '256'], check=True, capture_output=True)
t2 = time.time()
c = list(open(out, 'rb').read())
same = c == digs
first = next((k for k in range(min(len(c), len(digs))) if c[k] != digs[k]), None)
print(json.dumps(dict(image=sys.argv[1], order=order, py_digits=len(digs), c_digits=len(c), identical=same, first_diff=first,
                      py_s=round(t1 - t0, 2), c_s=round(t2 - t1, 2))))
