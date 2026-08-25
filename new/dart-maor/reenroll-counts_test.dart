// בדיקת-חוזה (רתמת-זהב) · reenrollCounts — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/reenroll-counts.test.mjs:
//   כל קלט הוא מחרוזת; ה-for..of של JS מונה תווים ⇒ כל תו נספר כ-undecided.
//   total = מספר-התווים; yes/no/hold/renewed = 0; undecided = total.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/reenroll-counts_test.dart  ⇒ exit 0
import 'reenroll-counts.dart';

void main() {
  var n = 0;

  // [קלט-מחרוזת, total-צפוי] — כל השאר: yes/no/hold/renewed=0, undecided=total.
  final cases = <List<dynamic>>[
    ['', 0],
    ['אבג', 3],
    ['כהן לוי', 7],
    ['abc', 3],
    ['a@b.com', 7],
    ['2026-08-24', 10],
    ['2026-08-24T12:00:00', 19],
    ['0501234567', 10],
    ['03-1234567', 10],
    ['https://x.co', 12],
    ['שלום עולם', 9],
    ['12', 2],
  ];

  for (final tc in cases) {
    final input = tc[0] as String;
    final total = tc[1] as int;
    final got = reenrollCounts(input);
    final want = {
      'total': total,
      'yes': 0,
      'no': 0,
      'hold': 0,
      'undecided': total,
      'renewed': 0,
    };
    assert(
      _mapEq(got, want),
      "FAIL: reenrollCounts('$input') ⇒ $got ≠ $want",
    );
    n++;
  }

  print('OK reenrollCounts: $n asserts passed');
}

/// השוואת-מפות איבר-איבר (DART-PORTING #8: לא join/toString — מפתח+ערך).
bool _mapEq(Map<String, int> a, Map<String, int> b) {
  if (a.length != b.length) return false;
  for (final k in b.keys) {
    if (!a.containsKey(k) || a[k] != b[k]) return false;
  }
  return true;
}
