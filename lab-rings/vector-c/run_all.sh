#!/bin/bash
# vec-c: reproduce everything (build, calibration vs Chromium, old-vs-new benchmark, report).
#
#   ./run_all.sh build        build native/libvr.so (rasterizer) and native/libvcfit.so (engine kernels)
#   ./run_all.sh calib        native vs Chromium: corpus of every SVG in the scratchpad + random test shapes
#   ./run_all.sh bench        old and new interleaved per image, one job at a time (bench/final.sh; what the
#                             report was made from) + old prims face with a 90 min cap
#   ./run_all.sh bench-old    original engines (Chromium in the loop), one job at a time
#   ./run_all.sh bench-new    vec-c engines (native rasterizer in the loop + C kernels + final Chromium check)
#   ./run_all.sh report       table old vs new (bench/report.py)
#   ./run_all.sh all          all of the above
#
# Engines: trace/trace.py and prims/prims.py (copies of vec-trace / vec-prims, see the 'vec-c:' comments).
# Env knobs: VEC_RENDER=chrome (original rendering), VEC_C=0 (no C kernels), VEC_C_CHECK=1 (run C and Python
# side by side, raise on any difference), VEC_FIT_WORKERS=N (trace: parallel Bezier fits), VEC_SPARSE_NV.
set -e
D="$(cd "$(dirname "$0")" && pwd)"
S="$(cd "$D/.." && pwd)"
T="$S/vec/test"; J="$S/vec-judge/new"
IMGS="$T/icon.png $T/chart.png $T/logo.png $T/blob.png $T/text.png $T/glow.png $J/flag.png $J/pie.png $J/face.png"
step="${1:-all}"

build() { bash "$D/native/build.sh"; }
calib() {
  cd "$D/cal"
  python3 corpus.py | tee corpus_final.txt
  python3 shapes.py 60 101 | tee shapes_final.txt
}
bench_old() {
  python3 "$D/bench/bench.py" trace old "$D/bench/old_trace" $IMGS --timeout 3600
  python3 "$D/bench/bench.py" prims old "$D/bench/old_prims" $IMGS --timeout 5400
}
bench_new() {
  python3 "$D/bench/bench.py" trace new "$D/bench/new_trace" $IMGS --timeout 3600
  python3 "$D/bench/bench.py" prims new "$D/bench/new_prims" $IMGS --timeout 5400
}
bench() {
  bash "$D/bench/final.sh"
  python3 "$D/bench/bench.py" prims old "$D/bench/old_prims_face" "$J/face.png" --timeout 5400
}
report() {
  python3 "$D/bench/judge_old.py" > /dev/null   # judge's earlier old prims flag/face runs (bench/old_judge)
  python3 "$D/bench/report.py" \
    "$D/bench/old_trace/results.jsonl,$D/bench/old_prims/results.jsonl,$D/bench/old_prims_long/results.jsonl,$D/bench/old_judge/results.jsonl,$D/bench/old_prims_face/results.jsonl" \
    "$D/bench/new_trace/results.jsonl,$D/bench/new_prims/results.jsonl" | tee "$D/bench/report.txt"
}
case "$step" in
  build) build ;;
  calib) calib ;;
  bench) bench ;;
  bench-old) bench_old ;;
  bench-new) bench_new ;;
  report) report ;;
  all) build; calib; bench; report ;;
  *) echo "unknown step $step"; exit 1 ;;
esac
