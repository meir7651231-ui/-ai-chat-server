# חוזה · fxGroupInt

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/finance_hub_sheets.dart:1662

## התנהגות
Group an integer with thousands commas (proto updateFXCalc toLocaleString).
Top-level + public so `fx_group_test` can pin it directly.

## ייעוד-עברי
מקור: source-screen · screens__finance_hub_sheets — דוח · פיננסי · לפרויקט · מבקש · ימי · איחור · ליום · רישום · קנס · מהתקציב · צפוי · אושר

## אימות
בדיקת-Golden (`fx_group_int_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/fx_group_int_test.dart`.
