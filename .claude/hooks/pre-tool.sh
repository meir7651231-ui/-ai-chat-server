#!/usr/bin/env bash
# 🪤 מחצב · pre-tool — שלב 2 (PROTOCOL v4 §6). tripwire על הרגלי-המודל, לא מסנן-פקודות (R2-3.8):
# `bash /tmp/s.sh` · `node -e` · `commit-tree|update-ref` דרך משתנים · alias גלובלי — יעברו. הראיה = CI-עד (שלב 3).
# חל על Bash · Edit · Write · MultiEdit · NotebookEdit (matcher .* ⇒ כל השאר exit 0). exit 2 = חסום (stderr מוצג למודל).
# fail-closed: אין jq ⇒ 2. root מ-`cwd` של ה-JSON, לא מ-$CLAUDE_PROJECT_DIR (ריק בתת-סוכנים — R2-3.10).
# self-heal (נוחות, לא הגנה — R2-3.9): hooksPath · chmod +x · merge-driver בכל קריאה.
command -v jq >/dev/null 2>&1 || { echo "🔒 pre-tool: jq חסר — fail-closed" >&2; exit 2; }
IN=$(cat)
TOOL=$(printf '%s' "$IN" | jq -r '.tool_name // ""')
CWD=$(printf '%s' "$IN" | jq -r '.cwd // ""')
case "$TOOL" in Bash|Edit|Write|MultiEdit|NotebookEdit) ;; *) exit 0 ;; esac
ROOT=$(git -C "${CWD:-.}" rev-parse --show-toplevel 2>/dev/null || echo "")
# הריפו הזה בלבד: כלי שרץ בריפו אחר (buildsmart ↔ מחצב באותו סשן — R2-3.11) ⇒ לא ענייננו
[ -n "$ROOT" ] && [ -f "$ROOT/machtzev/police.mjs" ] || exit 0
AUDIT="$ROOT/.git/protocol_audit.log"
block() { echo "🔒 pre-tool: $1" >&2; echo "[$(date -Iseconds)] BLOCK tool=$TOOL · $1" >> "$AUDIT" 2>/dev/null; exit 2; }

# ── self-heal (idempotent · אפס רשת) ──
if [ -d "$ROOT/.githooks" ]; then
  git -C "$ROOT" config core.hooksPath .githooks 2>/dev/null
  chmod +x "$ROOT"/.githooks/* 2>/dev/null
  git -C "$ROOT" config merge.regen.driver "node machtzev/merge-regen.mjs %O %A %B %P" 2>/dev/null
fi

# ── שכבת-ההגנה (suffix על נתיב מוחלט) ──
PROTECT='\.githooks(/[a-z-]+)?|\.claude/settings\.json|\.claude/hooks(/(pre-tool|session-start)\.sh)?|\.github/workflows/police\.yml|\.gitattributes|\.git/config|\.git/hooks(/[a-z-]+)?'
GENERATED='TRUTH\.md|WIRING\.md|atom-index(-full)?\.json|logic-census\.json|pins\.sha256'
# bypass לשכבת-ההגנה בלבד: .allow_protocol_edit (3 שורות · <24h · ≥30 תווים) — מחוללים לעולם לא ביד
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
has() { printf '%s' "$CMD" | grep -qE -- "$1"; }
hasI() { printf '%s' "$CMD" | grep -qiE -- "$1"; }

# git — עקיפת-hooks
has '(^|[^[:alnum:]_-])--no-verify' && block '--no-verify עוקף את הטבעות (R2-3.7)'
has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*commit[[:space:]]+([^;|&]*[[:space:]])?-[a-zA-Z]*n' && block 'git commit -n = --no-verify (R2-סבב-1 122)'
has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(merge|rebase|am|cherry-pick|revert)[[:space:]]+([^;|&]*[[:space:]])?--no-verify' && block '--no-verify על merge/rebase/am'
hasI 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*-c[[:space:]]*core\.hookspath' && block '-c core.hooksPath עוקף hooks (כתיבה; קריאה מותרת)'
if hasI 'git[[:space:]]+config[[:space:]]+([^;|&]*[[:space:]])?core\.hookspath'; then
  hasI 'core\.hookspath[[:space:]]+\.githooks([[:space:]]|$|["'"'"'])' || hasI 'config[[:space:]]+(--get|--get-all|-l|--list)' || block 'core.hooksPath חייב להיות .githooks (unset/שינוי חסומים)'
fi
hasI 'git[[:space:]]+config[[:space:]]+([^;|&]*[[:space:]])?--unset(-all)?[[:space:]]+core\.hookspath' && block 'unset core.hooksPath'
has 'git[[:space:]]+config[[:space:]]+([^;|&]*[[:space:]])?alias\.[^[:space:]]+[[:space:]].*(no-verify|force|hooksPath|commit-tree|update-ref)' && block 'alias שעוקף את הפרוטוקול'
has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(commit-tree|update-ref)([[:space:]]|$)' && block 'commit-tree/update-ref יוצרים commit/ref בלי טבעות (R2-3.8) — git commit/push בלבד'
if has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*cherry-pick([[:space:]]|$)'; then has 'cherry-pick[[:space:]]+([^;|&]*[[:space:]])?(-n|--no-commit|--continue|--abort|--skip|--quit)' || block 'cherry-pick ללא -n/--no-commit יוצר commit בלי pre-commit (R2-2.2): git cherry-pick -n X && git commit'; fi
has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*am([[:space:]]|$)' && ! has 'am[[:space:]]+([^;|&]*[[:space:]])?(--continue|--abort|--skip|--show-current-patch)' && echo "ℹ️ pre-tool: git am ⇒ pre-applypatch מריץ את טבעת-ה-commit" >&2
# git — push
MAIN_OK=0; [ -f "$ROOT/.allow_push_main" ] && [ -z "${PRETOOL_SELFTEST:-}" ] && MAIN_OK=1
if has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*push([[:space:]]|$)'; then
  has 'push[[:space:]]+([^;|&]*[[:space:]])?(-f|--force|--force-with-lease(=[^[:space:]]*)?|--force-if-includes|--mirror|--prune|-[a-zA-Z]*f[a-zA-Z]*)([[:space:]]|$)' && block 'force/mirror/prune push — לעולם לא; origin קדימה ⇒ fetch+rebase (הכרעה A)'
  has 'push[[:space:]]+([^;|&]*[[:space:]])?\+[^[:space:]]' && block 'refspec +ref = force'
  has 'push[[:space:]]+([^;|&]*[[:space:]])?(--delete|-d)([[:space:]]|$)' && block 'מחיקת ref מרוחק'
  has 'push[[:space:]]+([^;|&]*[[:space:]])?:[^[:space:]]' && block 'refspec :ref = מחיקה מרוחקת'
  has 'push[[:space:]]+([^;|&]*[[:space:]])?[^[:space:]]*:(refs/heads/)?(main|master|production)([[:space:]]|$)' && [ "$MAIN_OK" = 0 ] && block 'push ל-main בלי אישור-בעלים (הכרעה A)'
  has 'push[[:space:]]+([^;|&]*[[:space:]])?origin[[:space:]]+(main|master|production)([[:space:]]|$)' && [ "$MAIN_OK" = 0 ] && block 'push ל-main בלי אישור-בעלים (הכרעה A)'
fi
# git — פעלים על מוגנים (R2-3.9: self-heal יפעיל hook זר) ומחיקה/שכתוב דרך הקליפה
has "git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(checkout|restore|apply|reset[[:space:]]+--hard|stash[[:space:]]+pop|clean)[[:space:]]+[^;|&]*($PROTECT)" && block 'פועל-git על שכבת-ההגנה — עריכה רק דרך .allow_protocol_edit'
has "(^|[;&|][[:space:]]*|[[:space:]])(rm|unlink|mv|truncate|shred)[[:space:]]+[^;|&]*($PROTECT)" && block 'מחיקה/הזזה של שכבת-ההגנה'
has "(^|[;&|][[:space:]]*|[[:space:]])chmod[[:space:]]+[^;|&]*($PROTECT)" && ! has 'chmod[[:space:]]+(\+x|a\+x|u\+x|755|775)' && block 'chmod שמוריד הרצה מ-hook (R2-1.4)'
has "(^|[;&|][[:space:]]*|[[:space:]])(sed[[:space:]]+-[a-zA-Z]*i|perl[[:space:]]+-[a-zA-Z]*i|tee|cp|install|ln)[[:space:]]+[^;|&]*($PROTECT)" && ! has "cp[[:space:]]+[^[:space:]]*\.githooks/[a-z-]+[[:space:]]+[^[:space:]]*\.git/hooks/[a-z-]+[[:space:]]*($|[;&|])" && block 'שכתוב-במקום של שכבת-ההגנה'
has ">[>|]?[[:space:]]*[^|&;[:space:]]*($PROTECT)([[:space:]]|$|[;&|])" && block 'redirect אל שכבת-ההגנה'
has ">[>|]?[[:space:]]*[^|&;[:space:]]*($GENERATED)([[:space:]]|$|[;&|])" && block 'redirect אל קובץ-מחולל — רק הכלי כותב אותו'
has "(^|[;&|][[:space:]]*|[[:space:]])(sed[[:space:]]+-[a-zA-Z]*i|perl[[:space:]]+-[a-zA-Z]*i|tee)[[:space:]]+[^;|&]*($GENERATED)" && block 'עריכה-במקום של קובץ-מחולל'
has 'eval[[:space:]]+[^;|&]*git[[:space:]]+(commit|push)' && block 'eval של git commit/push'
has "find[[:space:]]+[^;|&]*($PROTECT)[^;|&]*-delete" && block 'find -delete על שכבת-ההגנה'

# חוקי-המחצב
has 'git[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(checkout|restore)[[:space:]]+(--[[:space:]]+)?\.([[:space:]]|$|[;&|])' && ! has '\([[:space:]]*(cd[[:space:]]+[^;]*;[[:space:]]*)?git[[:space:]]+checkout[[:space:]]+--[[:space:]]+\.[[:space:]]*\)' && block 'checkout/restore של כל העץ בגנסיס (T2) — נתיב מפורש בלבד'
has '(^|[;&|][[:space:]]*|[[:space:]])sleep[[:space:]]+[0-9]' && block 'sleep/polling (T3) — הארנס מעיר אותך; רשימות-עבודה מ-ls'
if has 'machtzev/(one\.mjs|truth\.mjs[[:space:]]+([^;|&]*[[:space:]])?--write)'; then
  if [ -n "$(git -C "$ROOT" status --porcelain -- new machtzev 2>/dev/null | grep -vE 'TRUTH\.md|WIRING\.md|pins\.sha256|atom-index|logic-census|^\?\? ' )" ]; then
    echo "ℹ️ pre-tool: truth/one על עץ לא-נח (שינויים לא-staged ב-new/machtzev) — ה-hook יחשב מהאינדקס; ודא שה-staged הוא מה שהתכוונת" >&2
  fi
fi
has 'pins-check\.mjs[[:space:]]+([^;|&]*[[:space:]])?--write' && echo "[$(date -Iseconds)] PINS-WRITE cmd=$(printf '%s' "$CMD" | head -c 200)" >> "$AUDIT" 2>/dev/null
has '--baseline([[:space:]]|=)|--floor([[:space:]]|=)' && echo "[$(date -Iseconds)] RATCHET-WRITE cmd=$(printf '%s' "$CMD" | head -c 200)" >> "$AUDIT" 2>/dev/null
exit 0
