# חוזה · matesBoost

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/features/global_search/prediction_ranking.dart:44

## התנהגות
PURE. The prediction boost for a candidate that physically CONNECTS to what
the user is ALREADY building — the signal ORTHOGONAL to the typed letters that
breaks the "re-ranking is zero-sum" wall (swarm finding #1). Once a ½" nipple
is in the cart, typing "ברז" should surface the faucets that actually FIT, not
a random 4 of ~100. [compatibleSkus] is [contextCompatibleSkus] of the
cart/line; membership is the strongest tie-break there is (verified geometry,
not a guess). Zero when the context is empty ⇒ byte-safe.

## ייעוד-עברי
מקור: own-doc — ברז"

## אימות
בדיקת-Golden (`mates_boost_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/mates_boost_test.dart`.
