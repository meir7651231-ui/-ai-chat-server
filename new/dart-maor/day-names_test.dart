// בדיקת-חוזה (רתמת-זהב) · day-names — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/day-names.test.mjs:
//   1) length === 6
//   2) [0] === 'ראשון'
//   3) [1] === 'שני'
//   4) [4] === 'חמישי'
//   5) [5] === 'שישי'
//   6) המערך המלא === ['ראשון','שני','שלישי','רביעי','חמישי','שישי']
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/day-names_test.dart  ⇒ exit 0
import 'day-names.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;
  final d = dayNames();

  // 1) length
  _ok(d.length == 6, 'length ${d.length} ≠ 6'); n++;

  // 2)-5) אינדקסים נקודתיים
  _ok(d[0] == 'ראשון', '[0] ${d[0]} ≠ ראשון'); n++;
  _ok(d[1] == 'שני', '[1] ${d[1]} ≠ שני'); n++;
  _ok(d[4] == 'חמישי', '[4] ${d[4]} ≠ חמישי'); n++;
  _ok(d[5] == 'שישי', '[5] ${d[5]} ≠ שישי'); n++;

  // 6) המערך המלא — איבר-איבר (לא join; לקח-מוטציה חוצה-שפה)
  _ok(_listEq(d, const ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי']),
      'המערך המלא לא תואם-חוזה'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(dayNames()[2] == 'שלישי', 'assert-live guard');

  print('OK day-names: ${d.length} שמות — $n asserts passed');
}
