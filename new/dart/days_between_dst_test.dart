// בדיקת-חוזה · daysBetweenDst — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/days_between_dst_test.dart
import 'days_between_dst.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(daysBetweenDst(DateTime.utc(2026, 8, 26), DateTime.utc(2026, 8, 29)), 3,
      '1 forward');
  n++;
  _eq(
      daysBetweenDst(
          DateTime.utc(2026, 8, 26, 23), DateTime.utc(2026, 8, 27, 1)),
      1,
      '2 time-dropped');
  n++;
  _eq(daysBetweenDst(DateTime.utc(2026, 8, 29), DateTime.utc(2026, 8, 26)), -3,
      '3 backward');
  n++;
  _eq(daysBetweenDst(DateTime.utc(2026, 3, 1), DateTime.utc(2026, 3, 31)), 30,
      '4 dst-span');
  n++;
  _eq(daysBetweenDst(DateTime.utc(2026, 8, 26), DateTime.utc(2026, 8, 26)), 0,
      '5 same-day');
  n++;

  // קלט מקומי (לא-UTC) — התאריך נלקח כפי-שהוא, השעה נזרקת
  _eq(daysBetweenDst(DateTime(2026, 8, 26, 23, 59), DateTime(2026, 8, 27, 0, 1)),
      1, '6 local-time-dropped');
  n++;

  assert(daysBetweenDst(DateTime.utc(2026, 8, 26), DateTime.utc(2026, 8, 29)) ==
      3, 'assert-live guard');

  print('OK daysBetweenDst: $n asserts passed');
}
