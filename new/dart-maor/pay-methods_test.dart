// בדיקת-חוזה (רתמת-זהב) · payMethods — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pay-methods.test.mjs:
//   P.length === 5 · P[0]==='מזומן' · P[1]==='העברה בנקאית' · P[2]==="צ'ק" ·
//   P[4]==='ביט' · P.includes('אשראי') · new Set(P).size === P.length.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pay-methods_test.dart  ⇒ exit 0
import 'pay-methods.dart';

void main() {
  var n = 0;
  final P = payMethods;

  // ok(P.length === 5)
  if (P.length != 5) throw StateError('FAIL: length ${P.length} != 5');
  n++;

  // ok(P[0] === 'מזומן')
  if (P[0] != 'מזומן') throw StateError("FAIL: [0] != 'מזומן'");
  n++;

  // ok(P[1] === 'העברה בנקאית')
  if (P[1] != 'העברה בנקאית') throw StateError("FAIL: [1] != 'העברה בנקאית'");
  n++;

  // ok(P[2] === "צ'ק")
  if (P[2] != "צ'ק") throw StateError('FAIL: [2] != "צ\'ק"');
  n++;

  // ok(P[4] === 'ביט')
  if (P[4] != 'ביט') throw StateError("FAIL: [4] != 'ביט'");
  n++;

  // ok(P.includes('אשראי'))
  if (!P.contains('אשראי')) throw StateError("FAIL: חסר 'אשראי'");
  n++;

  // ok(new Set(P).size === P.length) — אין כפילות
  if (P.toSet().length != P.length) throw StateError('FAIL: כפילות ברשימה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(P.join(',') == "מזומן,העברה בנקאית,צ'ק,אשראי,ביט", 'assert-live guard');

  print('OK payMethods: $n asserts passed');
}
