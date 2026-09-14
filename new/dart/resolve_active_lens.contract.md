# חוזה · resolveActiveLens

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/catalog_lens_state.dart:19

## התנהגות
Resolve the lens to actually USE for [available] lenses: the selected one if
it's still available for the current set, else the first available
(category is always available, so this never returns something unusable).

## ייעוד-עברי
מקור: caller-screen · screens__lens_selector_row — סדר · לפי

## אימות
בדיקת-Golden (`resolve_active_lens_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/resolve_active_lens_test.dart`.
