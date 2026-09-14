# חוזה · slug

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/trade_builder/attribute_schema_editor.dart:50

## התנהגות
The s44 deterministic slug: trimmed, lowercased, whitespace runs → '-'.
NO DateTime/random — the same text always yields the same slug.

## ייעוד-עברי
מקור: source-screen · screens__trade_builder__attribute_schema_editor — אין · עדיין · מאפיינים · בדיקת · פירוק · שם · בחירה · הוסף · מאפיין · ערך · הסר · חומר

## אימות
בדיקת-Golden (`slug_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/slug_test.dart`.
