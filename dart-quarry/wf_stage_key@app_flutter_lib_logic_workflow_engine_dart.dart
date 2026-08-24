// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfStageKey — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:34-41 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String wfStageKey(WfStage s) => switch (s) {
      WfStage.intake => 'intake',
      WfStage.prep => 'prep',
      WfStage.ready => 'ready',
      WfStage.dispatch => 'dispatch',
      WfStage.done => 'done',
    };

