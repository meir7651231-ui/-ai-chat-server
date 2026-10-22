#!/usr/bin/env python3
"""Converts the judge's earlier old-engine prims runs on the slow images (vec-judge/prims_long: flag 2253.9 s,
face no output within 2700 s) into bench/old_judge/results.jsonl, the format report.py reads."""
import json, os
S = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad'
od = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'old_judge')
os.makedirs(od, exist_ok=True)
with open(os.path.join(od, 'results.jsonl'), 'w') as f:
    for line in open(f'{S}/vec-judge/prims_long/results.jsonl'):
        r = json.loads(line)
        r.update(variant='old', source='vec-judge/prims_long')
        if 'error' in r:
            r.update(rc='timeout', secs=2700.0)
        else:
            r['rc'] = 0
        r.pop('found', None)
        f.write(json.dumps(r) + '\n')
print(open(os.path.join(od, 'results.jsonl')).read())
