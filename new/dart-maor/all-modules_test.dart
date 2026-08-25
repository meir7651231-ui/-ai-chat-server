// בדיקת-חוזה (רתמת-זהב) · allModules — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/all-modules.test.mjs:
//   1) M.length === 9
//   2) M[0] === 'families'
//   3) M[8] === 'shop7'
//   4) M.includes('tzedaka') === true
//   5) M.includes('home') === false
//   6) M === ['families','courses','calendar','diary','supporters','reports','tzedaka','shop','shop7']
//   7) new Set(M).size === M.length  (אין כפילות)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/all-modules_test.dart  ⇒ exit 0
import 'all-modules.dart';

void main() {
  var n = 0;
  final m = allModules;

  // 1) אורך 9.
  assert(m.length == 9, 'FAIL: אורך ${m.length} ≠ 9');
  n++;

  // 2) [0] === 'families'.
  assert(m[0] == 'families', "FAIL: [0] ≠ 'families'");
  n++;

  // 3) [8] === 'shop7'.
  assert(m[8] == 'shop7', "FAIL: [8] ≠ 'shop7'");
  n++;

  // 4) includes 'tzedaka' → true.
  assert(m.contains('tzedaka') == true, "FAIL: חסר 'tzedaka'");
  n++;

  // 5) includes 'home' → false.
  assert(m.contains('home') == false, "FAIL: 'home' לא אמור להיות ברשימה");
  n++;

  // 6) המערך המלא — איבר-איבר (חוק-8: לא join, גבול-איבר).
  const want = [
    'families',
    'courses',
    'calendar',
    'diary',
    'supporters',
    'reports',
    'tzedaka',
    'shop',
    'shop7',
  ];
  assert(m.length == want.length, 'FAIL: אורך המערך המלא');
  for (var i = 0; i < want.length; i++) {
    assert(m[i] == want[i], "FAIL: [$i] '${m[i]}' ≠ '${want[i]}'");
  }
  n++;

  // 7) אין כפילות (Set.size === length).
  assert(m.toSet().length == m.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK allModules: $n asserts passed');
}
