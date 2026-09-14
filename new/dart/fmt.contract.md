# חוזה · fmt

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/_size_norm.dart:166

## התנהגות
Render a `double` the way a chip label should read: integers lose the
decimal point; values like `1.5` stay `1.5`. Crucially this strips
leading zeros from source strings like `020` → `20`.

## ייעוד-עברי
מקור: source-screen · screens___size_norm — מ׳ · מס

## אימות
בדיקת-Golden (`fmt_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/fmt_test.dart`.
