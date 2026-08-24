// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _batchRejectHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:456-483 (28 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _batchRejectHe(int count) =>
    'השינוי נרחב מדי — $count יעדים (מעל התקרה $kStudioMaxBatch). צמצם את הטווח.';

/// The early DRY-COUNT verdict (§10): the real targets to build, the pre-ceiling
/// [requested] count, and a Hebrew [rejectedReasonHe] that is non-null EXACTLY when the
/// scope is over [kStudioMaxBatch] (then [ids] is empty — nothing is built).
class ScopeCount {
  const ScopeCount._(this.ids, this.requested, this.rejectedReasonHe);

  /// The real targets to build (empty when [rejected]).
  final List<String> ids;

  /// How many ids the scope expanded to — the pre-ceiling count, shown even when
  /// rejected so the preview can say "42 יעדים, מעל התקרה".
  final int requested;

  /// The Hebrew rejection reason, or null when under the ceiling.
  final String? rejectedReasonHe;

  bool get ok => rejectedReasonHe == null;
  bool get rejected => rejectedReasonHe != null;
  int get count => ids.length;
}

/// Run the §10 early DRY-COUNT for [token] over [registry]: [expandScope] once and
/// compare the target COUNT to [kStudioMaxBatch] BEFORE building any ops. An
/// over-ceiling scope is refused here (empty ids + a Hebrew reason), so the caller
/// never wastes per-op construction on a "rewrite half the app" broadcast (§3).
