// רתמת-זהב · isoLocal — Dart≡JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה **בדיוק** כמו new/atoms/iso-local.test.mjs (אותם קלטים→פלטים).
// הזחת-הקלט getMonth 0↔1: JS `new Date(YYYY, monthIndex, ...)` הוא 0-מבוסס
//   (7=אוגוסט); Dart `DateTime(YYYY, month, ...)` הוא 1-מבוסס ⇒ monthIndex+1.
// הרצה: dart run --enable-asserts new/dart-maor/iso-local_test.dart
import 'iso-local.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // C = [
  //   [new Date(2026, 7, 24),        '2026-08-24'],
  //   [new Date(2026, 0, 5),         '2026-01-05'],  // ריפוד חודש+יום
  //   [new Date(1999, 11, 31),       '1999-12-31'],
  //   [new Date(2026, 2, 1, 23, 59), '2026-03-01'],  // השעה נבלעת
  //   [new Date(2030, 8, 9),         '2030-09-09'],
  // ]
  _eq(isoLocal(DateTime(2026, 8, 24)), '2026-08-24', 'basic');          n++;
  _eq(isoLocal(DateTime(2026, 1, 5)), '2026-01-05', 'pad-month-day');   n++;
  _eq(isoLocal(DateTime(1999, 12, 31)), '1999-12-31', 'year-end');      n++;
  _eq(isoLocal(DateTime(2026, 3, 1, 23, 59)), '2026-03-01', 'hour-eaten'); n++;
  _eq(isoLocal(DateTime(2030, 9, 9)), '2030-09-09', 'single-digits');   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isoLocal(DateTime(2026, 8, 24)) == '2026-08-24', 'assert-live guard');

  print('OK isoLocal: $n asserts passed');
}
