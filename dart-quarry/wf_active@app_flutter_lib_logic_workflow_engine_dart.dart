// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfActive — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:140-148 (9 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool wfActive(WfCase? a) {
  if (a == null) return false;
  return a.stage != WfStage.intake ||
      a.names.isNotEmpty ||
      a.lastTouch.isNotEmpty ||
      a.log.isNotEmpty;
}

/// האם כפתור-הקידום גלוי בשלב הנוכחי (ה-guard).
