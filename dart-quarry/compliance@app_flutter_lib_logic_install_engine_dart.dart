// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · compliance — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:972-975 (4 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): lineComplianceChecklist
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  List<LineCheck> compliance(int tempC, [Set<String> accessories = const {}]) =>
      lineComplianceChecklist(items, tempC, accessories);

  /// Number of unsatisfied critical checks (safety gate count).
