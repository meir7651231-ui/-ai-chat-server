// בדיקת-חוזה (רתמת-זהב) · sameLoc — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה (6 בדיקות) זהות ביט-אחר-ביט למקור-ה-JS new/atoms/same-loc.test.mjs:
//   1) עותק-זהה ⇒ true
//   2) view שונה ⇒ false
//   3א) selFamilyId שונה ⇒ false ; 3ב) null מול 'f1' ⇒ false
//   4) selCourseId שונה ⇒ false
//   5) שדות-נוספים (scroll:99 מול scroll:0) לא משפיעים ⇒ true
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/same-loc_test.dart  ⇒ exit 0
import 'same-loc.dart';

// מקביל ל-loc(view, selFamilyId, selCourseId, extra) שבבדיקת-ה-JS.
Map<String, dynamic> _loc(String view, String? fam, String? course,
    [Map<String, dynamic> extra = const {}]) {
  return {
    'view': view,
    'selFamilyId': fam,
    'selCourseId': course,
    ...extra,
  };
}

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) עותק-זהה ⇒ true
  _eq(sameLoc(_loc('families', 'f1', null), _loc('families', 'f1', null)),
      true, '1 עותק-זהה ⇒ true');
  n++;

  // 2) view שונה ⇒ false
  _eq(sameLoc(_loc('families', 'f1', null), _loc('courses', 'f1', null)),
      false, '2 view שונה ⇒ false');
  n++;

  // 3א) selFamilyId שונה ⇒ false
  _eq(sameLoc(_loc('families', 'f1', null), _loc('families', 'f2', null)),
      false, '3א selFamilyId שונה ⇒ false');
  n++;

  // 3ב) null מול 'f1' ⇒ false
  _eq(sameLoc(_loc('families', null, null), _loc('families', 'f1', null)),
      false, '3ב null מול f1 ⇒ false');
  n++;

  // 4) selCourseId שונה ⇒ false
  _eq(sameLoc(_loc('courses', null, null), _loc('courses', null, 'c1')),
      false, '4 selCourseId שונה ⇒ false');
  n++;

  // 5) שדות-נוספים לא משפיעים ⇒ true
  _eq(
      sameLoc(_loc('home', null, null, {'scroll': 99}),
          _loc('home', null, null, {'scroll': 0})),
      true,
      '5 שדות-נוספים לא משפיעים ⇒ true');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sameLoc(_loc('home', null, null), _loc('home', null, null)) == true,
      'assert-live guard');

  print('OK sameLoc: $n asserts passed');
}
