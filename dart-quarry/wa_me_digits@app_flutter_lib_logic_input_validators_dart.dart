// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · waMeDigits — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:74-90 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, substring
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String waMeDigits(String input) {
  var digits = input.replaceAll(RegExp(r'\D'), '');
  if (digits.isEmpty) return '';
  // `00<cc>…` international prefix → strip the `00` to the bare country code.
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }
  // Israeli local form: a single leading trunk `0` → the 972 country code.
  // (A `972…` that happens to start with no `0` is left untouched.)
  if (digits.startsWith('0')) {
    digits = '972${digits.substring(1)}';
  }
  return digits;
}

/// Amount (price / budget / expense): a finite number strictly greater than 0.
/// Accepts the nullable result of `int.tryParse` / `double.tryParse` directly.
