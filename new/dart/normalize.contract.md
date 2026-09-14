# חוזה · normalize

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/logic/equipment_stock_join.dart:35

## התנהגות
Normalize one side of the join: trim, lower-case, and collapse every run of
whitespace AND punctuation (anything that is not a letter/digit, across
scripts incl. Hebrew via Unicode-aware classes) into a single space, then
trim again. So 'סרט טפלון (PTFE)' and '  סרט   טפלון – ptfe ' both reduce to
a clean space-separated core, and 'Wrench, 1/2"' → 'wrench 1 2'. Punctuation
becomes a separator (not a deletion) so adjacent words never fuse.

## ייעוד-עברי
מקור: own-doc — סרט · טפלון · סרט · טפלון

## אימות
בדיקת-Golden (`normalize_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/normalize_test.dart`.
