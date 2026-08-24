// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfAdvanceLabel — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:164-191 (28 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): wfStageLabel
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String wfAdvanceLabel(OrgConfig cfg, WfCase a) {
  switch (a.stage) {
    case WfStage.intake:
      return '${wfStageLabel(cfg, WfStage.prep)} ←';
    case WfStage.prep:
      return '✓ אישור — ${wfStageLabel(cfg, WfStage.prep)}';
    case WfStage.ready:
      return '${wfStageLabel(cfg, WfStage.dispatch)} ←';
    case WfStage.dispatch:
      return a.dispatchPushed
          ? '✓ ${wfStageLabel(cfg, WfStage.done)}'
          : '📞 דחיפה ללוח';
    case WfStage.done:
      return '';
  }
}

/// תוצאת-תכנון-מעבר: patch + אירוע-לוח אופציונלי + toast. null אם לא-גלוי.
class WfAdvancePlan {
  const WfAdvancePlan({required this.patch, required this.event, required this.toast});
  final WfCase patch; // מוחל דרך copyWith על המקרה החי
  final ({String title, bool done})? event;
  final String toast;
}

/// מתכנן-המעבר הטהור. מחזיר null כשהפעולה לא-גלויה. שלב "dispatch" הוא
/// **2-לחיצות**: לחיצה-1 מדליקה dispatchPushed ונשארת ב-dispatch; לחיצה-2
/// (כשכבר-נדחף) מקדמת ל-done. (מראה verbatim את planAyinAdvance של מאור.)
