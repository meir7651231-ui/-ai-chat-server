// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · retentionPct — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/intel/segments.dart:176-221 (46 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): returning, retentionCohorts, segmentKeyOf, isBefore, compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  double retentionPct(int dayOffset) =>
      size == 0 ? 0 : returning(dayOffset) / size * _kPercentScale;
}

/// Retention COHORTS — actors bucketed by their FIRST-seen day, then the percent
/// of each cohort returning on day N. A pure date-bucket fold mirroring the
/// buyer-fold idiom of `manager_dashboard.dart:272-296`, but keyed by the stable
/// actor identity ([segmentKeyOf]) rather than a display label.
///
/// ── TIMEZONE ASSUMPTION (documented · consistent for the WHOLE fold, §4) ──
/// Every timestamp is bucketed into a calendar day at ONE, single UTC offset
/// [localOffset], applied identically to EVERY event — so no cohort ever splits
/// on timezone and the anonymous bucket is bucketed the same way as everyone
/// else. The default is [Duration.zero] (UTC), which keeps the fold PURE and
/// machine-independent (a test on the same event list yields the same %
/// everywhere). The owner passes their real local UTC offset here for
/// local-calendar-day cohorts — the local-time assumption is thus INJECTED, not
/// read from the device clock.
List<RetentionCohort> retentionCohorts(
  List<IntelEvent> events, {
  Duration localOffset = Duration.zero,
}) {
  // Per actor: the set of calendar days (at [localOffset]) it was active on.
  final daysByActor = <String, Set<DateTime>>{};
  for (final e in events) {
    (daysByActor[segmentKeyOf(e)] ??= <DateTime>{})
        .add(_dayBucket(e.at, localOffset));
  }

  // Cohort each actor under its FIRST-seen day (keyed by the stable actor
  // identity above — never a display label).
  final membersByCohort = <DateTime, List<Set<DateTime>>>{};
  daysByActor.forEach((_, days) {
    final first = days.reduce((a, b) => a.isBefore(b) ? a : b);
    (membersByCohort[first] ??= <Set<DateTime>>[]).add(days);
  });

  final cohorts = <RetentionCohort>[
    for (final entry in membersByCohort.entries)
      _buildCohort(entry.key, entry.value),
  ]..sort((a, b) => a.cohortDay.compareTo(b.cohortDay));
  return cohorts;
}

/// Fold one cohort: for each contiguous day-offset 0..maxObserved, count the
/// members active on `day + offset`. [members] is each member's active-day set.
