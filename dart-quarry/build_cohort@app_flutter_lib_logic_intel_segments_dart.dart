// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _buildCohort — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/intel/segments.dart:222-248 (27 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): difference, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
RetentionCohort _buildCohort(DateTime day, List<Set<DateTime>> members) {
  var maxOffset = 0;
  for (final days in members) {
    for (final d in days) {
      final offset = d.difference(day).inDays;
      if (offset > maxOffset) maxOffset = offset;
    }
  }
  final returningByDay = <int, int>{};
  for (var n = 0; n <= maxOffset; n++) {
    final target = day.add(Duration(days: n));
    var count = 0;
    for (final days in members) {
      if (days.contains(target)) count++;
    }
    returningByDay[n] = count;
  }
  return RetentionCohort(
    cohortDay: day,
    size: members.length,
    returningByDay: returningByDay,
  );
}

/// The calendar day of [at] at UTC offset [offset], as a canonical UTC-midnight
/// marker. Because the marker is UTC (no DST), day-offset arithmetic via
/// `.add(Duration(days: n))` and `.difference(...).inDays` is exact.
