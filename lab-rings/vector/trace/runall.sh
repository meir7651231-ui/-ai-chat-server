#!/bin/bash
# usage: runall.sh [names...]   -> traces test images into out/, scores them, writes out/results.jsonl
V=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/vec
D=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/vec-trace
names="${@:-icon chart logo blob text glow}"
for n in $names; do
  nice -n 10 python3 $D/trace.py $V/test/$n.png $D/out/$n.svg --json $D/out/$n.info.json 2>&1 | grep -v Warning | grep -v '^  ' || true
  sc=$(nice -n 10 python3 $V/score.py $V/test/$n.png $D/out/$n.svg)
  echo "$n $sc"
  python3 -c "import json,sys; i=json.load(open('$D/out/$n.info.json')); s=json.loads('''$sc'''); s.update(image='$V/test/$n.png', svg='$D/out/$n.svg', found=i['found']); print(json.dumps(s))" >> $D/out/results.jsonl
done
