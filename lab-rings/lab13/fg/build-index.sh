#!/bin/bash
# Builds the offline index parts (resumable: existing parts are kept) and merges them.
#   index-upto4.bin : uniform + prior learned from suites 1-4 (used to measure suite5)
#   index.bin       : uniform + prior learned from suites 1-5 (the machine's default; used for suite6)
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad
D=$S/lab13-fgA/fg; cd $D/..; mkdir -p $D/parts
part() { # name cfg prior secs
  [ -s $D/parts/$1.part ] && return 0
  nice -n 10 node --max-old-space-size=3500 fg/index.mjs build $D/parts/$1.part $2 $3 $4 > $D/parts/$1.log 2>&1
}
export -f part; export D
jobs=( "uni uni - 240" )
for P in 4 5; do
  jobs+=( "p$P-prior prior fg/prior/upto$P.json 180" )
  for C in L-perm L-contig L-subseq L-other N-count N-elem N-other; do jobs+=( "p$P-$C shape:$C fg/prior/upto$P.json 90" ); done
done
printf '%s\n' "${jobs[@]}" | xargs -P 1 -L 1 bash -c 'part "$@"' _
P4=$(ls $D/parts/p4-*.part); P5=$(ls $D/parts/p5-*.part)
nice -n 10 node --max-old-space-size=5000 fg/index.mjs merge $D/index-upto4.bin $D/parts/uni.part $P4 > $D/parts/merge4.log 2>&1
nice -n 10 node --max-old-space-size=5000 fg/index.mjs merge $D/index.bin $D/parts/uni.part $P5 > $D/parts/merge5.log 2>&1
echo done > $D/parts/BUILD.done
