// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · actionLabelHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:452-459 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String actionLabelHe(String id) {
  for (final a in kRuleActions) {
    if (a.id == id) return a.labelHe;
  }
  return id;
}

/// A one-line Hebrew summary of a rule (the saved-list row).
