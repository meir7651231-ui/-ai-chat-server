"""Persistent Chromium renderer (same page setup as vec/render.mjs, via prims' rserver.mjs)."""
import os, json, subprocess, tempfile
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
RSERVER = os.path.join(HERE, '..', 'prims', 'rserver.mjs')


class Chrome:
    def __init__(self):
        self.dir = tempfile.mkdtemp(prefix='chr')
        self.p = subprocess.Popen(['node', RSERVER], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
        self.n = 0

    def render(self, svg):
        self.n += 1
        sp = os.path.join(self.dir, f's{self.n}.svg'); op = sp + '.png'
        open(sp, 'w').write(svg)
        self.p.stdin.write(json.dumps({'svg': sp, 'out': op, 'scale': 1}) + '\n'); self.p.stdin.flush()
        line = self.p.stdout.readline()
        if not line.startswith('ok'):
            raise RuntimeError(line)
        a = np.asarray(Image.open(op).convert('RGB')).copy()
        os.remove(sp); os.remove(op)
        return a

    def close(self):
        try:
            self.p.stdin.close(); self.p.wait(timeout=10)
        except Exception:
            self.p.kill()
