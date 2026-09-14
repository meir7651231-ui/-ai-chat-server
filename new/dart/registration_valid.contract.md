# חוזה · registrationValid

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/user_profile.dart:84

## התנהגות
Registration is valid when both name and contact are non-empty — mirrors the
prototype's `checkRegistration` (the ✓ appears once the fields are filled).
Pure → unit-testable.

## ייעוד-עברי
מקור: caller-screen · screens__welcome_screen — ואת · של · כולל · אימות · דו · שלבי · אם · מוגדר · לא · נשמרת · סיסמה · במכשיר

## אימות
בדיקת-Golden (`registration_valid_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/registration_valid_test.dart`.
