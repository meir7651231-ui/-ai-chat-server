// בדיקת-חוזה (רתמת-זהב) · grantableStaffFeatures — מייבאת אך ורק את האטום-שלה (חוק-4).
// המקור-ה-JS new/atoms/grantable-staff-features.test.mjs הוא צילום-ערך
// (JSON.stringify(Set)==='{}' — צילום-חלש, כי Set מסתדר ל-'{}' תמיד). הרתמה כאן
// מעלה אותו לחוזה-הערך האמיתי: הקבוצה = בדיוק 10 המפתחות מהמקור, בסדרם.
// חוק-8 — לא join; בדיקת-חברות איבר-איבר + גבול. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/grantable-staff-features_test.dart ⇒ exit 0
import 'grantable-staff-features.dart';

void main() {
  var n = 0;
  final g = grantableStaffFeatures;

  // הרשימה המדויקת מהמקור (new/atoms/grantable-staff-features.mjs), בסדר-המקור.
  const want = [
    'supporters.bulkselect',
    'supporters.bulkdelete',
    'supporters.purpose',
    'supporters.delete',
    'families.delete',
    'courses.delete',
    'courses.bulkadmin',
    'settings.teachers.delete',
    'shop.delete',
    'tzedaka.delete',
  ];

  // 1) גודל 10.
  assert(g.length == 10, 'FAIL: גודל ${g.length} ≠ 10');
  n++;

  // 2) כל 10 המפתחות חברים — איבר-איבר.
  for (final k in want) {
    assert(g.contains(k), "FAIL: חסר '$k'");
  }
  n++;

  // 3) הסדר זהה-ביט (Set שומר-הכנסה) — האיטרציה = רשימת-המקור בדיוק.
  final ordered = g.toList();
  assert(ordered.length == want.length, 'FAIL: אורך-איטרציה');
  for (var i = 0; i < want.length; i++) {
    assert(ordered[i] == want[i], "FAIL: [$i] '${ordered[i]}' ≠ '${want[i]}'");
  }
  n++;

  // 4) מפתח-חברות חיובי מדגמי.
  assert(g.contains('supporters.delete') == true, "FAIL: 'supporters.delete'");
  n++;

  // 5) מפתח שאינו בקבוצה ⇒ false (למשל 'supporters.bulkedit' לא ניתן-להענקה).
  assert(g.contains('supporters.bulkedit') == false, "FAIL: 'supporters.bulkedit' לא אמור להיות");
  assert(g.contains('home') == false, "FAIL: 'home' לא אמור להיות");
  n++;

  // 6) אין כפילות (Set.length == רשימת-המקור, שכולה ייחודית).
  assert(g.length == want.toSet().length, 'FAIL: כפילות במקור');
  n++;

  print('OK grantableStaffFeatures: $n asserts passed');
}
