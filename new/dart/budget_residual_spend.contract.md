# חוזה · budgetResidualSpend

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/budget_screen.dart:185

## התנהגות
#twin — orders whose site matched NO project (the "אחר / ללא פרויקט" residual):
Σ all orders − Σ orders that landed on a known project name. Pure → testable;
the row only renders when this is `> 0`.

## ייעוד-עברי
מקור: own-doc — אחר · ללא · פרויקט"

## אימות
בדיקת-Golden (`budget_residual_spend_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/budget_residual_spend_test.dart`.
