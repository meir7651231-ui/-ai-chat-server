#!/usr/bin/env bash
# rejudge.sh <arm> <id> — rebuild the agent's end state from engine.patch + spec.txt on a fresh base and run the (fixed) machine; keeps cost/wall/tokens
set -u; ARM=$1; TID=$2
S=/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad; B=$S/bench; RES=${RESULTS:-results}; R=$B/$RES/$ARM/$TID; W=$B/work/rj-$ARM-$TID; BASE=${BASE_DIR:-$S/repos/exp-BASE}
NS=$(node -e "process.stdout.write(require('$B/tasks.json').find(x=>x.id==='$TID').ns)")
rm -rf "$W"; cp -a "$BASE" "$W"; cd "$W" || exit 3
[ -s "$R/engine.patch" ] && git apply --whitespace=nowarn "$R/engine.patch" 2>"$R/rejudge-apply.err" || true
[ -s "$R/spec.txt" ] && cp -f "$R/spec.txt" machtzev/generator/specs-ds/$NS.txt
node $B/police-bench.mjs --root . --task "$TID" --claims "$R/claims-final.json" --base "${BASE_HASHES:-/tmp/base-hashes.txt}" --out "$R/rejudged.json" > "$R/rejudged.md" 2>/dev/null
node -e "const fs=require('fs');const o=JSON.parse(fs.readFileSync('$R/final.json'));const n=JSON.parse(fs.readFileSync('$R/rejudged.json'));for(const k of ['arm','wall_s','cost_usd','tokens'])n[k]=o[k];n.rejudged_from=o.verdict;fs.writeFileSync('$R/final.json',JSON.stringify(n,null,1));console.log('$ARM/$TID',o.verdict,'=>',n.verdict,'missing='+n.missing.join(','))"
cd $B; rm -rf "$W"
