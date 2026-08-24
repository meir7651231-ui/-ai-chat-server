// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · segmentKeyOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/intel/segments.dart:43-175 (133 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): segmentsByActor, isAfter, detectCheckoutAbandon, detectRepeatedNoResult, detectDeadEndLoop, returning
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String segmentKeyOf(IntelEvent e) {
  final uid = e.uid;
  if (uid != null && uid.isNotEmpty) return uid;
  final actorKey = e.actorKey;
  if (actorKey != null && actorKey.isNotEmpty) return actorKey;
  return kAnonymousSegmentKey;
}

/// A per-actor roll-up, keyed by the STABLE [key] ([segmentKeyOf]) — never a
/// display label. Every field is a deterministic fold over the actor's own
/// events.
class ActorSegment {
  /// Builds a roll-up row. All fields are derived by [segmentsByActor].
  const ActorSegment({
    required this.key,
    required this.sessions,
    required this.lastSeen,
    required this.screensTouched,
    required this.stuckCount,
    required this.converted,
  });

  /// The stable merge key: uid, else actorKey, else [kAnonymousSegmentKey].
  final String key;

  /// Count of DISTINCT non-empty `sessionId`s this actor was seen across.
  final int sessions;

  /// The most recent event instant for this actor (max `at`). An instant, so it
  /// is timezone-agnostic — bucketing into local days happens in
  /// [retentionCohorts], never here.
  final DateTime lastSeen;

  /// Count of DISTINCT non-empty `screen`s this actor touched.
  final int screensTouched;

  /// Total number of stuck SIGNALS the step-95 detectors raise across THIS
  /// actor's own sessions — the summed count of abandoned-checkout +
  /// repeated-no-result + dead-end-loop flags. A session flagged by two
  /// detectors contributes two (a severity tally, not a distinct-session count).
  final int stuckCount;

  /// Whether this actor has at least one `order_placed` event.
  final bool converted;

  /// True iff this is the shared anonymous bucket ([kAnonymousSegmentKey]).
  bool get isAnonymous => key == kAnonymousSegmentKey;
}

/// Per-actor roll-up of [events], keyed by [segmentKeyOf] (uid ?? actorKey ??
/// anonymous) — NEVER the display label (R2-#12). Returns one [ActorSegment] per
/// distinct key, so two different people who share a label stay SEPARATE (the
/// exact double-count the label-keyed `mgrCustomerList` suffers is impossible
/// here).
///
/// [now] is INJECTED for the abandoned-checkout detector (this function never
/// reads the wall clock). When omitted it defaults to the LATEST event instant in
/// [events] — deterministic, "as of the freshest activity in the batch". The
/// three step-95 detectors are reused verbatim, scoped to each actor's own events
/// so a stuck session is attributed to exactly the actor that owns it.
Map<String, ActorSegment> segmentsByActor(
  List<IntelEvent> events, {
  DateTime? now,
}) {
  if (events.isEmpty) return <String, ActorSegment>{};

  // First pass — bucket every event under its stable actor key (never a label).
  final byActor = <String, List<IntelEvent>>{};
  for (final e in events) {
    (byActor[segmentKeyOf(e)] ??= <IntelEvent>[]).add(e);
  }

  // now injected; fall back to the latest event instant (deterministic).
  final resolvedNow =
      now ?? events.map((e) => e.at).reduce((a, b) => a.isAfter(b) ? a : b);

  final out = <String, ActorSegment>{};
  byActor.forEach((key, evs) {
    final sessions = <String>{};
    final screens = <String>{};
    var lastSeen = evs.first.at;
    var converted = false;
    for (final e in evs) {
      final s = e.sessionId;
      if (s != null && s.isNotEmpty) sessions.add(s);
      final sc = e.screen;
      if (sc != null && sc.isNotEmpty) screens.add(sc);
      if (e.at.isAfter(lastSeen)) lastSeen = e.at;
      if (e.name == IntelEvents.orderPlaced) converted = true;
    }
    // Reuse the step-95 detectors on THIS actor's events — the stuck tally.
    final stuckCount = detectCheckoutAbandon(evs, now: resolvedNow).length +
        detectRepeatedNoResult(evs).length +
        detectDeadEndLoop(evs).length;
    out[key] = ActorSegment(
      key: key,
      sessions: sessions.length,
      lastSeen: lastSeen,
      screensTouched: screens.length,
      stuckCount: stuckCount,
      converted: converted,
    );
  });
  return out;
}

/// One first-seen cohort — the actors first observed on [cohortDay], plus how
/// many of them returned on each day-offset.
class RetentionCohort {
  /// Builds a cohort row. Populated by [retentionCohorts].
  const RetentionCohort({
    required this.cohortDay,
    required this.size,
    required this.returningByDay,
  });

  /// The cohort's first-seen calendar day, as a UTC-midnight marker of the
  /// bucketed local date (see [retentionCohorts] for the timezone assumption).
  final DateTime cohortDay;

  /// Number of DISTINCT actors first seen on [cohortDay].
  final int size;

  /// Day-offset (0-based, contiguous 0..maxObserved) → number of the cohort's
  /// actors active on `cohortDay + offset` days. `returningByDay[0] == size` by
  /// construction (every member is active on its own first day).
  final Map<int, int> returningByDay;

  /// Count of actors active on `cohortDay + [dayOffset]` days (0 if unobserved).
  int returning(int dayOffset) => returningByDay[dayOffset] ?? 0;

  /// Percent of the cohort ([returning] / [size] × 100) active on day
  /// [dayOffset]. Day 0 is always 100 (or 0 for an empty cohort).
