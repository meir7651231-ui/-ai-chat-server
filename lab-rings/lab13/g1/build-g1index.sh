#!/bin/bash
# Builds the G1 supplement index (nodes that use a G1 production; the G0 index keeps the rest). Resumable: parts are kept.
#   parts: uniform costs 360 s, learned prior (G0 costs + zero-count G1 costs) 210 s, prior per shape class 7 x 60 s.
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad
D=$S/lab13-r7; cd $D; P=$D/fg/parts-g1; mkdir -p $P
part() { # name cfg prior secs
  [ -s $P/$1.part ] && return 0
  nice -n 10 node --max-old-space-size=3500 fg/index.mjs build $P/$1.part $2 $3 $4 g1 > $P/$1.log 2>&1
}
export -f part; export P S
jobs=( "uni uni - 360" "prior prior fg/prior/upto5-g1.json 210" )
for C in L-perm L-contig L-subseq L-other N-count N-elem N-other; do jobs+=( "$C shape:$C fg/prior/upto5-g1.json 60" ); done
T0=$(date +%s)
printf '%s\n' "${jobs[@]}" | xargs -P 1 -L 1 bash -c 'part "$@"' _
T1=$(date +%s)
nice -n 10 node --max-old-space-size=5000 fg/index.mjs merge $D/fg/index-g1.bin $P/*.part > $P/merge.log 2>&1
T2=$(date +%s)
echo "parts $((T1-T0)) s, merge $((T2-T1)) s" > $P/BUILD.done
