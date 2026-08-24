// בדיקת-חוזה (רתמת-זהב) · boxTotal — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/box-total.test.mjs:
//   1) [{100},{50}]                        ⇒ 150
//   2) []                                  ⇒ 0
//   3) [{100},{NaN},{'50'},{Infinity}]     ⇒ 100  (מחרוזת/NaN/Infinity אינם מספר-סופי)
//   4) [{-30},{100}]                       ⇒ 70   (שלילי סופי — נספר)
//   5) [{0.5},{0.25}]                      ⇒ 0.75
// המרה: NaN⇒double.nan · Infinity⇒double.infinity · '50'⇒String. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/box-total_test.dart  ⇒ exit 0
import 'box-total.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  _ok(boxTotal({'collections': [{'amount': 100}, {'amount': 50}]}) == 150,
      '[100,50] ≠ 150'); n++;

  _ok(boxTotal({'collections': []}) == 0, '[] ≠ 0'); n++;

  // מחרוזת '50' אינה מספר-סופי (JS Number.isFinite לא מכפה) — נבלעת כ-0 ⇒ 100.
  _ok(boxTotal({'collections': [
        {'amount': 100},
        {'amount': double.nan},
        {'amount': '50'},
        {'amount': double.infinity},
      ]}) == 100, '[100,NaN,"50",Inf] ≠ 100'); n++;

  _ok(boxTotal({'collections': [{'amount': -30}, {'amount': 100}]}) == 70,
      '[-30,100] ≠ 70'); n++;

  _ok(boxTotal({'collections': [{'amount': 0.5}, {'amount': 0.25}]}) == 0.75,
      '[0.5,0.25] ≠ 0.75'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(boxTotal({'collections': [{'amount': 100}, {'amount': 50}]}) == 150,
      'assert-live guard');

  print('OK boxTotal: $n asserts passed');
}
