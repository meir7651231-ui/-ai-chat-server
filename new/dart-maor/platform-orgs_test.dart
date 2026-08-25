// בדיקת-חוזה (רתמת-זהב) · platformOrgs — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/platform-orgs.test.mjs
// (5 asserts):
//   1) הערך === 'platformOrgs'
//   2) הוא מחרוזת (typeof string)  ⇒ ב-Dart: הטיפוס String סטטי + לא-ריק
//   3) length === 12
//   4) !includes('/')  (אוסף-שורש חוקי — מקטע-נתיב יחיד)
//   5) platformOrgs + '/demo' === 'platformOrgs/demo'  (הרכבת-מסמך)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/platform-orgs_test.dart  ⇒ exit 0
import 'platform-orgs.dart';

void main() {
  var n = 0;
  final String v = platformOrgs;

  // 1) הערך === 'platformOrgs'.
  assert(v == 'platformOrgs', "FAIL: הערך '$v' ≠ 'platformOrgs'");
  n++;

  // 2) מחרוזת (typeof string) — מובטח סטטית ע"י הטיפוס String; מאמתים גם is String.
  assert((v as dynamic) is String, 'FAIL: לא מחרוזת');
  n++;

  // 3) length === 12.
  assert(v.length == 12, 'FAIL: האורך ${v.length} ≠ 12');
  n++;

  // 4) בלי '/' — מקטע-נתיב יחיד.
  assert(!v.contains('/'), "FAIL: מכיל '/' — לא אוסף-שורש יחיד-מקטע");
  n++;

  // 5) הרכבת-נתיב-מסמך.
  assert(v + '/demo' == 'platformOrgs/demo', 'FAIL: הרכבת-נתיב-מסמך שבורה');
  n++;

  print('OK platformOrgs: $n asserts passed');
}
