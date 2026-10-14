#!/bin/bash
# one phase: reset once, then list2list, list2num, num on the same shelf. resumable.
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad; R=$S/merge-runs
name=$1 dir=$2 suite=$3
reset(){ cd "$1" && cp shelf3.before-bench100.json shelf3.json && cp tzoref-learned-goals.before-bench100.json tzoref-learned-goals.json && cp stage-stats.base.jsonl stage-stats.jsonl && cp scan-tables-cache.base.json scan-tables-cache.json && cp ladder-twins.base.json ladder-twins.json; }
if [ ! -f $R/$name.reset.done ]; then reset $dir || exit 1; touch $R/$name.reset.done; fi
for k in list2list list2num num; do
  [ -f $R/$name-$k.done ] && continue
  echo "$(date -u +%FT%TZ) $name $k start" >> $R/progress.txt
  ( cd $dir && SUITE=$suite KIND=$k OUT=$R/$name-$k.jsonl nice -n 5 node runbench.mjs >> $R/$name-$k.log 2>&1 )
  if grep -q 'הסתיים' $R/$name-$k.log; then touch $R/$name-$k.done; echo "$(date -u +%FT%TZ) $name $k done" >> $R/progress.txt; else echo "$(date -u +%FT%TZ) $name $k FAILED" >> $R/progress.txt; exit 1; fi
done
echo "$(date -u +%FT%TZ) $name ALL DONE" >> $R/progress.txt
