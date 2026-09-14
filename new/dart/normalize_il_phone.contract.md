# חוזה · normalizeIlPhone

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/login_sheet.dart:73

## התנהגות
Normalise an Israeli phone number to the E.164 shape `verifyPhoneNumber`
expects: `050-123 4567` → `+972501234567`. A number already carrying `+`
keeps its country code (any country). Returns null when the input cannot
be a dialable number (the sheet toasts 'מספר הטלפון אינו תקין').
Pure → unit-testable.

## ייעוד-עברי
מקור: own-doc — מספר · הטלפון · אינו · תקין'

## אימות
בדיקת-Golden (`normalize_il_phone_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/normalize_il_phone_test.dart`.
