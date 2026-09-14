# חוזה · firstSizeNum

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/lipskey_products_screen.dart:2532

## התנהגות
First numeric value in a size label (e.g. "1/2\"" → 1, "DN50" → 50). Used
to sort size siblings in an intuitive order.

## ייעוד-עברי
מקור: source-screen · screens__lipskey_products_screen — יוסר · מהסל · מוצרים · ׳״ · קוטר · חיצוני · נומינלי · או · אורך · אין · להצגה · אישור

## אימות
בדיקת-Golden (`first_size_num_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/first_size_num_test.dart`.
