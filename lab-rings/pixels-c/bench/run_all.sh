#!/bin/bash
# run_all.sh [phase...] -- reproduce every px-c number (appends JSON lines to results/bench.jsonl)
#   phases: regress enc-new run-new run-old enc-old   (default: all, in this order; one job at a time)
PX="$(cd "$(dirname "$0")/.." && pwd)"
B="python3 $PX/bench/bench.py"
phases="${@:-regress enc-new run-new run-old enc-old}"
# rebuild the encoders from source (binaries are never trusted to be current)
gcc -O2 -o $PX/predict/pxenc $PX/predict/pxenc.c -lm || exit 1
gcc -O2 -DENC -o $PX/dict/dictcm $PX/dict/dictcm.c || exit 1
for ph in $phases; do
  case $ph in
    regress) for e in predict dict; do $B pyregress $e new; done ;;
    enc-new|run-new|run-old|enc-old)
      for e in predict dict; do for n in wall code dark new; do $B $ph $e $n; done; done ;;
  esac
done
echo "ALL_DONE $phases" >> $PX/results/bench.done
