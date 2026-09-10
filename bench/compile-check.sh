#!/usr/bin/env bash
# compile-check.sh <results-dir> <arm> <id> <worker(1|2)> [base-dir] — rebuild agent end-state, mirror into a Flutter copy, run flutter analyze lib/genesis; writes compile.json
export PATH=/opt/flutter/bin:$PATH
S=/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad; B=$S/bench; RES=$1; ARM=$2; TID=$3; WK=${4:-1}; BASE=${5:-$S/repos/exp-BASE}
R=$B/$RES/$ARM/$TID; [ -f "$R/compile.json" ] && exit 0
NS=$(node -e "process.stdout.write(require('$B/tasks.json').find(x=>x.id==='$TID').ns)")
W=$B/work/cc$WK-$ARM-$TID; rm -rf "$W"; cp -a "$BASE" "$W"; cd "$W" || exit 3
[ -s "$R/engine.patch" ] && git apply --whitespace=nowarn "$R/engine.patch" 2>/dev/null; [ -s "$R/spec.txt" ] && cp -f "$R/spec.txt" machtzev/generator/specs-ds/$NS.txt
rm -f machtzev/generator/apps/$NS.json machtzev/generator/particle-plan-$NS.*
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/$NS.txt --name $NS --skin > /dev/null 2>&1; GEN=$?
APP=$S/repos/bs-compile; [ "$WK" = "2" ] && APP=$S/repos/bs-compile-2
node $S/repos/mirror.mjs "$W" "$APP" > /dev/null 2>&1
( cd "$APP" && timeout 400 flutter analyze lib/genesis > "$R/analyze.txt" 2>&1 )
ERR=$(grep -c '^ *error •' "$R/analyze.txt"); NSERR=$(grep '^ *error •' "$R/analyze.txt" | grep -c "gen_app_${NS}_\|gen_${NS}")
node -e "const fs=require('fs');const t=fs.readFileSync('$R/analyze.txt','utf8');const errs=t.split('\n').filter(l=>/^ *error •/.test(l)).map(l=>l.trim().slice(0,200));fs.writeFileSync('$R/compile.json',JSON.stringify({errors:$ERR,ns_errors:$NSERR,gen_exit:$GEN,sample:errs.slice(0,5)},null,1))"
echo "$RES/$ARM/$TID errors=$ERR ns_errors=$NSERR"
cd $B; rm -rf "$W"
