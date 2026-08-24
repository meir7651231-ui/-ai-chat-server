// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · triggerLabelHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:436-443 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String triggerLabelHe(String id) {
  for (final t in kRuleTriggers) {
    if (t.id == id) return t.labelHe;
  }
  return id;
}

/// The Hebrew label for a condition field id (or the raw id).
