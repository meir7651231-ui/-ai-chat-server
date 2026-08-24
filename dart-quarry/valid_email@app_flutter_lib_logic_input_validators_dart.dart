// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · validEmail — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:17-28 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): hasMatch
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool validEmail(String input) {
  final s = input.trim();
  return RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(s);
}

/// Israeli business id (ח"פ / ע.מ.): exactly 9 digits AND a valid check digit.
/// Dashes and spaces are allowed in the input and stripped before the check.
///
/// Phase-2 bug-fix (was 9-digits-only, so a mistyped id slipped through): the
/// standard Israeli 1-2-1-2 weighted checksum — each digit times its weight,
/// products over 9 fold (sum their digits, i.e. −9), and the total must be
/// ≡ 0 (mod 10). A pure tightening; no toggle (a bug fix, not a feature).
