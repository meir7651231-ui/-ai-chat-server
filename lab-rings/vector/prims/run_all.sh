#!/bin/bash
# usage: run_all.sh [names...]  -> runs engine + score.py on test images
cd "$(dirname "$0")"
T=../vec/test
names=${@:-icon chart logo blob text glow}
for n in $names; do
  start=$(date +%s.%N)
  timeout 600 nice -n 10 python3 prims.py $T/$n.png out/$n.svg ${EXTRA} 2> out/$n.log > out/$n.found || { echo "$n FAILED"; tail -5 out/$n.log; continue; }
  end=$(date +%s.%N)
  sc=$(python3 ../vec/score.py $T/$n.png out/$n.svg)
  printf "%-6s %5.1fs %s | %s\n" $n $(echo "$end - $start" | bc) "$sc" "$(cat out/$n.found)"
done
