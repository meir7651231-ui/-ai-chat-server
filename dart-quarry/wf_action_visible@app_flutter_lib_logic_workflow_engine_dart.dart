// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfActionVisible — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:149-163 (15 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool wfActionVisible(WfCase a) {
  switch (a.stage) {
    case WfStage.done:
      return false;
    case WfStage.intake:
      return a.names.isNotEmpty;
    case WfStage.ready:
      return a.names.any((n) => n.units != null);
    case WfStage.prep:
    case WfStage.dispatch:
      return true;
  }
}

/// תווית-כפתור-הקידום פר-שלב.
