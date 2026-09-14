# חוזה · nextProjectMode

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/project_mode.dart:33

## התנהגות
Cycle order for the UI chip: any → cold → hot → commercial → any.
Pure — caller passes the current; UI taps to advance.

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`next_project_mode_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/next_project_mode_test.dart`.
