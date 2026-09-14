# חוזה · screenKeyForTab

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/intel/screen_view.dart:49

## התנהגות
The four bottom-nav tabs → their stable screen keys, in the shell's tab order
(בית · מחלקות · עדכונים · חנות — `home_shell.dart` `_BottomNav`). The ONE place
a tab key is spelled (§6). Out-of-range indices fall back to a safe `tab_N`.

## ייעוד-עברי
מקור: own-doc — בית · מחלקות · עדכונים · חנות

## אימות
בדיקת-Golden (`screen_key_for_tab_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/screen_key_for_tab_test.dart`.
