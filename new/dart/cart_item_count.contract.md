# חוזה · cartItemCount

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/store_screen.dart:473

## התנהגות
Total number of units in the cart: summed fixed-item quantities plus the
quantity of every smart-cart line (so 3× of one product counts as 3).

## ייעוד-עברי
מקור: source-screen · screens__store_screen — פריטים · ממתינים · לסיכום · בבנייה · להמשיך · הוסף · כלים · מושכרים · עד · פעילים · הצעות · חדשות

## אימות
בדיקת-Golden (`cart_item_count_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/cart_item_count_test.dart`.
