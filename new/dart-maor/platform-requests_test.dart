// בדיקת-חוזה (רתמת-זהב) · platformRequests — מייבאת אך ורק את האטום-שלה (חוק-4).
// ששת ה-asserts = בדיוק ששת דוגמאות-החוזה של מקור-ה-JS
// new/atoms/platform-requests.test.mjs (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/platform-requests_test.dart  ⇒ exit 0
import 'platform-requests.dart';

void main() {
  var n = 0;

  // 1) הערך === 'platformRequests'
  if (platformRequests != 'platformRequests') {
    throw StateError('FAIL הערך ${platformRequests} != platformRequests');
  }
  n++;

  // 2) typeof string — ב-Dart: הטיפוס הסטטי הוא String (מובטח ע"י החתימה).
  if (platformRequests is! String) {
    throw StateError('FAIL לא מחרוזת');
  }
  n++;

  // 3) length === 16
  if (platformRequests.length != 16) {
    throw StateError('FAIL האורך ${platformRequests.length} != 16');
  }
  n++;

  // 4) לא מכיל '/' (אוסף-שורש יחיד-מקטע)
  if (platformRequests.contains('/')) {
    throw StateError("FAIL מכיל '/'");
  }
  n++;

  // 5) הרכבת-נתיב-מסמך: 'platformRequests' + '/u1' === 'platformRequests/u1'
  if (platformRequests + '/u1' != 'platformRequests/u1') {
    throw StateError('FAIL הרכבת-נתיב-מסמך שבורה');
  }
  n++;

  // 6) שונה מ-'platformOrgs' (שני אוספי-שורש נפרדים)
  if (platformRequests == 'platformOrgs') {
    throw StateError('FAIL מתנגש עם אוסף-הארגונים');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(platformRequests == 'platformRequests', 'assert-live guard');
  assert(platformRequests.length == 16, 'assert-live guard length');

  print('OK platformRequests: $n asserts passed');
}
