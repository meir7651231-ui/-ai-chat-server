// בדיקת-חוזה · startOfWeekSunday — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/start_of_week_sunday_test.dart
import 'start_of_week_sunday.dart';

void _eq(DateTime got, DateTime want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — כל ימי-השבוע מצביעים לאותו ראשון —
  _eq(startOfWeekSunday(DateTime(2026, 8, 23)), DateTime(2026, 8, 23), '1 sunday-self'); n++;
  _eq(startOfWeekSunday(DateTime(2026, 8, 24)), DateTime(2026, 8, 23), '2 monday'); n++;
  _eq(startOfWeekSunday(DateTime(2026, 8, 26)), DateTime(2026, 8, 23), '3 wednesday'); n++;
  _eq(startOfWeekSunday(DateTime(2026, 8, 29)), DateTime(2026, 8, 23), '4 saturday'); n++;
  _eq(startOfWeekSunday(DateTime(2026, 8, 30)), DateTime(2026, 8, 30), '5 next-sunday'); n++;

  // — גלישת-חודש אחורה —
  _eq(startOfWeekSunday(DateTime(2026, 4, 1)), DateTime(2026, 3, 29), '6 month-rollback'); n++;

  // — שנה מעוברת —
  _eq(startOfWeekSunday(DateTime(2024, 2, 29)), DateTime(2024, 2, 25), '7 leap'); n++;

  // — רכיב-שעה נזרק (תוצאה תמיד חצות) —
  _eq(startOfWeekSunday(DateTime(2026, 8, 26, 14, 37, 9)), DateTime(2026, 8, 23), '8 time-dropped'); n++;

  // assert חי (מוכיח שהמנגנון פעיל תחת --enable-asserts)
  assert(startOfWeekSunday(DateTime(2026, 8, 24)) == DateTime(2026, 8, 23), 'assert-live guard');

  print('OK startOfWeekSunday: $n asserts passed');
}
