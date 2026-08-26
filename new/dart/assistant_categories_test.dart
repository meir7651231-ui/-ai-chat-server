// בדיקת-חוזה · assistantCategories — golden אפיון; מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/assistant_categories_test.dart
// הפלטים נקבעו מהתנהגות-המקור (dedup ⇒ toList()..sort(), UTF-16 code-units).
import 'assistant_categories.dart';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.toString();
  final w = want.toString();
  if (g != w) {
    throw StateError('FAIL [$label]: got=$g want=$w');
  }
}

void main() {
  var n = 0;

  // 1 — קטלוג מייצג: דדופ + מיון-עברי.
  _eq(
    assistantCategories(categories: const [
      'ברזי מטבח', 'מושבי אסלה', 'כלי ריתוך PPR', 'אמבט', 'ברזי מטבח', 'מושבי אסלה',
    ]),
    const ['אמבט', 'ברזי מטבח', 'כלי ריתוך PPR', 'מושבי אסלה'],
    '1 catalog dedup+sort',
  );
  n++;

  // 2 — קלט-ריק ⇒ פלט-ריק.
  _eq(assistantCategories(categories: const []), const [], '2 empty');
  n++;

  // 3 — יחיד.
  _eq(assistantCategories(categories: const ['ברזים']), const ['ברזים'], '3 single');
  n++;

  // 4 — הפוך ⇒ אלפבית עברי.
  _eq(assistantCategories(categories: const ['ג', 'ב', 'א']),
      const ['א', 'ב', 'ג'], '4 reverse -> hebrew order');
  n++;

  // 5 — כפילות מלאה ⇒ איבר-יחיד.
  _eq(assistantCategories(categories: const ['א', 'א', 'א']),
      const ['א'], '5 all-dup -> one');
  n++;

  // 6 — ASCII קודם-עברית; אות-גדולה קודמת-לקטנה (נאמנות-מקור, בלי נירמול-רישיות).
  _eq(assistantCategories(categories: const ['PPR', 'אמבט', 'Ppr', 'ברז']),
      const ['PPR', 'Ppr', 'אמבט', 'ברז'], '6 ascii-before-hebrew, case-sensitive');
  n++;

  // 7 — מחרוזת-ריקה נשמרת וממוינת ראשונה (אין סינון).
  _eq(assistantCategories(categories: const ['ברז', '', 'אמבט', '']),
      const ['', 'אמבט', 'ברז'], '7 empty-string kept first');
  n++;

  // 8 — Iterable לא-מוחשי (Set קלט) עדיין עובד; רווח מקדים מיון.
  _eq(assistantCategories(categories: {' z', 'a', 'A', 'B'}),
      const [' z', 'A', 'B', 'a'], '8 iterable input, space/case order');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    assistantCategories(categories: const ['ב', 'א']).toString() == '[א, ב]',
    'assert-live guard',
  );

  print('OK assistantCategories: $n asserts passed');
}
