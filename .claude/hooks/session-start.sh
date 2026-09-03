#!/bin/bash
# 🪝 session-start · מחצב — שלב 1 (PROTOCOL v4 §6, הופעל באישור-בעלים 3.9.2026).
# שורה 1 = הפעלת-הפרוטוקול: core.hooksPath + executable + merge-driver (R2-3.7 · R2-6.4: היה set -e + curl ראשון ⇒
# כשל-רשת הפיל את הכל לפני שהופעל דבר). Dart: אטומי, לא-פטאלי (צהוב), נשמר-במטמון (L34). אחר כך: כרטיס-מצב קצר.
# לא `set -e` — כל שלב מדווח ומתקדם.
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO" || exit 0

# ── 1 · הפעלת-הפרוטוקול (idempotent, אפס רשת) ──
git config core.hooksPath .githooks 2>/dev/null
chmod +x .githooks/* 2>/dev/null
git config merge.regen.driver "node machtzev/merge-regen.mjs %O %A %B %P" 2>/dev/null
git config merge.regen.name "regenerate generated docs (TRUTH/WIRING)" 2>/dev/null
echo "🔒 מחצב: hooksPath=.githooks · merge.regen · $(ls .githooks 2>/dev/null | wc -l) hooks · pre-tool $([ -x .claude/hooks/pre-tool.sh ] && echo פעיל || echo חסר) (שלב 2)" >&2

# ── 2 · Dart (אטומי · לא-פטאלי) ──
DART_VER="3.13.2"
DART_HOME="${DART_HOME_OVERRIDE:-$HOME/dart-sdk}"
DART_BIN="$DART_HOME/bin/dart"
if [ ! -x "$DART_BIN" ]; then
  if [ -x /home/user/flutter/bin/dart ]; then
    echo "session-start: Dart של Flutter קיים (/home/user/flutter/bin/dart) — dart-bin.mjs ימצא אותו; דילוג על הורדה." >&2
  else
    echo "session-start: מתקין Dart $DART_VER → $DART_HOME (אטומי) ..." >&2
    tmp="$(mktemp -d)"; url="https://storage.googleapis.com/dart-archive/channels/stable/release/${DART_VER}/sdk/dartsdk-linux-x64-release.zip"
    if curl -fsSL --max-time 300 "$url" -o "$tmp/dart.zip" && unzip -q "$tmp/dart.zip" -d "$tmp" && "$tmp/dart-sdk/bin/dart" --version >/dev/null 2>&1; then
      rm -rf "$DART_HOME.partial"; mv "$tmp/dart-sdk" "$DART_HOME.partial" && mv "$DART_HOME.partial" "$DART_HOME" && echo "session-start: Dart מותקן" >&2
    else echo "🟡 session-start: הורדת-Dart נכשלה — שערי-Dart יהיו צהובים (tool=dart), לא אדומים (L34)" >&2; fi
    rm -rf "$tmp"
  fi
fi
if [ -n "${CLAUDE_ENV_FILE:-}" ] && [ -x "$DART_BIN" ]; then
  echo "export DART_BIN=\"$DART_BIN\"" >> "$CLAUDE_ENV_FILE"
  echo "export PATH=\"$DART_HOME/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

# ── 3 · typescript vendored (c1) ──
if [ ! -d machtzev/node_modules/typescript ] && command -v npm >/dev/null 2>&1; then
  (cd machtzev && npm ci --no-audit --no-fund >/dev/null 2>&1) && echo "session-start: typescript vendored הותקן" >&2 || echo "🟡 session-start: npm ci נכשל — freeref/deeppurity יהיו צהובים" >&2
fi

# ── 4 · כרטיס-מצב (§10 — בנוסף לסדר-הקריאה ב-CLAUDE.md, לא במקומו) ──
BR=$(git branch --show-current 2>/dev/null || echo HEAD)
git fetch -q origin "$BR" 2>/dev/null
AHEAD=$(git rev-list --count "origin/$BR..HEAD" 2>/dev/null || echo "?"); BEHIND=$(git rev-list --count "HEAD..origin/$BR" 2>/dev/null || echo "?")
TB=$(sed -n '/truth:begin/,/truth:end/p' CLAUDE.md 2>/dev/null | grep -v 'truth:' | head -1 | cut -c1-160)
echo "🏛 מחצב · $BR · HEAD $(git rev-parse --short HEAD 2>/dev/null) · ahead $AHEAD / behind $BEHIND מול origin" >&2
[ -n "$TB" ] && echo "📐 $TB" >&2
echo "🚨 המשטרה: node machtzev/police.mjs --inc (commit) · מלא (push) — מופעלת אוטומטית ב-hooks (שלב 1). מאמת: node machtzev/verify-independent.mjs protocol-good-2026-09-03 HEAD" >&2
echo "📖 סדר-קריאה-חובה: CLAUDE.md §📖 (VERIFY-LAWS → LAW → LEARNINGS → AGENT-CODE → CURRICULUM → DECISIONS → WIRING) · הפרוטוקול: machtzev/PROTOCOL.md" >&2
exit 0
