# חוזה · p58SaddleModel

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/polyroll_catalog.dart:259

## התנהגות
p58 (רוכב PPR EF saddle): catalog "מודל" column assigns A/B per-row.
Pattern from the catalog table:
- x32 sizes → B (rows 3, 6).
- 110-125-160x25 → B (row 5).
- All others → A.

## ייעוד-עברי
מקור: own-doc — רוכב · מודל"

## אימות
בדיקת-Golden (`p58_saddle_model_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/p58_saddle_model_test.dart`.
