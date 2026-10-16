#!/bin/bash
# Track C, heavy part (once per suite, optional): rebuild the prior-dependent index parts from the prior the machine refit on
# its own history (fg/history/prior.json) and merge them with the uniform part into fg/index-learned.bin (stage.mjs prefers it
# when it exists; LEARN=0 or FGINDEX=... override). Same budgets as fg/build-index.sh: uniform 240 s + prior 180 s + 7 shape
# classes x 90 s. ~17 min of one heavy slot (or less with PARTS_P=2), ~1.1 GB of temporary parts (deleted at the end).
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad; D=${LAB:-$S/lab13-r7learn}; cd $D || exit 1
B=fg/build; mkdir -p $B; P=${PRIOR:-fg/history/prior.json}; [ -f $P ] || { echo "no $P"; exit 1; }
part() { [ -s $B/$1.part ] && return 0; FG_HEAPSTOP=0 nice -n 10 node --max-old-space-size=5000 fg/index.mjs build $B/$1.part $2 $3 $4 > $B/$1.log 2>&1; }
export -f part; export B
jobs=( "uni uni - 240" "R-prior prior $P 180" ); for C in L-perm L-contig L-subseq L-other N-count N-elem N-other; do jobs+=( "R-$C shape:$C $P 90" ); done
printf '%s\n' "${jobs[@]}" | xargs -P ${PARTS_P:-1} -L 1 $S/heavy.sh bash -c 'part "$@"' _
for j in "${jobs[@]}"; do n=${j%% *}; [ -s $B/$n.part ] || { echo "missing $n"; exit 1; }; done
$S/heavy.sh nice -n 10 node --max-old-space-size=6000 fg/index.mjs merge fg/index-learned.bin.new $B/uni.part $B/R-*.part > $B/merge-learned.log 2>&1 || exit 1
mv fg/index-learned.bin.new fg/index-learned.bin && rm -f $B/R-*.part && echo "fg/index-learned.bin $(cat $B/merge-learned.log)"
