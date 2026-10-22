#!/bin/bash
# after the vcfit n==1 cubic fix: new prims on all 9 images (timed, one at a time), then the in-loop validation
D="$(cd "$(dirname "$0")/.." && pwd)"; S="$(cd "$D/.." && pwd)"; T="$S/vec/test"; J="$S/vec-judge/new"
for img in $T/icon.png $T/chart.png $T/logo.png $T/blob.png $T/text.png $T/glow.png $J/pie.png $J/flag.png $J/face.png; do
  python3 $D/bench/bench.py prims new $D/bench/new_prims $img --timeout 5400
done
bash $D/cal/inloop_check.sh
