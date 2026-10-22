#!/usr/bin/env python3
"""bench.py -- timing / exactness harness for px-c (old Python path vs new C path).

  bench.py enc-new ENGINE NAME     new engine (C target) -> results/ENGINE/NAME.c (+ .json, .log)
  bench.py enc-old ENGINE NAME     original Python engine (old/src/ENGINE) -> results/oldrerun/ENGINE/NAME.py,
                                   checked byte for byte against the archived old program old/ENGINE/NAME.py
  bench.py run-old ENGINE NAME     run old/ENGINE/NAME.py the baseline way, compare pixels
  bench.py run-new ENGINE NAME     gcc -O2 results/ENGINE/NAME.c (compile timed), run ./prog OUT.ppm, compare pixels
  bench.py pyregress ENGINE NAME   px-c's own Python path (kept working) must reproduce old/ENGINE/NAME.py exactly

ENGINE = predict | dict, NAME = wall | code | dark | new.  Every call appends one JSON line to results/bench.jsonl.
Wall time = time.perf_counter() (monotonic) around the child process, everything under nice -n 10, one job at a
time.  Jobs shorter than 10 s are repeated 3x and the median is reported (all samples are logged too).
"""
import sys, os, json, time, subprocess, statistics, tempfile, shutil, re

PX = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.dirname(PX)
IMG = {'wall': S + '/out/px/wall-540.png', 'code': S + '/out/px/code-540.png',
       'dark': S + '/out/px/dark-540.png', 'new': S + '/px-verify/new.png'}
CMP = S + '/out/px/compare.py'
LOG = os.path.join(PX, 'results', 'bench.jsonl')
NICE = ['nice', '-n', '10']


CPU = []          # user+sys CPU seconds of the child process tree, per timed() call (load-independent view)


def timed(cmd, **kw):
    import resource
    u0 = resource.getrusage(resource.RUSAGE_CHILDREN)
    t = time.perf_counter()
    r = subprocess.run(cmd, capture_output=True, **kw)
    dt = time.perf_counter() - t
    u1 = resource.getrusage(resource.RUSAGE_CHILDREN)
    CPU.append(round(u1.ru_utime - u0.ru_utime + u1.ru_stime - u0.ru_stime, 2))
    return dt, r


def timed3(cmd, **kw):
    """run once; if it took < 10 s run twice more and take the median"""
    dt, r = timed(cmd, **kw)
    ts = [dt]
    if r.returncode == 0 and dt < 10:
        for _ in range(2):
            d2, r2 = timed(cmd, **kw)
            ts.append(d2)
            if r2.returncode:
                r = r2; break
    return statistics.median(ts), ts, r


def compare(orig, out):
    c = subprocess.run(['python3', CMP, orig, out], capture_output=True, text=True)
    txt = (c.stdout + c.stderr).strip()
    m = re.search(r'· (\d+) different', txt)
    return (int(m.group(1)) if m else None), txt


def split_c(path):
    """(total bytes, code bytes, data bytes); data = the arithmetic-coder / lzma digit string literal"""
    d = open(path, 'rb').read()
    lits = [m for m in re.finditer(rb'"(?:[^"\\\n]|\\.|"")*"', d)]     # "" = split inside the data literal
    big = max(lits, key=lambda m: len(m.group()))
    data = len(big.group()) - 2
    return len(d), len(d) - data, data


def log(rec):
    rec['cpu_seconds'] = list(CPU)
    rec['load1'] = round(os.getloadavg()[0], 2)
    rec['when'] = time.strftime('%Y-%m-%dT%H:%M:%S')
    with open(LOG, 'a') as f:
        f.write(json.dumps(rec) + '\n')
    print(json.dumps(rec), flush=True)


def last_json(text):
    for line in reversed(text.strip().split('\n')):
        line = line.strip()
        if line.startswith('{'):
            try:
                return json.loads(line)
            except ValueError:
                pass
    return None


def enc_new(eng, name):
    out = os.path.join(PX, 'results', eng, name + '.c')
    if eng == 'predict':
        cmd = NICE + ['python3', PX + '/predict/engine.py', IMG[name], out, '--c', '--search']
    else:
        cmd = NICE + ['python3', '-W', 'ignore', PX + '/dict/engine.py', IMG[name], out, '--c', '--orders', 'all']
    dt, r = timed(cmd, text=True)
    open(out[:-2] + '.log', 'w').write(r.stdout + r.stderr)
    info = last_json(r.stdout) or {}
    json.dump(info, open(out[:-2] + '.json', 'w'))
    tot, code, data = split_c(out) if r.returncode == 0 else (None, None, None)
    log(dict(job='enc-new', engine=eng, image=name, rc=r.returncode, seconds=round(dt, 2), program=out,
             bytes=tot, code_bytes=code, data_bytes=data, method=info.get('method', 'predict-cm'), link=info.get('link', '')))


def enc_old(eng, name):
    out = os.path.join(PX, 'results', 'oldrerun', eng, name + '.py')
    src = os.path.join(PX, 'old', 'src', eng, 'engine.py')
    if eng == 'predict':
        cmd = NICE + ['python3', src, IMG[name], out, '--search']
    else:
        cmd = NICE + ['python3', src, IMG[name], out, '--orders', 'all']
    dt, r = timed(cmd, text=True)
    open(out[:-3] + '.log', 'w').write(r.stdout + r.stderr)
    ref = os.path.join(PX, 'old', eng, name + '.py')
    same = r.returncode == 0 and open(out, 'rb').read() == open(ref, 'rb').read()
    log(dict(job='enc-old', engine=eng, image=name, rc=r.returncode, seconds=round(dt, 2), program=out,
             bytes=os.path.getsize(out) if r.returncode == 0 else None, identical_to_archived=same))


def run_old(eng, name):
    prog = os.path.join(PX, 'old', eng, name + '.py')
    tmp = tempfile.mkdtemp(prefix='runold-', dir=os.path.join(PX, 'work'))
    outp = os.path.join(tmp, 'out.png')
    cmd = NICE + ['python3', '-c', "OUT=%r; exec(open(%r).read())" % (outp, prog)]
    med, ts, r = timed3(cmd, cwd=tmp)
    diff, txt = compare(IMG[name], outp) if r.returncode == 0 else (None, r.stderr[-300:])
    shutil.rmtree(tmp, ignore_errors=True)
    log(dict(job='run-old', engine=eng, image=name, rc=r.returncode, seconds=round(med, 3), samples=[round(t, 3) for t in ts],
             bytes=os.path.getsize(prog), differing_pixels=diff, compare=txt))


def run_new(eng, name):
    src = os.path.join(PX, 'results', eng, name + '.c')
    info = json.load(open(src[:-2] + '.json'))
    tmp = tempfile.mkdtemp(prefix='runnew-', dir=os.path.join(PX, 'work'))
    exe = os.path.join(tmp, 'prog')
    link = info.get('link', '').split()
    cmp_med, cmp_ts, rc = timed3(NICE + ['gcc', '-O2', src, '-o', exe] + link)
    if rc.returncode:
        log(dict(job='run-new', engine=eng, image=name, rc=rc.returncode, error=rc.stderr[-500:].decode('latin-1')))
        return
    warn = rc.stderr.decode('latin-1').strip()
    outp = os.path.join(tmp, 'out.ppm')
    med, ts, r = timed3(NICE + [exe, outp], cwd=tmp)
    diff, txt = compare(IMG[name], outp) if r.returncode == 0 else (None, r.stderr[-300:])
    # the program must not open any file but its output (checked with strace when available)
    opened = None
    if shutil.which('strace'):
        st = os.path.join(tmp, 'st.txt')
        subprocess.run(['strace', '-f', '-qq', '-e', 'trace=open,openat,openat2,creat', '-o', st, exe, outp], cwd=tmp, capture_output=True)
        opened = sorted(set(m.group(1) for m in re.finditer(r'open\w*\([^"]*"([^"]+)"', open(st).read())
                            if not m.group(1).startswith(('/etc/ld.so', '/lib', '/usr/lib', '/lib64'))))
    tot, code, data = split_c(src)
    shutil.rmtree(tmp, ignore_errors=True)
    log(dict(job='run-new', engine=eng, image=name, rc=r.returncode, compile_seconds=round(cmp_med, 3), compile_samples=[round(t, 3) for t in cmp_ts],
             seconds=round(med, 3), samples=[round(t, 3) for t in ts], bytes=tot, code_bytes=code, data_bytes=data,
             link=' '.join(link), compiler_warnings=warn[:300], files_opened=opened, differing_pixels=diff, compare=txt))


def pyregress(eng, name):
    out = os.path.join(PX, 'work', 'pyregress_%s_%s.py' % (eng, name))
    if eng == 'predict':
        cmd = NICE + ['python3', PX + '/predict/engine.py', IMG[name], out, '--search']
    else:
        cmd = NICE + ['python3', PX + '/dict/engine.py', IMG[name], out, '--orders', 'all']
    dt, r = timed(cmd, text=True)
    ref = os.path.join(PX, 'old', eng, name + '.py')
    same = r.returncode == 0 and open(out, 'rb').read() == open(ref, 'rb').read()
    log(dict(job='pyregress', engine=eng, image=name, rc=r.returncode, seconds=round(dt, 2), identical_to_archived=same))


if __name__ == '__main__':
    job, eng, name = sys.argv[1:4]
    assert eng in ('predict', 'dict') and name in IMG
    {'enc-new': enc_new, 'enc-old': enc_old, 'run-old': run_old, 'run-new': run_new, 'pyregress': pyregress}[job](eng, name)
