#!/usr/bin/env bash
# 🪤 מחצב · pre-tool — שלב 2 (PROTOCOL v4 §6) · סבב-3 (R3-2.1–2.13). tripwire על הרגלי-המודל, לא מסנן-פקודות (R2-3.8):
# `bash /tmp/s.sh` · `node -e` · `python -c` · alias גלובלי — יעברו (מוצהר). הראיה = CI-עד (שלב 3).
# חל על Bash · Edit · Write · MultiEdit · NotebookEdit (matcher .* ⇒ כל השאר exit 0). exit 2 = חסום (stderr מוצג למודל).
# fail-closed: אין jq ⇒ 2. root מ-`cwd` של ה-JSON. self-heal (נוחות, לא הגנה): hooksPath · chmod +x · merge-driver.
# סבב-3: קידומת-git מקבלת ארגומנט-ערך (-C dir · -c k=v) · ניקוי-מרכאות · הערכה פר-מקטע (;|&&|||) · dd/awk/ex · find -exec ·
#         נתיב מקנוני (realpath -m) · GIT_CONFIG_PARAMETERS · תיקיות-מוגנות שלמות · sleep/timeout/read -t/while-true · settings.local.json
command -v jq >/dev/null 2>&1 || { echo "🔒 pre-tool: jq חסר — fail-closed" >&2; exit 2; }
IN=$(cat)
TOOL=$(printf '%s' "$IN" | jq -r '.tool_name // ""')
CWD=$(printf '%s' "$IN" | jq -r '.cwd // ""')
case "$TOOL" in Bash|Edit|Write|MultiEdit|NotebookEdit) ;; *) exit 0 ;; esac
ROOT=$(git -C "${CWD:-.}" rev-parse --show-toplevel 2>/dev/null || echo "")
[ -n "$ROOT" ] && [ -f "$ROOT/machtzev/police.mjs" ] || exit 0
AUDIT="$ROOT/.git/protocol_audit.log"
block() { echo "🔒 pre-tool: $1" >&2; echo "[$(date -Iseconds)] BLOCK tool=$TOOL · $1" >> "$AUDIT" 2>/dev/null; exit 2; }

# ── self-heal (idempotent · אפס רשת) ──
if [ -d "$ROOT/.githooks" ]; then
  git -C "$ROOT" config core.hooksPath .githooks 2>/dev/null
  chmod +x "$ROOT"/.githooks/* 2>/dev/null
  git -C "$ROOT" config merge.regen.driver "node machtzev/merge-regen.mjs %O %A %B %P" 2>/dev/null
fi

# ── שכבת-ההגנה (suffix על נתיב מקנוני) ──
PROTECT='machtzev/(ratchet-direction|allow-check|pins-check)\.mjs|\.githooks(/[A-Za-z0-9._-]+)*|\.claude/settings(\.local)?\.json|\.claude/hooks(/[A-Za-z0-9._-]+)*|\.github/workflows(/[A-Za-z0-9._-]+)*|\.gitattributes|\.git/config|\.git/hooks(/[A-Za-z0-9._-]+)*'
PROTDIR='\.githooks|\.claude|\.github|\.git/config|\.git/hooks'
GENERATED='TRUTH\.md|WIRING\.md|atom-index(-full)?\.json|logic-census\.json|pins\.sha256'
allow_edit() {
  [ -z "${PRETOOL_SELFTEST:-}" ] || return 1   # בבדיקה-עצמית: אין bypass (env יכול רק להחמיר)
  local f="$ROOT/.allow_protocol_edit"; [ -f "$f" ] || return 1
  local age=$(( $(date +%s) - $(stat -c %Y "$f" 2>/dev/null || echo 0) )); [ "$age" -le 86400 ] || return 1
  [ "$(grep -v '^$' "$f" | tr -d '[:space:]' | wc -c)" -ge 30 ] || return 1
  [ "$(grep -c . "$f")" -ge 3 ] || return 1
  return 0
}

if [ "$TOOL" != "Bash" ]; then
  FP=$(printf '%s' "$IN" | jq -r '.tool_input.file_path // .tool_input.notebook_path // ""')
  [ -n "$FP" ] || exit 0
  case "$FP" in /*) ;; *) FP="$CWD/$FP" ;; esac
  FP=$(realpath -m "$FP" 2>/dev/null || printf '%s' "$FP")   # R3-2.8: .. / symlink ⇒ הנתיב האמיתי
  if printf '%s' "$FP" | grep -qE "($GENERATED)$"; then block "קובץ-מחולל ($FP) לא נערך ביד — node machtzev/truth.mjs --write · tools/gen-wiring-doc.mjs · census/atom-index.mjs · pins-check --write"; fi
  if printf '%s' "$FP" | grep -qE "($PROTECT)$"; then
    allow_edit || block "עריכת שכבת-ההגנה ($FP) דורשת הוראת-בעלים מפורשת: צור $ROOT/.allow_protocol_edit (שורה 1 prompt-id · 2 YYYY-MM-DD HH:MM · 3 ההוראה ≥30 תווים · תוקף 24h)"
    echo "[$(date -Iseconds)] ALLOW-EDIT tool=$TOOL file=$FP" >> "$AUDIT" 2>/dev/null
  fi
  exit 0
fi

# ── Bash ──
CMD=$(printf '%s' "$IN" | jq -r '.tool_input.command // ""')
[ -n "$CMD" ] || exit 0
CMDN=$(printf '%s' "$CMD" | tr -d "'\"")                        # R3-2.2: מרכאות לא מסתירות מילת-מפתח
hasC() { printf '%s' "$CMDN" | grep -qE -- "$1"; }               # על כל הפקודה
has()  { printf '%s' "$SEG"  | grep -qE -- "$1"; }               # על המקטע הנוכחי
hasI() { printf '%s' "$SEG"  | grep -qiE -- "$1"; }
GP='git[[:space:]]+(-[^[:space:]]+[[:space:]]+([^-[:space:]][^[:space:]]*[[:space:]]+)?)*'   # R3-2.1: קידומת-git כולל ערך אחרי -C/-c/--git-dir
END='([[:space:]]|$|[;&|#)])'                                   # R3-2.4: סוף-טוקן כולל מפריד

hasC 'GIT_CONFIG_(PARAMETERS|COUNT|KEY_[0-9]+)=' && printf '%s' "$CMDN" | grep -qiE 'hookspath|no-?verify' && block 'GIT_CONFIG_PARAMETERS/COUNT עוקף hooksPath (R3-2.9)'
hasC 'while[[:space:]]+(true|:)[[:space:]]*;[[:space:]]*do' && ! hasC 'break|exit|return' && block 'לולאה-אינסופית = polling (T3)'
hasC '(^|[^[:alnum:]_-])--no-verify' && block '--no-verify עוקף את הטבעות (R2-3.7)'
MAIN_OK=0; [ -z "${PRETOOL_SELFTEST:-}" ] && git -C "$ROOT" log -1 --format=%B 2>/dev/null | grep -qE '^Allow: push-main ' && MAIN_OK=1

# הערכה פר-מקטע (R3-2.5): ; && || | ושורה-חדשה מפרידים; whitelist של cp חל רק על המקטע שלו
SEGS=$(printf '%s' "$CMDN" | tr '\n' ';' | sed 's/&&/;/g; s/||/;/g; s/|/;/g')
IFS=';' read -r -a ARR <<< "$SEGS"
for SEG in "${ARR[@]}"; do
  [ -n "$(printf '%s' "$SEG" | tr -d '[:space:]')" ] || continue
  # git — עקיפת-hooks
  has "${GP}commit[[:space:]]+([^[:space:]]+[[:space:]]+)*-[a-zA-Z]*n" && block 'git commit -n = --no-verify'
  hasI "${GP}-c[[:space:]]*core\.hookspath" && block '-c core.hooksPath עוקף hooks (כתיבה; קריאה מותרת)'
  if hasI "${GP}config[[:space:]]+([^[:space:]]+[[:space:]]+)*core\.hookspath"; then
    hasI 'core\.hookspath[[:space:]]+\.githooks'"$END" || hasI 'config[[:space:]]+(--get|--get-all|-l|--list)' || block 'core.hooksPath חייב להיות .githooks (unset/שינוי חסומים)'
  fi
  hasI "${GP}config[[:space:]]+([^[:space:]]+[[:space:]]+)*--unset(-all)?[[:space:]]+core\.hookspath" && block 'unset core.hooksPath'
  has "${GP}config[[:space:]]+([^[:space:]]+[[:space:]]+)*alias\.[^[:space:]]+[[:space:]].*(no-verify|force|hooksPath|commit-tree|update-ref)" && block 'alias שעוקף את הפרוטוקול'
  has "${GP}(commit-tree|update-ref|fast-import|replace)$END" && block 'commit-tree/update-ref/fast-import/replace יוצרים commit/ref בלי טבעות (R2-3.8)'
  if has "${GP}cherry-pick$END"; then has 'cherry-pick[[:space:]]+([^[:space:]]+[[:space:]]+)*(-n|--no-commit|--continue|--abort|--skip|--quit)' || block 'cherry-pick ללא -n/--no-commit יוצר commit בלי pre-commit (R2-2.2)'; fi
  # git — push
  if has "${GP}push$END"; then
    has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*(-f|--force|--force-with-lease(=[^[:space:]]*)?|--force-if-includes|--mirror|--prune|-[a-zA-Z]*f[a-zA-Z]*)'"$END" && block 'force/mirror/prune push — לעולם לא (הכרעה A)'
    has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*\+[^[:space:]]' && block 'refspec +ref = force'
    has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*(--delete|-d)'"$END" && block 'מחיקת ref מרוחק'
    has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*:[^[:space:]]' && block 'refspec :ref = מחיקה מרוחקת'
    if [ "$MAIN_OK" = 0 ]; then
      has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*[^[:space:]]*:(refs/heads/)?(main|master|production)'"$END" && block 'push ל-main בלי אישור-בעלים (הכרעה A)'
      has 'push[[:space:]]+([^[:space:]]+[[:space:]]+)*(refs/heads/)?(main|master|production)'"$END" && block 'push ל-main בלי אישור-בעלים (הכרעה A)'
    fi
  fi
  # git — פעלים על מוגנים ומחיקה/שכתוב דרך הקליפה (R3-2.5–2.7, 2.10)
  has "${GP}(checkout|restore|apply|reset[[:space:]]+--hard|stash[[:space:]]+pop|clean|rm|mv)[[:space:]]+[^[:space:]]*([[:space:]]+[^[:space:]]+)*[[:space:]]+[^[:space:]]*($PROTDIR)" && ! has "${GP}(checkout|restore)[[:space:]]+([^[:space:]]+[[:space:]]+)*--[[:space:]]+\.$END" && block 'פועל-git על שכבת-ההגנה — עריכה רק דרך .allow_protocol_edit'
  has "(^|[[:space:]])(rm|unlink|mv|truncate|shred|rmdir)[[:space:]]+([^[:space:]]+[[:space:]]+)*[^[:space:]]*($PROTDIR)" && block 'מחיקה/הזזה של שכבת-ההגנה'
  has "(^|[[:space:]])chmod[[:space:]]+([^[:space:]]+[[:space:]]+)*[^[:space:]]*($PROTECT)" && ! has 'chmod[[:space:]]+(\+x|a\+x|u\+x|ug\+x|755|775)[[:space:]]' && block 'chmod שמוריד הרצה מ-hook (R2-1.4)'
  has "(^|[[:space:]])(sed[[:space:]]+(-[a-zA-Z]*i|--in-place)|perl[[:space:]]+-[a-zA-Z]*i|tee|cp|install|ln|dd|awk|ex)[[:space:]]+([^[:space:]]+[[:space:]]+)*(of=)?[^[:space:]]*($PROTECT)" && ! has "^[[:space:]]*cp[[:space:]]+[^[:space:]]*\.githooks/[a-z-]+[[:space:]]+[^[:space:]]*\.git/hooks/[a-z-]+[[:space:]]*$" && block 'שכתוב-במקום של שכבת-ההגנה'
  has "(^|[[:space:]])(python3?|perl|ruby|node)[[:space:]]+-[a-zA-Z]*[ce][[:space:]].*($PROTECT)" && block 'כתיבה דרך מפרש לשכבת-ההגנה (מוצהר-חלקית R2-3.8; הנתיב מופיע בפקודה)'
  has ">[>|]?[[:space:]]*[^[:space:]]*($PROTECT)$END" && block 'redirect אל שכבת-ההגנה'
  has ">[>|]?[[:space:]]*[^[:space:]]*($GENERATED)$END" && block 'redirect אל קובץ-מחולל — רק הכלי כותב אותו'
  has "(^|[[:space:]])(sed[[:space:]]+(-[a-zA-Z]*i|--in-place)|perl[[:space:]]+-[a-zA-Z]*i|tee|dd)[[:space:]]+([^[:space:]]+[[:space:]]+)*(of=)?[^[:space:]]*($GENERATED)" && block 'עריכה-במקום של קובץ-מחולל'
  has 'eval[[:space:]]+.*git[[:space:]]+(commit|push)' && block 'eval של git commit/push'
  has "find[[:space:]]+([^[:space:]]+[[:space:]]+)*[^[:space:]]*($PROTDIR)[^[:space:]]*.*(-delete|-exec)" && block 'find -delete/-exec על שכבת-ההגנה (R3-2.7)'
  # חוקי-המחצב
  has "${GP}(checkout|restore)[[:space:]]+(--[[:space:]]+)?\.$END" && ! hasC '\([[:space:]]*(cd[[:space:]]+[^;]*;[[:space:]]*)?git[[:space:]]+checkout[[:space:]]+--[[:space:]]+\.[[:space:]]*\)' && block 'checkout/restore של כל העץ בגנסיס (T2) — נתיב מפורש בלבד'
  has '(^|[[:space:]]|/)sleep[[:space:]]+[0-9]' && block 'sleep/polling (T3) — הארנס מעיר אותך'
  has '(^|[[:space:]])timeout[[:space:]]+[0-9]+[smh]?[[:space:]]+(cat|sleep|tail|read)' && block 'המתנה מוסווית (timeout N cat/tail) (T3 · R3-2.11)'
  has '(^|[[:space:]])read[[:space:]]+-[a-zA-Z]*t[[:space:]]*[0-9]' && block 'read -t = sleep (T3)'
done
if hasC 'machtzev/(one\.mjs|truth\.mjs[[:space:]]+([^;|&]*[[:space:]])?--write)'; then
  if [ -n "$(git -C "$ROOT" status --porcelain -- new machtzev 2>/dev/null | grep -vE 'TRUTH\.md|WIRING\.md|pins\.sha256|atom-index|logic-census|^\?\? ' )" ]; then
    echo "ℹ️ pre-tool: truth/one על עץ לא-נח — ה-hook יחשב מהאינדקס; ודא שה-staged הוא מה שהתכוונת" >&2
  fi
fi
hasC 'pins-check\.mjs[[:space:]]+([^;|&]*[[:space:]])?--write' && echo "[$(date -Iseconds)] PINS-WRITE cmd=$(printf '%s' "$CMD" | head -c 200)" >> "$AUDIT" 2>/dev/null
hasC '(^|[[:space:]])--(baseline|floor|write)([[:space:]]|=|$)' && echo "[$(date -Iseconds)] RATCHET-WRITE cmd=$(printf '%s' "$CMD" | head -c 200)" >> "$AUDIT" 2>/dev/null
exit 0
