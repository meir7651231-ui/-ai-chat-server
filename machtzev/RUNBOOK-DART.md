# RUNBOOK · Dart לשערי-הקופסאות (L34)

שער-הוכחות-הקופסאות ושקילות-ה-Dart בשער-הסינתזה מריצים `dart run` אמיתי על 62 ההוכחות.
**בלי בינארי-Dart אי-אפשר להוכיח אותן** (וזו אינה סחף-חתימות — אל תריץ `rethread-boxes`).

## אוטומטי (מומלץ)
‏`.claude/hooks/session-start.sh` מתקין Dart 3.13.2 ל-`$HOME/dart-sdk` בתחילת-סשן (נשמר-במטמון,
אידמפוטנטי) ומייצא `DART_BIN`. אחרי מיזוג לענף-ברירת-המחדל — כל סשן עתידי מקבל Dart אוטומטית.

## ידני (checkout נקי / סביבה בלי hook)
```bash
bash .claude/hooks/session-start.sh          # מתקין Dart (פעם-אחת) ומדפיס גרסה
export DART_BIN="$HOME/dart-sdk/bin/dart"     # אם ה-hook לא הזריק לסביבה
node machtzev/police.mjs                      # ⇒ ✅ 13/13, קופסאות 0/62
```

## אימות בר-שחזור
`box-proofs-check` פותר Dart לפי הסדר: `DART_BIN → $HOME/dart-sdk → flutter → scratchpad → PATH`.
אין-אף-אחד ⇒ יציאה-2 עם סיבה-כנה ("לא-ניתן-להוכיח, לא סחף"), לא ירוק-חלול ולא הודעת-שקר.
