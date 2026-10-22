#!/usr/bin/env python3
"""Benchmark one engine variant on images, one job at a time.

usage: bench.py {trace,prims} {old,new} OUTDIR IMG.png [IMG.png ...] [--timeout S] [--reps N]

old = the untouched originals (vec-trace/trace.py, vec-prims/prims.py: Chromium in the loop)
new = vec-c copies (native rasterizer in the search loop, C kernels, final Chromium check)

Wall time is measured with time.monotonic() around the engine process (python start-up included,
score.py excluded).  Runs shorter than 10 s are repeated (3x) and the median is reported.
Each result (score.py JSON + secs + load average) is appended to OUTDIR/results.jsonl."""
import sys, os, json, time, subprocess, statistics

S = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad'
ENG = {
    ('trace', 'old'): [sys.executable, f'{S}/vec-trace/trace.py', '{img}', '{svg}', '--json', '{svg}.info.json'],
    ('prims', 'old'): [sys.executable, f'{S}/vec-prims/prims.py', '{img}', '{svg}'],
    ('trace', 'new'): [sys.executable, f'{S}/vec-c/trace/trace.py', '{img}', '{svg}', '--json', '{svg}.info.json'],
    ('prims', 'new'): [sys.executable, f'{S}/vec-c/prims/prims.py', '{img}', '{svg}'],
}


def run_once(cmd, svg, timeout):
    t0 = time.monotonic()
    with open(svg + '.log', 'w') as lg, open(svg + '.found', 'w') as fo:
        try:
            p = subprocess.run(['nice', '-n', '10'] + cmd, stdout=fo, stderr=lg, timeout=timeout)
            rc = p.returncode
        except subprocess.TimeoutExpired:
            rc = 'timeout'
    return time.monotonic() - t0, rc


def main():
    a = sys.argv[1:]
    timeout = None
    reps = 3
    if '--timeout' in a:
        i = a.index('--timeout'); timeout = float(a[i + 1]); del a[i:i + 2]
    if '--reps' in a:
        i = a.index('--reps'); reps = int(a[i + 1]); del a[i:i + 2]
    eng, var, od = a[0], a[1], a[2]
    imgs = a[3:]
    os.makedirs(od, exist_ok=True)
    for img in imgs:
        n = os.path.splitext(os.path.basename(img))[0]
        svg = os.path.join(od, n + '.svg')
        cmd = [c.format(img=img, svg=svg) for c in ENG[(eng, var)]]
        times = []
        load0 = os.getloadavg()[0]
        dt, rc = run_once(cmd, svg, timeout)
        times.append(dt)
        while rc == 0 and dt < 10 and len(times) < reps:
            dt, rc = run_once(cmd, svg, timeout)
            times.append(dt)
        rec = dict(image=n, engine=eng, variant=var, secs=round(statistics.median(times), 2),
                   runs=[round(t, 2) for t in times], rc=rc, load1=round(load0, 2), svg=svg)
        if rc == 0 and os.path.exists(svg) and os.path.getsize(svg):
            sc = subprocess.run([sys.executable, f'{S}/vec/score.py', img, svg], capture_output=True, text=True)
            try:
                rec.update(json.loads(sc.stdout.strip().splitlines()[-1]))
            except Exception:
                rec['score_error'] = sc.stdout + sc.stderr
        info = svg + '.info.json'
        if os.path.exists(info):
            j = json.load(open(info))
            for k in ('render_stats', 'final_check'):
                if k in j:
                    rec[k] = j[k]
        with open(os.path.join(od, 'results.jsonl'), 'a') as f:
            f.write(json.dumps(rec) + '\n')
        print(json.dumps(rec), flush=True)


if __name__ == '__main__':
    main()
