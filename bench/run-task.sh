#!/usr/bin/env bash
# run-task.sh <arm> <task-id>   arms: h0 (Haiku bare) · hf (Haiku full stack) · f0 (Fable bare)
set -u
ARM=$1; TID=$2
S=/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad
B=$S/bench; BASE=${BASE_DIR:-$S/repos/exp-BASE}; RES=${RESULTS:-results}; W=$B/work/$ARM-$TID; R=$B/$RES/$ARM/$TID
HAIKU=claude-haiku-4-5-20251001; FABLE=claude-fable-5-1
[ -f "$R/final.json" ] && { echo "skip $ARM/$TID (done)"; exit 0; }
mkdir -p "$R"; rm -rf "$W"; cp -a "$BASE" "$W"; cd "$W" || exit 3
TASK=$(node -e "const t=require('$B/tasks.json').find(x=>x.id==='$TID'); process.stdout.write(t.task)")
NS=$(node -e "const t=require('$B/tasks.json').find(x=>x.id==='$TID'); process.stdout.write(t.ns)")
render() { sed -e "s|{{TASK}}|$(printf '%s' "$TASK" | sed 's/[&|]/\\&/g')|" -e "s|{{TID}}|$TID|g" -e "s|{{NS}}|$NS|g" -e "s|{{POLICE}}|$B/police-bench.mjs|g" -e "s|{{BASEHASHES}}|${BASE_HASHES:-/tmp/base-hashes.txt}|g" -e "s|{{COMPILEARG}}|$COMPILE_ARG|g" -e "s|{{LENS}}|$2|g" -e "s|{{LENSID}}|$3|g" "$1"; }
ALLOW="Edit,Write,Read,Glob,Grep,Bash(node *),Bash(cd *),Bash(head *),Bash(tail *),Bash(ls *),Bash(grep *),Bash(git diff *),Bash(git status *),Bash(git log *),Bash(sed -n *),Bash(wc *),Bash(cat *),Bash(diff *),Bash(find *),Bash(mkdir *),Bash(cp *),Bash(sha256sum *),Bash(sort *),Bash(uniq *),Bash(echo *),Bash(printf *),Bash(true),Bash(pwd),Bash(awk *),Bash(cut *),Bash(tr *),Bash(rm new/dart-gen-bs/gen_app_*),Bash(rm new/dart-data-bs/auto/gen_app_*),Bash(rm machtzev/generator/specs-ds/*),Bash(rm machtzev/generator/apps/*),Bash(rm machtzev/generator/particle-plan-*)"
DENY="Bash(git commit *),Bash(git push *),Bash(git add *),Bash(git reset *),Bash(git checkout *),Bash(git stash *),Bash(chattr *),Bash(rm -*),Bash(rm /*),Bash(rm .git*),Bash(rm machtzev/*.mjs),Bash(rm machtzev/generator/*.mjs),Bash(mv *),Bash(sudo *),Bash(curl *),Bash(wget *),Bash(npm *),Bash(npx *),Bash(pip *),Bash(python *),Bash(python3 *),Bash(bash *),Bash(sh *)"
cc() { # cc <model> <maxturns> <prompt-file> <out-json>
  timeout 2400 claude -p "$(cat "$3")" --model "$1" --max-turns "$2" --permission-mode acceptEdits --allowedTools "$ALLOW" --disallowedTools "$DENY" --output-format json > "$4" 2> "$4.err"; echo "  $(basename $4): exit=$? cost=$(node -e "try{const d=require('$4');process.stdout.write(String(d.total_cost_usd)+' turns='+d.num_turns+' ms='+d.duration_ms+' err='+d.is_error)}catch(e){process.stdout.write('unparsable')}")"
}
CC=""; for i in 1 2 3; do if mkdir "$B/work/.cc-lock-$i" 2>/dev/null; then CC=$S/repos/bs-compile-$i; CCL="$B/work/.cc-lock-$i"; break; fi; done; [ -n "$CC" ] && trap 'rmdir "$CCL" 2>/dev/null' EXIT
COMPILE_ARG=""; [ -n "$CC" ] && [ "${COMPILE:-1}" = "1" ] && COMPILE_ARG="--compile $CC"
police() { node "$B/police-bench.mjs" --root . --task "$TID" --claims ./claims.json --base "${BASE_HASHES:-/tmp/base-hashes.txt}" $COMPILE_ARG --out "$1" > ./_police.md 2>./_police.err; echo "  police: $(node -e "const d=require('$1');process.stdout.write(d.verdict+' missing='+d.missing.join(',')+' false='+d.false_claims)")"; }
T0=$(date +%s); echo "=== $ARM/$TID ($NS) start $(date -u +%H:%M:%S)"
case $ARM in
  h0|f0)
    MODEL=$HAIKU; [ $ARM = f0 ] && MODEL=$FABLE
    render "$B/prompts/builder-bare.md" x x > _prompt-builder.md
    cc $MODEL 80 _prompt-builder.md "$R/builder.json"
    cp -f _report.md "$R/report.md" 2>/dev/null
    police "$R/final.json" ;;
  hf)
    # layer 1-2: quarantine + immutability + commit block + protocol pack
    for f in machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs; do printf '#!/usr/bin/env node\nconsole.error("🔒 BLOCKED by protocol: %s is quarantined for this task. The only pipeline you may run is the machine: node %s --root . --task %s --claims ./claims.json");\nprocess.exit(2);\n' "$f" "$B/police-bench.mjs" "$TID" > "$f"; done
    chattr +i machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs 2>/dev/null
    printf '#!/bin/sh\necho "🔒 BLOCKED by protocol: no commits in this task" >&2; exit 1\n' > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit; git config core.hooksPath .git/hooks
    mkdir -p protocol && cp $S/repos/buildsmart/app_flutter/knowledge/MASTER_PROTOCOL.md $S/repos/buildsmart/app_flutter/knowledge/PROTOCOL_ENFORCEMENT.md protocol/ && cp -r $S/repos/buildsmart/orchestrator protocol/orchestrator
    echo '{"claims":[],"notes":""}' > claims.json
    render "$B/prompts/builder-full.md" x x > _prompt-builder.md
    cc $HAIKU 120 _prompt-builder.md "$R/builder.json"
    police "$R/police-1.json"; cp -f claims.json "$R/claims-1.json" 2>/dev/null; cp -f _plan.md _adr.md _insp.md "$R/" 2>/dev/null
    # fleet: 3 auditors in parallel (read-only)
    render "$B/prompts/auditor.md" "task-coverage (did the change cover EVERY surface the task names — entity list screen, particle table, hub, report — and does the machine report agree; what is missing)" "coverage" > _prompt-a1.md
    render "$B/prompts/auditor.md" "edge-crash + compile (null-safety, non-existent Dart methods, nested parens, empty/missing values, text-vs-number comparisons)" "compile" > _prompt-a2.md
    render "$B/prompts/auditor.md" "state-leakage + regression (does the engine change alter OTHER apps or specs; orphan generated files new/dart-gen-bs/gen_app_*.dart whose namespace has no spec — e.g. app-ds run without --name; substring matches that over-trigger; mutation of shared lists; duplicated constants)" "regression" > _prompt-a3.md
    cc $HAIKU 30 _prompt-a1.md "$R/auditor-coverage.json" & cc $HAIKU 30 _prompt-a2.md "$R/auditor-compile.json" & cc $HAIKU 30 _prompt-a3.md "$R/auditor-regression.json" & wait
    cp -f _audit-*.md "$R/" 2>/dev/null
    render "$B/prompts/validator.md" x x > _prompt-v.md
    cc $HAIKU 30 _prompt-v.md "$R/validator.json"; cp -f _confirmed.md "$R/" 2>/dev/null
    MF=$(node -e "const d=require('$R/police-1.json');const g=d.missing.filter(m=>!d.task_checks.some(t=>t.id===m));process.stdout.write(g.join(', '))")
    [ -n "$MF" ] && printf '\n\nMACHINE-FAILURES (mandatory, fix first): %s — see _police.md for the exact files/errors.\n' "$MF" >> _confirmed.md
    if grep -q "FIX-LIST: none" _confirmed.md 2>/dev/null && [ -z "$MF" ]; then echo "  fixer: skipped (FIX-LIST none)"; cp "$R/police-1.json" "$R/final.json"; cp "$R/police-1.md" "$R/final.md" 2>/dev/null;
    else
      for round in 1 2; do render "$B/prompts/fixer.md" x x > _prompt-f.md; cc $HAIKU 60 _prompt-f.md "$R/fixer-$round.json"; police "$R/police-fix$round.json"; V=$(node -e "process.stdout.write(require('$R/police-fix$round.json').verdict)"); [ "$V" = "DONE" ] && break; done
      cp "$R/police-fix$round.json" "$R/final.json"; cp "$R/police-fix$round.md" "$R/final.md" 2>/dev/null; fi
    cp -f claims.json "$R/claims-final.json" 2>/dev/null ;;
esac
git diff HEAD -- machtzev/ ':!machtzev/one.mjs' ':!machtzev/generator/ship.mjs' ':!machtzev/generator/tighten-types.mjs' > "$R/engine.patch" 2>/dev/null; git status --short --untracked-files=all -- machtzev/ | grep -v "one.mjs\|ship.mjs\|tighten-types" > "$R/status.txt" 2>/dev/null
for f in machtzev/generator/specs-ds/$NS.txt; do cp -f "$f" "$R/spec.txt" 2>/dev/null; done
T1=$(date +%s); node -e "const fs=require('fs');const f='$R/final.json';const d=JSON.parse(fs.readFileSync(f));d.arm='$ARM';d.wall_s=$((T1-T0));let cost=0,tok=0;for(const j of fs.readdirSync('$R').filter(x=>/\.json$/.test(x)&&!/police|final|claims/.test(x))){try{const u=JSON.parse(fs.readFileSync('$R/'+j));cost+=u.total_cost_usd||0;const us=u.usage||{};tok+=(us.input_tokens||0)+(us.output_tokens||0)+(us.cache_read_input_tokens||0)+(us.cache_creation_input_tokens||0);}catch{}}d.cost_usd=cost;d.tokens=tok;fs.writeFileSync(f,JSON.stringify(d,null,1));console.log('=== '+'$ARM/$TID'+' '+d.verdict+' wall='+d.wall_s+'s cost=\$'+cost.toFixed(2)+' false_claims='+d.false_claims)"
chattr -i "$W"/machtzev/one.mjs "$W"/machtzev/generator/ship.mjs "$W"/machtzev/generator/tighten-types.mjs 2>/dev/null; cd "$B"; rm -rf "$W"
