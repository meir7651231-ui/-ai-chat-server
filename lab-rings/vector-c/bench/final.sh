#!/bin/bash
# Final old-vs-new benchmark, one job at a time, old/new interleaved per image (so load drift from other
# users of the machine hits both sides alike).  Results: bench/{old,new}_{trace,prims}/results.jsonl
# The two slow old prims runs (flag, face; 37 min / >45 min in the judge run) are in bench/old_prims_long.
D="$(cd "$(dirname "$0")/.." && pwd)"; S="$(cd "$D/.." && pwd)"
T="$S/vec/test"; J="$S/vec-judge/new"
B="python3 $D/bench/bench.py"
for img in $T/icon.png $T/chart.png $T/logo.png $T/blob.png $T/text.png $T/glow.png $J/flag.png $J/pie.png $J/face.png; do
  $B trace old $D/bench/old_trace $img --timeout 3600
  $B trace new $D/bench/new_trace $img --timeout 3600
done
for img in $T/icon.png $T/chart.png $T/logo.png $T/blob.png $T/text.png $T/glow.png $J/pie.png; do
  $B prims old $D/bench/old_prims $img --timeout 5400
  $B prims new $D/bench/new_prims $img --timeout 5400
done
for img in $J/flag.png $J/face.png; do
  $B prims new $D/bench/new_prims $img --timeout 5400
done
# old prims on face once more, on the (then idle) machine, 90 min cap; the judge's run gave no output in 45 min
# (run_all.sh bench runs it after this script)
# trace without the parallel Bezier fits (single process), to separate that from the native renderer
for img in $T/icon.png $T/chart.png $T/logo.png $T/blob.png $T/text.png $T/glow.png $J/flag.png $J/pie.png $J/face.png; do
  VEC_FIT_WORKERS=1 $B trace new $D/bench/new_trace_w1 $img --timeout 3600
done
