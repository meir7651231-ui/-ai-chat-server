# חוזה · wk

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/tasks_screen.dart:50

## התנהגות
CRASH-GUARD — a worker index can outrun [kWorkers] (a task stamped for a
worker who is no longer in the demo roster, or a malformed/server payload),
so `kWorkers[i]` would throw a RangeError. Clamp out-of-range indices to the
first worker label instead of crashing the whole board.

## ייעוד-עברי
מקור: source-screen · screens__tasks_screen — משימות · הושלמו · אין · לצוות · עדיין · חדשות · יופיעו · כאן · אישור · המשימה · אשר · אתה

## אימות
בדיקת-Golden (`wk_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/wk_test.dart`.
