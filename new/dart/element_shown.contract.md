# חוזה · elementShown

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/config/org_config.dart:220

## התנהגות
Is the Studio element [id] SHOWN under [c]? The setup-wizard's per-element
show/hide axis — it recycles the element_registry as the toggle source.
Stored in [features] under an `element.<id>` key so it rides the EXISTING
codec + wizard/pack carry-through with ZERO schema change; ABSENT = visible
(byte-identical), only an explicit `false` hides. The kImmutable core-lock
(nav / mandatory screens can never be hidden) is enforced one layer up in
the gate [elementVisible], which has the Riverpod registry the pure model
here must not import.

## ייעוד-עברי
מקור: caller-screen · screens__org_setup_wizard_screen — מתוך · רכיבים · פעילים · סקציות · אבחון · סנכרון · למה · לא · מגיע · לאחרים · אדום · אזהרה

## אימות
בדיקת-Golden (`element_shown_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/element_shown_test.dart`.
