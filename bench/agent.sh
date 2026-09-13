#!/usr/bin/env bash
# 🤖 agent.sh — מריץ **כל מודל** על **כל משימה אמיתית** בתוך הרתמה המלאה.
#   שימוש:  bench/agent.sh -m <model> -n <ns> [-f] [-k N] "<המשימה במילים>"
#     -m  מזהה-מודל ל-`claude -p` (ברירת-מחדל: claude-haiku-4-5-20251001)
#     -n  מרחב-השמות של האפליקציה שנוגעים בה (שם הספק ב-specs-ds בלי סיומת) — הכל מחוצה לו חייב להישאר זהה-בייט
#     -f  בלי צי (בנאי + מכונה בלבד)        -k  עד N סבבי-תיקון (ברירת-מחדל 2)
#   סביבה:  BUILDSMART=<app_flutter> ⇒ שער-קומפילציה אמיתי (flutter analyze אחרי mirror). בלי זה — מדולג.
#   פלט:  ענף `agent/<ns>-<חותם>` בעץ-עבודה תחת .agent-runs/ + דו"ח-מכונה. אין push, אין מיזוג — שלך להחליט.
set -u
MODEL=claude-haiku-4-5-20251001; NS=""; FLEET=1; ROUNDS=2
while getopts "m:n:fk:" o; do case $o in m) MODEL=$OPTARG;; n) NS=$OPTARG;; f) FLEET=0;; k) ROUNDS=$OPTARG;; esac; done
shift $((OPTIND-1)); TASK="${*:-}"
[ -n "$NS" ] && [ -n "$TASK" ] || { sed -n '2,9p' "$0"; exit 2; }
B="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(git -C "$B" rev-parse --show-toplevel)"
STAMP=$(date -u +%m%d-%H%M%S); BR="agent/$NS-$STAMP"; W="$ROOT/.agent-runs/$NS-$STAMP"; R="$W/_run"
command -v claude >/dev/null || { echo "✗ אין claude CLI ב-PATH"; exit 3; }
[ -f "$ROOT/machtzev/generator/specs-ds/$NS.txt" ] || echo "⚠ אין specs-ds/$NS.txt — מרחב-שמות חדש (מותר)"

echo "🤖 $BR · model=$MODEL · fleet=$FLEET · rounds=$ROUNDS"
git -C "$ROOT" worktree add -q -b "$BR" "$W" HEAD || exit 3
mkdir -p "$R"; cd "$W" || exit 3

# ── בסיס: regen פעם אחת ⇒ חתימות-הפלט לפני שהסוכן נוגע (מקור-האמת לבייט-זהות) ──
echo "  בסיס: regen …"
node "$B/police-bench.mjs" --root . --task "free:$NS" --base /dev/null --out "$R/base.json" > "$R/base.md" 2>&1
BASEH="$R/base-hashes.txt"; (cd new && find dart-gen-bs dart-data-bs -type f | sort | xargs sha256sum > "$BASEH")
echo "  בסיס: $(wc -l < "$BASEH") קבצים"

# ── שכבה 1: הסגר · חסימת-commit · חבילת-הפרוטוקול ──
for f in machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs; do
  [ -f "$f" ] && node -e "
const fs=require('fs');const f=process.argv[1],p=process.argv[2],n=process.argv[3];
fs.writeFileSync(f,'#!/usr/bin/env node\n// quarantined for this agent run\nconsole.error(\`🔒 חסום ע״י הפרוטוקול: \${f} בהסגר למשימה הזו. הצינור היחיד: node \${p} --root . --task free:\${n} --claims ./claims.json\`);\nprocess.exit(2);\n'.replace('\${f}',f).replace('\${p}',p).replace('\${n}',n));
" "$f" "$B/police-bench.mjs" "$NS"
done
chattr +i machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs 2>/dev/null
HOOK="$(git rev-parse --git-path hooks/pre-commit)"; mkdir -p "$(dirname "$HOOK")"
printf '#!/bin/sh\necho "blocked by protocol: no commits in this task" >&2\nexit 1\n' > "$HOOK"; chmod +x "$HOOK"
mkdir -p protocol
for p in "$ROOT/../buildsmart/app_flutter/knowledge/MASTER_PROTOCOL.md" "$ROOT/../buildsmart/app_flutter/knowledge/PROTOCOL_ENFORCEMENT.md"; do
  [ -f "$p" ] && cp "$p" protocol/; done
[ -d "$ROOT/../buildsmart/orchestrator" ] && cp -r "$ROOT/../buildsmart/orchestrator" protocol/orchestrator 2>/dev/null
echo '{"claims":[],"notes":""}' > claims.json

COMPILE_ARG=""; [ -n "${BUILDSMART:-}" ] && [ -d "${BUILDSMART:-}" ] && COMPILE_ARG="--compile $BUILDSMART"
render() { sed -e "s|{{TASK}}|$(printf '%s' "$TASK" | sed 's/[&|]/\\&/g')|" -e "s|{{TID}}|free:$NS|g" -e "s|{{NS}}|$NS|g" \
  -e "s|{{POLICE}}|$B/police-bench.mjs|g" -e "s|{{BASEHASHES}}|$BASEH|g" -e "s|{{COMPILEARG}}|$COMPILE_ARG|g" \
  -e "s|{{LENS}}|${2:-x}|g" -e "s|{{LENSID}}|${3:-x}|g" "$1"; }
ALLOW="Edit,Write,Read,Glob,Grep,Bash(node *),Bash(cd *),Bash(head *),Bash(tail *),Bash(ls *),Bash(grep *),Bash(git diff *),Bash(git status *),Bash(git log *),Bash(sed -n *),Bash(wc *),Bash(cat *),Bash(diff *),Bash(find *),Bash(mkdir *),Bash(cp *),Bash(sha256sum *),Bash(sort *),Bash(uniq *),Bash(echo *),Bash(printf *),Bash(true),Bash(pwd),Bash(awk *),Bash(cut *),Bash(tr *),Bash(rm new/dart-gen-bs/gen_app_*),Bash(rm new/dart-data-bs/auto/gen_app_*),Bash(rm machtzev/generator/specs-ds/*),Bash(rm machtzev/generator/apps/*),Bash(rm machtzev/generator/particle-plan-*)"
DENY="Bash(git commit *),Bash(git push *),Bash(git add *),Bash(git reset *),Bash(git checkout *),Bash(git stash *),Bash(chattr *),Bash(rm -*),Bash(rm /*),Bash(rm .git*),Bash(rm machtzev/*.mjs),Bash(rm machtzev/generator/*.mjs),Bash(mv *),Bash(sudo *),Bash(curl *),Bash(wget *),Bash(npm *),Bash(npx *),Bash(pip *),Bash(python *),Bash(python3 *),Bash(bash *),Bash(sh *)"
cc() { timeout 2400 claude -p "$(cat "$3")" --model "$1" --max-turns "$2" --permission-mode acceptEdits \
  --allowedTools "$ALLOW" --disallowedTools "$DENY" --output-format json > "$4" 2>"$4.err"
  echo "  $(basename "$4" .json): $(node -e "try{const d=require('$4');process.stdout.write('\$'+(d.total_cost_usd||0).toFixed(2)+' turns='+d.num_turns)}catch(e){process.stdout.write('unparsable')}")"; }
police() { node "$B/police-bench.mjs" --root . --task "free:$NS" --claims ./claims.json --base "$BASEH" $COMPILE_ARG --out "$1" > ./_police.md 2>./_police.err
  echo "  🚔 $(node -e "const d=require('$1');process.stdout.write(d.verdict+(d.missing.length?' — חסר: '+d.missing.join(','):'')+' · טענות-שקר: '+d.false_claims)")"; }

T0=$(date +%s)
render "$B/prompts/builder-full.md" > _prompt-builder.md; cc "$MODEL" 120 _prompt-builder.md "$R/builder.json"
police "$R/police-1.json"
if [ "$FLEET" = 1 ]; then
  render "$B/prompts/auditor.md" "task-coverage (did the change cover EVERY surface the task names; what is missing)" "coverage" > _prompt-a1.md
  render "$B/prompts/auditor.md" "edge-crash + compile (null-safety, non-existent Dart methods, nested parens, empty values, text-vs-number comparisons)" "compile" > _prompt-a2.md
  render "$B/prompts/auditor.md" "state-leakage + regression (does the engine change alter OTHER apps; orphan generated files; substring matches that over-trigger)" "regression" > _prompt-a3.md
  cc "$MODEL" 30 _prompt-a1.md "$R/auditor-coverage.json" & cc "$MODEL" 30 _prompt-a2.md "$R/auditor-compile.json" & cc "$MODEL" 30 _prompt-a3.md "$R/auditor-regression.json" & wait
  render "$B/prompts/validator.md" > _prompt-v.md; cc "$MODEL" 30 _prompt-v.md "$R/validator.json"
  MF=$(node -e "const d=require('$R/police-1.json');process.stdout.write(d.missing.join(', '))")
  [ -n "$MF" ] && printf '\n\nMACHINE-FAILURES (mandatory, fix first): %s — see _police.md for the exact files/errors.\n' "$MF" >> _confirmed.md
  if grep -q "FIX-LIST: none" _confirmed.md 2>/dev/null && [ -z "$MF" ]; then echo "  מתקן: דולג"; cp "$R/police-1.json" "$R/final.json"
  else
    for n in $(seq 1 "$ROUNDS"); do
      render "$B/prompts/fixer.md" > _prompt-f.md; cc "$MODEL" 60 _prompt-f.md "$R/fixer-$n.json"
      police "$R/police-fix$n.json"
      [ "$(node -e "process.stdout.write(require('$R/police-fix$n.json').verdict)")" = DONE ] && break
    done
    cp "$R/police-fix$n.json" "$R/final.json"
  fi
else cp "$R/police-1.json" "$R/final.json"; fi

chattr -i machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs 2>/dev/null
git checkout -q -- machtzev/one.mjs machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs 2>/dev/null
rm -rf protocol _prompt-*.md; cp ./_police.md "$R/final.md" 2>/dev/null
V=$(node -e "const d=require('$R/final.json');process.stdout.write(d.verdict)"); T1=$(date +%s)
git add -A >/dev/null 2>&1
git -c core.hooksPath=/dev/null -c user.email=agent@local -c user.name="agent:$MODEL" commit -q -m "$NS · $(printf '%s' "$TASK" | head -c 60) [$V]" 2>/dev/null
echo
echo "═══ $V · $(( (T1-T0)/60 )) דק' · ענף $BR"
echo "    עץ-עבודה: $W"
echo "    דו\"ח: $R/final.md"
echo "    מיזוג: git -C $ROOT merge $BR    ·    ניקוי: git -C $ROOT worktree remove $W"
[ "$V" = DONE ] || echo "    ⚠ המכונה לא אישרה — אל תמזג לפני שקוראים את הדו\"ח"
