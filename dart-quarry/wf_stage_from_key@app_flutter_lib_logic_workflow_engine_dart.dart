// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfStageFromKey — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:42-59 (18 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
WfStage? wfStageFromKey(String k) => switch (k) {
      'intake' => WfStage.intake,
      'prep' => WfStage.prep,
      'ready' => WfStage.ready,
      'dispatch' => WfStage.dispatch,
      'done' => WfStage.done,
      _ => null,
    };

/// תוויות-נופלות ניטרליות (ניתנות-לשם דרך termOf `workflow.stage.<key>`).
const Map<WfStage, String> _kStageFallback = {
  WfStage.intake: 'חדש',
  WfStage.prep: 'בהכנה',
  WfStage.ready: 'מוכן',
  WfStage.dispatch: 'מסירה',
  WfStage.done: 'הושלם',
};

