#!/usr/bin/env bash
# bench.sh <arms comma-separated> <parallel> [task ids...]   — worker pool; each worker runs all arms for one task in sequence
B=/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench
ARMS=${1:-h0,hf,f0}; PAR=${2:-3}; shift 2 2>/dev/null
if [ $# -gt 0 ]; then IDS="$@"; else IDS=$(node -e "const t=require('$B/tasks.json');const E=t.filter(x=>x.tier=='E'),M=t.filter(x=>x.tier=='M'),H=t.filter(x=>x.tier=='H');const out=[];for(let i=0;i<20;i++){for(const a of [E,M,H]) if(a[i]) out.push(a[i].id);} process.stdout.write(out.join(' '))"); fi
for id in $IDS; do echo "$id"; done | xargs -P "$PAR" -I{} bash -c "for a in \$(echo $ARMS | tr ',' ' '); do BASE_DIR=$BASE_DIR BASE_HASHES=$BASE_HASHES RESULTS=$RESULTS $B/run-task.sh \$a {} >> $B/logs/${RESULTS:-results}-{}.log 2>&1; done; echo done {}"
echo ALL-DONE
