// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · normalizePhone — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:48-58 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, substring
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String normalizePhone(String input) {
  var digits = input.replaceAll(RegExp(r'\D'), '');
  if (digits.isEmpty) return '';
  if (digits.startsWith('00')) digits = digits.substring(2);
  if (digits.startsWith('972')) digits = '0${digits.substring(3)}';
  return digits;
}

/// Board login code (task #65): exactly 4 digits — the seeded board-account
/// codes (`data/board_accounts_local.dart`). Dashes and spaces are allowed in
/// the input and stripped before the check.
