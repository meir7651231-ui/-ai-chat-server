# חוזה · safetyKitItems

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/related_info.dart:1453

## התנהגות
Pure list-diff by SKU: what's in [withCompliance] but not in [withoutCompliance].
Used to surface the items the engine's auto-compliance inserted into the
line (correct-by-construction — never invents a SKU). Order-preserving.

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`safety_kit_items_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/safety_kit_items_test.dart`.
