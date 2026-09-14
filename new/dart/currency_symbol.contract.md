# חוזה · currencySymbol

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/catalog_settings.dart:469

## התנהגות
Display symbol for the chosen catalog currency. This is the *local display*
symbol only — NO FX conversion is applied to the amount (live rates need an
external service; faking a conversion would mislead). The selection is
persisted and the symbol is shown next to the (unconverted) amount.

## ייעוד-עברי
מקור: caller-screen · screens__lipskey_product_sheet — ליחידה · מוצרים · וריאנטים · דרישות · שלבים · חלקים · צדדים · מה · מתחבר · לכל · מידה · חובה

## אימות
בדיקת-Golden (`currency_symbol_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/currency_symbol_test.dart`.
