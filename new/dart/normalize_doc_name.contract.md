# חוזה · normalizeDocName

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/required_docs_policy.dart:38

## התנהגות
Normalize a document/cert name for MATCHING (the gate compares a required
name against a present cert's name through this): trim, collapse internal
runs of whitespace to a single space, and lower-case. This is the E2 lesson
— match by NORMALIZED-EXACT equality, NEVER substring/contains — so e.g.
'בטיחות' and 'בטיחות בגובה' stay DISTINCT (one is not "contained" in the
other). The stored policy value keeps the contractor's display form; only
the comparison runs through here.

## ייעוד-עברי
מקור: own-doc — בטיחות' · בטיחות · בגובה'

## אימות
בדיקת-Golden (`normalize_doc_name_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/normalize_doc_name_test.dart`.
