# חוזה · grouped

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/manager_dashboard_screen.dart:2030

## התנהגות
Thousands-grouped integer (the legacy `Number.toLocaleString()` for the ₪
sums) — e.g. 3150 → "3,150". Pure, no locale dependency.

## ייעוד-עברי
מקור: source-screen · screens__manager_dashboard_screen — מוצרים · הזמנות · אתרים · פריטים · התקבלה · בהכנה · מוכן · נאסף · בדרך · נמסר · עקיפת · מנהל

## אימות
בדיקת-Golden (`grouped_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/grouped_test.dart`.
