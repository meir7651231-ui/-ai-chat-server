// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · validIsraeliMobile — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:11-16 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, hasMatch
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool validIsraeliMobile(String input) {
  final digits = input.replaceAll(RegExp(r'[\s-]'), '');
  return RegExp(r'^05\d{8}$').hasMatch(digits);
}

/// Basic email shape — `x@y.z`: one `@`, no whitespace, a dot in the domain.
