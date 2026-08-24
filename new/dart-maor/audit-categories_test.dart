// בדיקת-חוזה (רתמת-זהב) · AUDIT_CATEGORIES — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/audit-categories.test.mjs —
// צילום-הערך (SNAP): JSON.stringify(AUDIT_CATEGORIES) ===
//   ["כפילות","ת\"ז","טלפון","אימייל","כתובת","לוגיקה","ילדים","קשר"]
// כאן: אותה רשימה בדיוק, אותו סדר, אותם תווים (כולל 'ת"ז' עם גרש-כפול). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/audit-categories_test.dart  ⇒ exit 0
import 'audit-categories.dart';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // צילום-הערך המדויק מהמקור (SNAP מפוענח).
  const want = <String>[
    'כפילות',
    'ת"ז',
    'טלפון',
    'אימייל',
    'כתובת',
    'לוגיקה',
    'ילדים',
    'קשר',
  ];

  // 1) הרשימה כולה זהה ביט-אחר-ביט (סדר+תוכן).
  _eq(auditCategories, want, 'צילום-ערך');
  n++;

  // 2) אורך = 8.
  if (auditCategories.length != 8) {
    throw StateError('FAIL: אורך=${auditCategories.length} (צפוי 8)');
  }
  n++;

  // 3) הפריט השני שומר את הגרש-הכפול המילולי 'ת"ז'.
  if (auditCategories[1] != 'ת"ז') {
    throw StateError('FAIL: [1]="${auditCategories[1]}" (צפוי ת"ז)');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(auditCategories.join('|') == want.join('|'), 'assert-live guard');

  print('OK AUDIT_CATEGORIES: $n asserts passed');
}
