#!/bin/bash
# 🪝 session-start · מתקין Dart SDK מקובע (3.13.2) כדי ששער-הוכחות-הקופסאות
# (dart run על 62 ההוכחות) ושקילות-ה-Dart בשער-הסינתזה יהיו **ברי-שחזור בכל checkout** —
# לא מותנים בהתקנה אד-הוק (L34). אידמפוטנטי + נשמר-במטמון: אם Dart כבר קיים ⇒ מדלג.
set -euo pipefail

DART_VER="3.13.2"
DART_HOME="${DART_HOME_OVERRIDE:-$HOME/dart-sdk}"
DART_BIN="$DART_HOME/bin/dart"

if [ ! -x "$DART_BIN" ]; then
  echo "session-start: מתקין Dart $DART_VER → $DART_HOME ..." >&2
  tmp="$(mktemp -d)"
  url="https://storage.googleapis.com/dart-archive/channels/stable/release/${DART_VER}/sdk/dartsdk-linux-x64-release.zip"
  curl -fsSL "$url" -o "$tmp/dart.zip"
  unzip -q "$tmp/dart.zip" -d "$tmp"
  rm -rf "$DART_HOME"; mkdir -p "$(dirname "$DART_HOME")"; mv "$tmp/dart-sdk" "$DART_HOME"
  rm -rf "$tmp"
else
  echo "session-start: Dart כבר קיים ($DART_BIN) — מדלג." >&2
fi

# הצבת-סביבה לסשן (חוק-6: חיווט-הצבה, לא אטום) — שערי-ה-Dart מוצאים את הבינארי
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export DART_BIN=\"$DART_BIN\"" >> "$CLAUDE_ENV_FILE"
  echo "export PATH=\"$DART_HOME/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

"$DART_BIN" --version >&2
