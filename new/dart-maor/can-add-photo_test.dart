// בדיקת-חוזה (רתמת-זהב) · canAddPhoto — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/can-add-photo.test.mjs:
//   1) undefined                 ⇒ true   (null ב-Dart)
//   2) []                        ⇒ true
//   3) ['a','b','c','d']  (4)     ⇒ true
//   4) ['a','b','c','d','e'] (5)  ⇒ false
//   5) (['a','b'], 2)            ⇒ false  (photoMax=2 כובד)
//   6) null                      ⇒ true
// המרה: undefined/null של JS ⇒ null ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/can-add-photo_test.dart  ⇒ exit 0
import 'can-add-photo.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) undefined ⇒ true (במקור undefined; ב-Dart null).
  _ok(canAddPhoto(null) == true, 'undefined ≠ true'); n++;

  // 2) [] ⇒ true.
  _ok(canAddPhoto(<Object?>[]) == true, '[] ≠ true'); n++;

  // 3) אורך-4 ⇒ true.
  _ok(canAddPhoto(['a', 'b', 'c', 'd']) == true, 'אורך-4 ≠ true'); n++;

  // 4) אורך-5 ⇒ false (התקרה נגמרה).
  _ok(canAddPhoto(['a', 'b', 'c', 'd', 'e']) == false, 'אורך-5 ≠ false'); n++;

  // 5) photoMax=2 נכבד — אורך-2 ⇒ false.
  _ok(canAddPhoto(['a', 'b'], 2) == false, 'photoMax=2 לא כובד'); n++;

  // 6) null ⇒ true.
  _ok(canAddPhoto(null) == true, 'null ≠ true'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(canAddPhoto(['a', 'b', 'c', 'd', 'e']) == false, 'assert-live guard');

  print('OK canAddPhoto: $n asserts passed');
}
