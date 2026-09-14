# חוזה · sizeStructurePattern

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/variant_families.dart:157

## התנהגות
Structural pattern of a size string, e.g. "16×16" → "A×A", "16×1/2"×16" →
"A×B×A". Returns "1" for single-value sizes.

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`size_structure_pattern_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/size_structure_pattern_test.dart`.
