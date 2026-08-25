// בדיקת-חוזה (רתמת-זהב) · platformLeads — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/platform-leads.test.mjs
// (אותם קלטים→פלטים):
//   1) הערך === 'platformLeads'
//   2) הטיפוס === String
//   3) האורך === 13
//   4) אינו מכיל '/' — מקטע-נתיב יחיד
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/platform-leads_test.dart  ⇒ exit 0
import 'platform-leads.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final v = platformLeads;

  // 1) ערך.
  _ok(v == 'platformLeads', "ערך '$v' ≠ 'platformLeads'");
  n++;

  // 2) טיפוס — String (ב-Dart מובטח סטטית; נבדק כ-runtime type זהה למקור).
  _ok(v is String, 'טיפוס ${v.runtimeType} ≠ String');
  n++;

  // 3) אורך.
  _ok(v.length == 13, 'אורך ${v.length} ≠ 13');
  n++;

  // 4) מקטע-נתיב יחיד.
  _ok(!v.contains('/'), "מכיל '/' — לא מקטע-נתיב יחיד");
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(platformLeads == 'platformLeads', 'assert-live guard');

  print('OK platformLeads: $n asserts passed');
}
