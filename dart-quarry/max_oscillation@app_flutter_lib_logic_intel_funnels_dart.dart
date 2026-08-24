// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _maxOscillation — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/intel/funnels.dart:269-321 (53 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): analyzeIntel, computeFunnel, detectCheckoutAbandon, detectRepeatedNoResult, detectDeadEndLoop
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _maxOscillation(List<String> path) {
  var best = 0;
  var run = 0;
  for (var i = 2; i < path.length; i++) {
    if (path[i] == path[i - 2] && path[i] != path[i - 1]) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

/// A read-time snapshot of the funnel + the three stuck detectors, for the
/// manager dashboard (step 98). Every field is DERIVED from the events with the
/// INJECTED `now`; nothing here is emitted by the client.
class IntelInsights {
  const IntelInsights({
    required this.funnel,
    required this.abandonedCheckouts,
    required this.repeatedNoResult,
    required this.deadEndLoops,
  });

  /// The conversion funnel with its biggest drop-off.
  final FunnelReport funnel;

  /// Session ids with an abandoned checkout (see [detectCheckoutAbandon]).
  final List<String> abandonedCheckouts;

  /// Session ids stuck searching (see [detectRepeatedNoResult]).
  final List<String> repeatedNoResult;

  /// Session ids caught in a navigation dead-end (see [detectDeadEndLoop]).
  final List<String> deadEndLoops;
}

/// Compute the full [IntelInsights] snapshot from [events] with the INJECTED
/// [now]. Pure + deterministic + time-INJECTED — the single entry point step 98
/// reads. Never reads the wall clock.
IntelInsights analyzeIntel(
  List<IntelEvent> events, {
  required DateTime now,
}) {
  return IntelInsights(
    funnel: computeFunnel(events),
    abandonedCheckouts: detectCheckoutAbandon(events, now: now),
    repeatedNoResult: detectRepeatedNoResult(events),
    deadEndLoops: detectDeadEndLoop(events),
  );
}

