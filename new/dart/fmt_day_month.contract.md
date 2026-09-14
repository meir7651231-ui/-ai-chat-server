# חוזה · fmtDayMonth

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/tasks_gantt_sheet.dart:393

## התנהגות
`dd.MM` zero-padded calendar label — a small local formatter (no dart:intl in
this codebase; mirrors the hand-formatting in the attendance/forms sheets).
The date is always a task's real [TaskItem.scheduledStart] — never invented.

## ייעוד-עברי
מקור: source-screen · screens__tasks_gantt_sheet — ימ׳ · אין · משימות · לוח · הזמנים · של · המשימות · לפי · תאריך · התחלה · מתוזמן · לצפייה

## אימות
בדיקת-Golden (`fmt_day_month_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/fmt_day_month_test.dart`.
