# חוזה · toolDeptPath

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/departments_screen.dart:33

## התנהגות
Build a drill path for a tool department straight from its leaf `categoryHe`
names — a synthetic node tree, so the department gathers categories that live
in different branches (e.g. כלי עבודה + חותך צינורות). One category drills
straight to its products; several show a row each, then drill to products.
`_TreeDrill` only needs `lipskeyCategory` (leaf) / `children` (branch).

## ייעוד-עברי
מקור: own-doc — כלי · עבודה · חותך · צינורות

## אימות
בדיקת-Golden (`tool_dept_path_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/tool_dept_path_test.dart`.
