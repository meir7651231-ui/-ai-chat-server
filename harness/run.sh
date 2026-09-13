#!/usr/bin/env bash
# 🔁 harness/run.sh — הלולאה. מריץ סוכן על משימה, ומחזיר אותו למכונה עד שהפסק DONE.
#   זה החלק שמשפר את התוצאה: במדידה על 50 משימות, מודל זול עלה מ-40 ל-46 מתוך 50 בזכות הלולאה בלבד.
#
#   שימוש:  harness/run.sh [-m מודל] [-s scope] [-k סבבים] [-t שניות] [--here] [--print] "המשימה במילים"
#     -m   מזהה-מודל (ברירת-מחדל: $HARNESS_MODEL או claude-sonnet-5)
#     -s   רדיוס מותר, regex על נתיב-קובץ (למשל 'src/cart') — הכל מחוצה לו = חריגה
#     -k   כמה סבבי-תיקון אחרי הבנייה הראשונה (ברירת-מחדל 3)
#     -t   תקרת-זמן לכל סבב בשניות (ברירת-מחדל 1800)
#     --here   לעבוד בתיקייה הנוכחית במקום בעץ-עבודה מבודד (מהיר, פחות בטוח)
#     --print  לא מריץ כלום — מדפיס את ההנחיה כדי להדביק לסוכן אחר (Cursor / Copilot / ChatGPT)
#
#   סוכן אחר במקום claude: HARNESS_AGENT_CMD='my-cli --file "$PROMPT_FILE" --model "$MODEL"' harness/run.sh …
#   פלט: ענף `harness/<חותם>` + .harness/runs/<חותם>/ עם דו"ח-מכונה לכל סבב. אין push, אין מיזוג — שלך להחליט.
set -u
MODEL="${HARNESS_MODEL:-claude-sonnet-5}"; SCOPE=""; ROUNDS=3; TMO=1800; HERE=0; PRINT=0
while [ $# -gt 0 ]; do case "$1" in
  -m) MODEL="$2"; shift 2;; -s) SCOPE="$2"; shift 2;; -k) ROUNDS="$2"; shift 2;; -t) TMO="$2"; shift 2;;
  --here) HERE=1; shift;; --print) PRINT=1; shift;; -h|--help) sed -n '2,18p' "$0"; exit 0;; *) break;; esac; done
TASK="${*:-}"
[ -n "$TASK" ] || { sed -n '2,18p' "$0" | sed 's|^# \?||'; exit 2; }

H="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$H" rev-parse --show-toplevel 2>/dev/null)" || { echo "✗ זה לא ריפו git — המנוע צריך git כדי לדעת מה השתנה"; exit 2; }
[ -f "$ROOT/harness.json" ] || { echo "✗ אין harness.json — הרץ:  node harness/police.mjs --init"; exit 2; }
STAMP=$(date -u +%m%d-%H%M%S); BR="harness/$STAMP"

# ── ההנחיה: המשימה + חוזה-השער. זה כל מה שהסוכן צריך לדעת על הרתמה ──
protocol() { cat <<EOP
$TASK

---
## The gate (mandatory)

This repo has a machine gate. You are NOT done when you think you are done — you are done when the
machine says DONE. Work like this:

1. Do the task.
2. Run: node harness/police.mjs${SCOPE:+ --scope '$SCOPE'} --claims ./claims.json
3. Read the verdict. If it is NOT DONE, the report names exactly which gate failed and on which file.
   Fix that, then run it again. Repeat until DONE.
4. Before you stop, write ./claims.json with every claim you want to make:
   {"claims":[{"check":"verify","text":"tests pass"},{"check":"in_scope","text":"only src/cart touched"}],"notes":"..."}
   The machine marks each claim CONFIRMED / FALSE / UNVERIFIED. A FALSE claim is worse than no claim.

Rules that are enforced, not suggested:
- Destructive commands are quarantined and commits are blocked. Do not try to work around this.
- harness/, harness.json and .harness/ are off limits. Editing them is detected (harness_intact) and fails the run.
- Do not weaken a test, skip a test, or delete a file to make a gate green. Every one of those is its own gate.
- Do not touch files outside the task's scope. Collateral change is the single most common failure here.

Report at the end: the final verdict line from the machine, verbatim.
EOP
}

if [ "$PRINT" = 1 ]; then protocol; exit 0; fi

# ── עץ-עבודה מבודד: המקור שלך לא נוגע עד שאתה ממזג ──
if [ "$HERE" = 1 ]; then W="$ROOT"; else
  W="$ROOT/.harness-runs/$STAMP"
  git -C "$ROOT" worktree add -q -b "$BR" "$W" HEAD || exit 3
  echo "🌳 עץ-עבודה: $W  (ענף $BR)"
fi
cd "$W" || exit 3
R="$W/.harness/runs/$STAMP"; mkdir -p "$R"
for ig in '.harness/' 'claims.json' '.harness-runs/'; do grep -qxF "$ig" .gitignore 2>/dev/null || echo "$ig" >> .gitignore; done
[ -f claims.json ] || echo '{"claims":[],"notes":""}' > claims.json

cleanup() { node harness/guard.mjs --disarm >/dev/null 2>&1; }
trap cleanup EXIT INT TERM

# ── 1 · בסיס: חתימה על כל קובץ לפני שהסוכן נוגע. בלי זה שער-הרדיוס עיוור ──
echo "📌 בסיס …"
node harness/police.mjs --baseline || { echo "✗ הבסיס נכשל — הבנייה לא עוברת עוד לפני שהסוכן נגע. תקן קודם."; exit 2; }

# ── 2 · מניעה: הסגר, חסימת-commit, חתימה על השופט ──
node harness/guard.mjs --arm || exit 2
eval "$(node harness/guard.mjs --tools)"

# ── 3 · הלולאה: בנאי → מכונה → מתקן → מכונה … עד DONE או עד תקרת-הסבבים ──
agent() {   # $1=קובץ-הנחיה  $2=תקציב-תורות
  local rc
  if [ -n "${HARNESS_AGENT_CMD:-}" ]; then PROMPT_FILE="$1" MODEL="$MODEL" bash -c "$HARNESS_AGENT_CMD" >"$1.out" 2>"$1.err"; rc=$?
  else timeout "$TMO" claude -p "$(cat "$1")" --model "$MODEL" --max-turns "$2" --permission-mode acceptEdits \
      ${ALLOW:+--allowedTools "$ALLOW"} --disallowedTools "$DENY" >"$1.out" 2>"$1.err"; rc=$?; fi
  [ $rc -eq 0 ] || { echo "  ✗ הסוכן נכשל (קוד $rc). זה לא DONE — ריצה שלא קרתה אינה ריצה שהצליחה:"; sed -n '1,5p' "$1.err" | sed 's/^/     /'; return 1; }
  return 0
}
touched() { [ -n "$(git status --porcelain 2>/dev/null)" ] || ! git diff --quiet HEAD 2>/dev/null; }
police() { node harness/police.mjs ${SCOPE:+--scope "$SCOPE"} --claims ./claims.json --out "$1" >/dev/null 2>&1
  node -e "const d=require('$1');console.log('  🚔 '+d.verdict+(d.missing.length?' — חסר: '+d.missing.join(', '):'')+(d.false_claims?' · טענות-שקר: '+d.false_claims:''))"
  node -e "process.exit(require('$1').verdict==='DONE'?0:1)"; }

command -v claude >/dev/null || [ -n "${HARNESS_AGENT_CMD:-}" ] || { echo "✗ אין claude ב-PATH. או שתתקין, או שתריץ --print ותדביק לסוכן שלך."; exit 3; }
T0=$(date +%s); V=""

for n in $(seq 0 "$ROUNDS"); do
  if [ "$n" = 0 ]; then echo "🔨 סבב 0 · בנייה"; protocol > "$R/prompt-0.md"
    agent "$R/prompt-0.md" 120 || { V="הסוכן לא רץ"; break; }
    touched || { echo "  ✗ הסוכן לא שינה שום קובץ. שער ריק אינו DONE."; V="אפס-שינוי"; break; }
  else
    echo "🔧 סבב $n · תיקון"
    { echo "The machine rejected your work. This is its report — it is a program, not an opinion:"; echo
      cat "$R/report-$((n-1)).md"; echo
      echo "Fix EXACTLY what is listed above and nothing else. Do not start new work."
      echo "A red 'in_scope' means you changed a file the task did not ask for — revert that file, do not rationalize it."
      echo "Then run: node harness/police.mjs${SCOPE:+ --scope '$SCOPE'} --claims ./claims.json  — and keep going until it says DONE."
      echo; echo "The original task, for context:"; echo "$TASK"; } > "$R/prompt-$n.md"
    agent "$R/prompt-$n.md" 80 || { V="הסוכן נכשל בסבב $n"; break; }
  fi
  if police "$R/report-$n.json"; then V=DONE; break; fi
  V="NOT DONE"
done

# ── 4 · שחרור, שמירה, פסק ──
cleanup; trap - EXIT
T1=$(date +%s)
git add -A >/dev/null 2>&1
git -c core.hooksPath=/dev/null -c user.email=harness@local -c user.name="agent:$MODEL" \
    commit -q -m "$(printf '%s' "$TASK" | head -c 60) [$V]" >/dev/null 2>&1
echo
echo "═══ ${V:-?} · $(( (T1-T0)/60 )) דק' · $(( n + 1 )) סבבים"
[ -f "$R/report-$n.md" ] && echo "    דו\"ח: $R/report-$n.md" || echo "    יומן-הסוכן: $R/prompt-$n.md.err"
[ "$HERE" = 1 ] || { echo "    מיזוג: git -C $ROOT merge $BR"; echo "    ניקוי: git -C $ROOT worktree remove --force $W && git -C $ROOT branch -D $BR"; }
[ "$V" = DONE ] || echo "    ⚠ המכונה לא אישרה — אל תמזג לפני שאתה קורא את הדו\"ח"
[ "$V" = DONE ]
