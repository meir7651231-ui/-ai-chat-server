// רתמת-זהב · empty-wizard — Dart≡JS.
// דוגמת-החוזה = הצילום מבדיקת-ה-JS (empty-wizard.test.mjs):
//   JSON.stringify(EMPTY_WIZARD) ===
//   {"industry":"","size":"","needs":[],"orgName":"","contactName":"","phone":"","email":"","password":"","password2":""}
// jsonEncode ב-Dart משמר סדר-הכנסה + [] לרשימה-ריקה ⇒ זהה-לחלוטין ל-JSON.stringify.
import 'dart:convert';
import 'empty-wizard.dart';

void main() {
  const snap =
      '{"industry":"","size":"","needs":[],"orgName":"","contactName":"","phone":"","email":"","password":"","password2":""}';

  final got = jsonEncode(emptyWizard());
  assert(got == snap, 'empty-wizard סטה מהצילום:\n  got: $got\n  exp: $snap');

  // עותק-טרי בכל קריאה (מוטביליות בטוחה — שינוי לא דולף)
  final a = emptyWizard();
  (a['needs'] as List).add('x');
  final b = emptyWizard();
  assert((b['needs'] as List).isEmpty, 'needs חייב להיות טרי בכל קריאה');

  print('✓ empty-wizard: רתמת-זהב ירוקה — Dart≡JS');
}
