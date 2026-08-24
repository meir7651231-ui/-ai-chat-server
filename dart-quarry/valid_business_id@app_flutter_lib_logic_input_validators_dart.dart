// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · validBusinessId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:29-47 (19 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, hasMatch, codeUnitAt
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool validBusinessId(String input) {
  final digits = input.replaceAll(RegExp(r'[\s-]'), '');
  if (!RegExp(r'^\d{9}$').hasMatch(digits)) return false;
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    final product = (digits.codeUnitAt(i) - 0x30) * (i.isEven ? 1 : 2);
    sum += product > 9 ? product - 9 : product;
  }
  return sum % 10 == 0;
}

/// Normalize a free-text Israeli phone to a CANONICAL LOCAL form for storage
/// and dedup/lookup: digits only, a single leading `0`, no separators. Pure.
///   • strip everything that isn't a digit (spaces, dashes, parens, `+`);
///   • an international `972…` / `00972…` / `+972…` maps back to a local `0…`;
///   • an already-local `05…` keeps its shape.
/// Returns `''` when there are no digits (the caller decides what empty means).
/// This is the CRM key [waMeDigits] is NOT — waMeDigits produces the outbound
/// `972…` wa.me form; this produces the stored `05…` identity.
