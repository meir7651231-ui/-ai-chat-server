# חוזה · fuzzyTolerance

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/logic/fuzzy_match.dart:54

## התנהגות
סף-הסובלנות של Maor: `floor(len/3) + 1` — מרחק-העריכה המרבי שעדיין נחשב
התאמה, פר-אורך-המחרוזת-המנורמלת של השאילתה.

## ייעוד-עברי
מקור: own-doc — סף-הסובלנות · של · מרחק-העריכה · המרבי · שעדיין · נחשב · התאמה · פר-אורך-המחרוזת-המנורמלת · של · השאילתה

## אימות
בדיקת-Golden (`fuzzy_tolerance_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/fuzzy_tolerance_test.dart`.
