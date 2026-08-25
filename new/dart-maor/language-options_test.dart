// בדיקת-חוזה (רתמת-זהב) · languageOptions — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/language-options.test.mjs:
//   1) L.length === 5
//   2) L[0] === 'עברית'
//   3) L[1] === 'יידיש'
//   4) L[4] === 'אנגלית'
//   5) L.includes('רוסית')
//   6) new Set(L).size === L.length  (אין כפילות)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/language-options_test.dart  ⇒ exit 0
import 'language-options.dart';

void main() {
  var n = 0;
  final l = languageOptions;

  // 1) אורך 5.
  assert(l.length == 5, 'FAIL: אורך ${l.length} ≠ 5');
  n++;

  // 2) [0] === 'עברית'.
  assert(l[0] == 'עברית', "FAIL: [0] ≠ 'עברית'");
  n++;

  // 3) [1] === 'יידיש'.
  assert(l[1] == 'יידיש', "FAIL: [1] ≠ 'יידיש'");
  n++;

  // 4) [4] === 'אנגלית'.
  assert(l[4] == 'אנגלית', "FAIL: [4] ≠ 'אנגלית'");
  n++;

  // 5) includes 'רוסית'.
  assert(l.contains('רוסית'), "FAIL: חסר 'רוסית'");
  n++;

  // 6) אין כפילות (Set.size === length).
  assert(l.toSet().length == l.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK languageOptions: $n asserts passed');
}
