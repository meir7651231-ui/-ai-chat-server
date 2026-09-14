# חוזה · cycleDisplayTemp

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/display_temp.dart:10

## התנהגות
Pure cycle: 60 → 80 → 95 → 60 → ...
Any other input snaps back to 60 (defensive — shouldn't happen via UI).

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`cycle_display_temp_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/cycle_display_temp_test.dart`.
