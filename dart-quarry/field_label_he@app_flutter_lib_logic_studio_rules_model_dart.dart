// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · fieldLabelHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:444-451 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String fieldLabelHe(String id) {
  for (final f in kRuleFields) {
    if (f.id == id) return f.labelHe;
  }
  return id;
}

/// The Hebrew label for an action id (or the raw id).
