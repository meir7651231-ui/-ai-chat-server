# חוזה · parseCsvRecords

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/csv_kernel.dart:69

## התנהגות
The RFC-4180-ish tokenizer (zero deps, never throws): '"'-quoted cells with
'""' escapes may contain [sep] and newlines; CRLF and LF both end a record;
a '"' NOT at cell start is a literal (so an unquoted hand-typed מק"ט
survives); an unterminated quote just flushes what accumulated. Empty
physical lines produce NO record but still advance the line count.

## ייעוד-עברי
מקור: own-doc — מק"ט

## אימות
בדיקת-Golden (`parse_csv_records_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/parse_csv_records_test.dart`.
