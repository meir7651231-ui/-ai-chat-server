# חוזה · chainArrowText

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/related_info.dart:1464

## התנהגות
Format a materialized line (the engine's `plan.items`, which already include
the inserted pipes/couplings/safety) as a glanceable RTL arrow sequence,
e.g. "מחסום ← צינור ← מצמד". Pure formatting; empty list → ''.

## ייעוד-עברי
מקור: own-doc — מחסום · צינור · מצמד"

## אימות
בדיקת-Golden (`chain_arrow_text_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/chain_arrow_text_test.dart`.
