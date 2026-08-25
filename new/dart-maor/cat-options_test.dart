// בדיקת-חוזה (רתמת-זהב) · CAT_OPTIONS — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/cat-options.test.mjs
// (אותם קלטים→פלטים):
//   1) length                 ⇒ 9
//   2) [0]                     ⇒ 'מלאכה'
//   3) [3]                     ⇒ 'ספורט'
//   4) [8]                     ⇒ 'קהילה'
//   5) contains('קולינרי')     ⇒ true
//   6) Set(C).size == length   ⇒ אין כפילות
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/cat-options_test.dart  ⇒ exit 0
import 'cat-options.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) אורך 9.
  _ok(CAT_OPTIONS.length == 9, 'אורך ${CAT_OPTIONS.length} ≠ 9');
  n++;

  // 2) [0] = 'מלאכה'.
  _ok(CAT_OPTIONS[0] == 'מלאכה', "[0] ≠ 'מלאכה'");
  n++;

  // 3) [3] = 'ספורט'.
  _ok(CAT_OPTIONS[3] == 'ספורט', "[3] ≠ 'ספורט'");
  n++;

  // 4) [8] = 'קהילה'.
  _ok(CAT_OPTIONS[8] == 'קהילה', "[8] ≠ 'קהילה'");
  n++;

  // 5) מכיל 'קולינרי'.
  _ok(CAT_OPTIONS.contains('קולינרי'), "חסר 'קולינרי'");
  n++;

  // 6) אין כפילות — Set בגודל הרשימה.
  _ok(CAT_OPTIONS.toSet().length == CAT_OPTIONS.length, 'כפילות ברשימה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(CAT_OPTIONS.join('|') ==
      'מלאכה|אמנות|העשרה|ספורט|מוזיקה|רווחה|טיפוח|קולינרי|קהילה',
      'assert-live guard');

  print('OK CAT_OPTIONS: $n asserts passed');
}
