# חוזה · nextProfessionMode

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/profession_mode.dart:24

## התנהגות
Cycle order for the UI chip: diy → contractor → pro → diy …
Pure (no provider read); the UI calls this on tap.

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`next_profession_mode_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/next_profession_mode_test.dart`.
