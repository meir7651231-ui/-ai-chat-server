# חוזה · fmtAuthorDate

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/tasks_screen.dart:1145

## התנהגות
`dd.MM.yyyy` zero-padded date label for the author start-date button (Wave
G2b) — a small local formatter (no dart:intl in this codebase). Only ever
called with a date the contractor actually picked (never invented).

## ייעוד-עברי
מקור: source-screen · screens__tasks_screen — משימות · הושלמו · אין · לצוות · עדיין · חדשות · יופיעו · כאן · אישור · המשימה · אשר · אתה

## אימות
בדיקת-Golden (`fmt_author_date_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/fmt_author_date_test.dart`.
