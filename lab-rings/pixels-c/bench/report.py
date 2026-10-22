#!/usr/bin/env python3
"""report.py -- plain-text table from results/bench.jsonl (latest record per job/engine/image wins)"""
import json, os, sys
PX = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = {}
for line in open(os.path.join(PX, 'results', 'bench.jsonl')):
    r = json.loads(line)
    recs[(r['job'], r['engine'], r['image'])] = r


def g(job, e, n, k, fmt='%s'):
    r = recs.get((job, e, n))
    if not r or r.get(k) is None:
        return '-'
    return fmt % r[k]


def oldsplit(e, n):
    p = os.path.join(PX, 'old', e, n + '.json')
    if e == 'dict' and os.path.exists(p):
        j = json.load(open(p))
        return '%d+%d' % (j['code_bytes'], j['data_bytes'])
    log = os.path.join(PX, 'old', e, n + '.log')
    return ''


def cpu(job, e, n, idx=0):
    r = recs.get((job, e, n))
    c = (r or {}).get('cpu_seconds') or []
    if not c:
        return '-'
    if job == 'run-new':            # 3 compile samples then 3 run samples (fewer if a run took >= 10 s)
        k = len(r.get('compile_samples', []))
        c = c[k:] if idx else c[:k]
    return '%.1f' % sorted(c)[len(c) // 2]


hdr = ('engine', 'image', 'enc old s', 'enc new s', 'enc cpu old/new', 'run py s', 'cc s', 'run C s', 'run cpu py/C', 'bytes .py', 'bytes .c', 'code+data .c', 'C/py', 'diff py', 'diff C', 'method')
rows = []
for e in ('predict', 'dict'):
    for n in ('wall', 'code', 'dark', 'new'):
        rn = recs.get(('run-new', e, n), {})
        ro = recs.get(('run-old', e, n), {})
        en = recs.get(('enc-new', e, n), {})
        ob = ro.get('bytes') or (os.path.getsize(os.path.join(PX, 'old', e, n + '.py')))
        nb = rn.get('bytes') or en.get('bytes')
        rows.append((e, n, g('enc-old', e, n, 'seconds', '%.1f'), g('enc-new', e, n, 'seconds', '%.1f'),
                     cpu('enc-old', e, n) + '/' + cpu('enc-new', e, n),
                     g('run-old', e, n, 'seconds', '%.2f'), g('run-new', e, n, 'compile_seconds', '%.2f'),
                     g('run-new', e, n, 'seconds', '%.3f'), cpu('run-old', e, n) + '/' + cpu('run-new', e, n, 1),
                     str(ob), str(nb or '-'),
                     ('%d+%d' % (rn['code_bytes'], rn['data_bytes'])) if rn.get('code_bytes') else '-',
                     ('%.3f' % (nb / ob)) if nb else '-',
                     g('run-old', e, n, 'differing_pixels'), g('run-new', e, n, 'differing_pixels'),
                     (en.get('method', '') + (' ' + en['link'] if en.get('link') else ''))))
w = [max(len(str(x[i])) for x in rows + [hdr]) for i in range(len(hdr))]
print('  '.join(h.ljust(w[i]) for i, h in enumerate(hdr)))
for r in rows:
    print('  '.join(str(x).ljust(w[i]) for i, x in enumerate(r)))
extra = [r for k, r in recs.items() if k[0] in ('pyregress', 'enc-old')]
for r in sorted(extra, key=lambda r: (r['job'], r['engine'], r['image'])):
    print('%s %s %s: identical_to_archived=%s (%.1f s)' % (r['job'], r['engine'], r['image'], r.get('identical_to_archived'), r['seconds']))
for k, r in sorted(recs.items()):
    if k[0] == 'run-new':
        print('run-new %s %s: files opened %s, warnings %r, link %r, load1 %s' % (k[1], k[2], [os.path.basename(f) for f in (r.get('files_opened') or [])], r.get('compiler_warnings', ''), r.get('link', ''), r.get('load1')))
