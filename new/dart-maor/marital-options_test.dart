// בדיקת-חוזה (רתמת-זהב) · maritalOptions — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/marital-options.test.mjs:
//   1) M.length === 4
//   2) M[0] === 'נשואים'
//   3) M[2] === 'אלמן/ה'
//   4) M[3] === 'פרודים'
//   5) M.includes('גרושים')
//   6) new Set(M).size === M.length  (אין כפילות)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/marital-options_test.dart  ⇒ exit 0
import 'marital-options.dart';

void main() {
  var n = 0;
  final m = maritalOptions;

  // 1) אורך 4.
  assert(m.length == 4, 'FAIL: אורך ${m.length} ≠ 4');
  n++;

  // 2) [0] === 'נשואים'.
  assert(m[0] == 'נשואים', "FAIL: [0] ≠ 'נשואים'");
  n++;

  // 3) [2] === 'אלמן/ה'.
  assert(m[2] == 'אלמן/ה', "FAIL: [2] ≠ 'אלמן/ה'");
  n++;

  // 4) [3] === 'פרודים'.
  assert(m[3] == 'פרודים', "FAIL: [3] ≠ 'פרודים'");
  n++;

  // 5) includes 'גרושים'.
  assert(m.contains('גרושים'), "FAIL: חסר 'גרושים'");
  n++;

  // 6) אין כפילות (Set.size === length).
  assert(m.toSet().length == m.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK maritalOptions: $n asserts passed');
}
