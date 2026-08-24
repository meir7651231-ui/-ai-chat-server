// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · validBoardCode — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:59-73 (15 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, hasMatch
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool validBoardCode(String input) {
  final digits = input.replaceAll(RegExp(r'[\s-]'), '');
  return RegExp(r'^\d{4}$').hasMatch(digits);
}

/// Normalize a free-text phone to the international digit string `wa.me`
/// expects (digits only, country code, NO `+`/`00`/separators). Pure →
/// unit-testable. Rules (Israeli-first, the only market today):
///   • strip everything that isn't a digit (spaces, dashes, parens, `+`);
///   • a `00`-prefixed international form drops the `00` (→ bare country code);
///   • an Israeli LOCAL number (leading `0`, e.g. `050-123 4567`) maps its
///     trunk `0` to the `972` country code → `972501234567`;
///   • an already-international number (`+972…` / `972…`) keeps its digits.
/// Returns `''` when there are no digits at all (→ the caller hides the
/// WhatsApp button rather than opening `wa.me/`).
