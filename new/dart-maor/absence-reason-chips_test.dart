// בדיקת-חוזה (רתמת-זהב) · absenceReasonChips — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/absence-reason-chips.test.mjs:
//   1) C.length === 5
//   2) C[0] === 'מחלה'
//   3) C[1] === 'אירוע משפחתי'
//   4) C[4] === 'מזג אוויר'
//   5) C.includes('נסיעה')
//   6) new Set(C).size === C.length  (אין כפילות)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/absence-reason-chips_test.dart  ⇒ exit 0
import 'absence-reason-chips.dart';

void main() {
  var n = 0;
  final c = absenceReasonChips;

  // 1) אורך 5.
  assert(c.length == 5, 'FAIL: אורך ${c.length} ≠ 5');
  n++;

  // 2) [0] === 'מחלה'.
  assert(c[0] == 'מחלה', "FAIL: [0] ≠ 'מחלה'");
  n++;

  // 3) [1] === 'אירוע משפחתי'.
  assert(c[1] == 'אירוע משפחתי', "FAIL: [1] ≠ 'אירוע משפחתי'");
  n++;

  // 4) [4] === 'מזג אוויר'.
  assert(c[4] == 'מזג אוויר', "FAIL: [4] ≠ 'מזג אוויר'");
  n++;

  // 5) includes 'נסיעה'.
  assert(c.contains('נסיעה'), "FAIL: חסר 'נסיעה'");
  n++;

  // 6) אין כפילות (Set.size === length).
  assert(c.toSet().length == c.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK absenceReasonChips: $n asserts passed');
}
