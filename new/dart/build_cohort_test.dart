// בדיקת-חוזה golden · buildCohort — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/build_cohort_test.dart
import 'build_cohort.dart';

void main() {
  var n = 0;
  final day = DateTime.utc(2026, 1, 1);
  DateTime plus(int d) => day.add(Duration(days: d));

  // A חוזר ב-offset 0 ו-2; B ב-1 ו-2; C ריק (לעולם לא חוזר).
  final members = <Set<DateTime>>[
    {plus(0), plus(2)},
    {plus(1), plus(2)},
    <DateTime>{},
  ];
  final c = buildCohort(day, members);

  if (c.cohortDay != day) throw StateError('FAIL cohortDay');
  n++;
  if (c.size != 3) throw StateError('FAIL size ${c.size}');
  n++;
  // maxOffset=2 ⇒ מפתחות 0..2 (שלושה)
  if (c.returningByDay.length != 3) {
    throw StateError('FAIL keys ${c.returningByDay}');
  }
  n++;
  if (c.returningByDay[0] != 1) throw StateError('FAIL day0 ${c.returningByDay[0]}');
  n++;
  if (c.returningByDay[1] != 1) throw StateError('FAIL day1 ${c.returningByDay[1]}');
  n++;
  if (c.returningByDay[2] != 2) throw StateError('FAIL day2 ${c.returningByDay[2]}');
  n++;

  // עדשה-עוינת: members ריק ⇒ maxOffset=0, size=0, returningByDay={0:0}
  final empty = buildCohort(day, const []);
  if (empty.size != 0) throw StateError('FAIL empty size');
  n++;
  if (empty.returningByDay.length != 1 || empty.returningByDay[0] != 0) {
    throw StateError('FAIL empty rbd ${empty.returningByDay}');
  }
  n++;

  // עדשה-עוינת: חבר יחיד עם offset גדול ⇒ מפתחות רצופים 0..k, 0 בכולם חוץ מ-k
  final one = buildCohort(day, [{plus(3)}]);
  if (one.returningByDay.length != 4) throw StateError('FAIL one len');
  if (one.returningByDay[0] != 0 || one.returningByDay[3] != 1) {
    throw StateError('FAIL one rbd ${one.returningByDay}');
  }
  n++;

  assert(buildCohort(day, members).size == 3, 'assert-live');
  print('OK buildCohort: $n asserts passed');
}
