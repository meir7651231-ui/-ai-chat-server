# חוזה · canonicalizeWord

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/features/word_finder/word_extraction.dart:52

## התנהגות
Collapses a [token] onto its canonical form via [synonyms]; pass-through
when no mapping exists. With the EMPTY default `kWordSynonyms` this is the
identity — see the OWNER-REVIEW note there.

## ייעוד-עברי
מקור: source-screen · features__word_finder__word_extraction — אוסלו · איביזה · אל · חזור · אלפא · אקווה · ארון · ארונות · מחלק · ברז · ברזי · אמבטיה

## אימות
בדיקת-Golden (`canonicalize_word_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/canonicalize_word_test.dart`.
