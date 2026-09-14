# חוזה · companyCategorySections

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/data/company_categories.dart:18

## התנהגות
The distinct categories of a company catalog as browse-row [Section]s —
FIRST-APPEARANCE order (the company's own file order is its taxonomy;
never re-sorted), emoji from the first product of the category (template
default '📦' when the cell was left empty).

## ייעוד-עברי
מקור: caller-screen · screens__catalog_screen — מוצרים · בעץ · גרסאות · מים · חמים · בלבד · מתכת · ליפסקי · ברקן · משפחות · וריאנטים · שונה

## אימות
בדיקת-Golden (`company_category_sections_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/company_category_sections_test.dart`.
