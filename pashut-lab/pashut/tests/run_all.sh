#!/bin/sh
# מריץ את כל הבדיקות: השוואה מול Python, והודעות שגיאה.
cd "$(dirname "$0")/.." || exit 2
echo "== השוואה מול Python (אותה תוכנית, אותו פלט) =="
python3 tests/diff_vs_python.py || exit 1
echo "== הודעות שגיאה =="
python3 tests/errors.py || exit 1
echo "== כל הבדיקות עברו =="
