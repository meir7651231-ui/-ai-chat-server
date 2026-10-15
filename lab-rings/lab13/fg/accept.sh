#!/bin/bash
# Acceptance runs of Track A (JS-only, frozen G0, 120 s per task) + independent re-check + direct-lookup timing.
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad; cd $S/lab13-fgA
R=fg/runs/final; mkdir -p $R
N="nice -n 10 node --max-old-space-size=5000"
export FGFOUND=$S/lab13-fgA/fg/found.jsonl
$N fg/runtasks.mjs s5fails $R/s5.jsonl 120000 fg/index-upto4.bin fg/prior/upto4.json auto > $R/s5.log 2>&1
$N fg/runtasks.mjs s6 $R/s6.jsonl 120000 fg/index.bin fg/prior/upto5.json auto > $R/s6.log 2>&1
$N fg/recheck.mjs $R/s5.jsonl s5 > $R/recheck-s5.txt 2>&1
$N fg/recheck.mjs $R/s6.jsonl s6 > $R/recheck-s6.txt 2>&1
$N fg/lookuptest.mjs fg/index.bin $R/s6-lookup.jsonl s6 > $R/lookup-s6.txt 2>&1
$N fg/lookuptest.mjs fg/index-upto4.bin $R/s5-lookup.jsonl s5 > $R/lookup-s5.txt 2>&1
echo done > $R/ACCEPT.done
