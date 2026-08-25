// בדיקת-חוזה (רתמת-זהב) · requeueOutcomes — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/requeue-outcomes.test.mjs:
//   1) R.length === 2
//   2) R[0] === 'noanswer'
//   3) R[1] === 'skip'
//   4) R.includes('noanswer')  → true
//   5) R.includes('skip')      → true
//   6) !R.includes('donated')  → 'donated' תוצאה סופית, לא ברשימת-החזרה
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/requeue-outcomes_test.dart  ⇒ exit 0
import 'requeue-outcomes.dart';

void main() {
  var n = 0;
  final r = requeueOutcomes;

  // 1) אורך 2.
  assert(r.length == 2, 'FAIL: אורך ${r.length} ≠ 2');
  n++;

  // 2) [0] === 'noanswer'.
  assert(r[0] == 'noanswer', "FAIL: [0] ${r[0]} ≠ 'noanswer'");
  n++;

  // 3) [1] === 'skip'.
  assert(r[1] == 'skip', "FAIL: [1] ${r[1]} ≠ 'skip'");
  n++;

  // 4) includes 'noanswer'.
  assert(r.contains('noanswer'), "FAIL: לא מכיל 'noanswer'");
  n++;

  // 5) includes 'skip'.
  assert(r.contains('skip'), "FAIL: לא מכיל 'skip'");
  n++;

  // 6) !includes 'donated' — תוצאה סופית ברשימת-החזרה.
  assert(!r.contains('donated'), "FAIL: מכיל 'donated' — תוצאה סופית ברשימת-החזרה");
  n++;

  print('OK requeueOutcomes: $n asserts passed');
}
