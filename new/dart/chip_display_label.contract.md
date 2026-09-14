# חוזה · chipDisplayLabel

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/lipskey_products_screen.dart:2237

## התנהגות
One attribute chip in the product name.
• Has siblings → orange border; shows `word · N` where N = picker option count.
• No siblings  → gray border; shows just `word`.
Tapping an orange chip opens the inline picker for that dimension.
PPR hierarchy chips per protocol §21: renders the parseChips path
(connection ‹ shape ‹ feature ‹ thread ‹ size) as a breadcrumb. Replaces
`_NameWords` for Polyroll products only; Lipskey keeps `_NameWords`.
Tapping a chip calls [onChipTap] with the chip's path index.
Display-only cleanup for a chip word: strips a wrapping parenthesis so a
verbatim catalog finish like "(ציפוי כרום - ללא ידית)" reads as a clean
breadcrumb chip. nameHe stays verbatim (R8) and the raw path is unchanged
for the faceted-filter matching — this only affects the rendered label.

## ייעוד-עברי
מקור: own-doc — ציפוי · כרום · ללא · ידית

## אימות
בדיקת-Golden (`chip_display_label_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/chip_display_label_test.dart`.
