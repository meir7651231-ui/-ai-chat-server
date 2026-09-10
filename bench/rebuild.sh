#!/usr/bin/env bash
# rebuild.sh <arm> <id> — reconstruct agent end-state in bench/work/rb-<arm>-<id> and regenerate only that app (for inspection)
S=/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad; B=$S/bench; ARM=$1; TID=$2; R=$B/results/$ARM/$TID; W=$B/work/rb-$ARM-$TID
NS=$(node -e "process.stdout.write(require('$B/tasks.json').find(x=>x.id==='$TID').ns)")
rm -rf "$W"; cp -a $S/repos/exp-BASE "$W"; cd "$W"; [ -s "$R/engine.patch" ] && git apply --whitespace=nowarn "$R/engine.patch" 2>/dev/null; [ -s "$R/spec.txt" ] && cp -f "$R/spec.txt" machtzev/generator/specs-ds/$NS.txt
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/$NS.txt --name $NS --skin >/dev/null 2>&1; echo "$W ($NS) rebuilt: $?"
