// בדיקת-חוזה (רתמת-זהב) · PUNCH_CONFIRM_MS — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/punch-confirm-ms.test.mjs:
//   SNAP = {"PUNCH_CONFIRM_MS":"3000"}  ⇒  JSON.stringify(PUNCH_CONFIRM_MS) === "3000"
// כלומר: הערך = 3000, מספר-שלם. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/punch-confirm-ms_test.dart  ⇒ exit 0
import 'punch-confirm-ms.dart';

void _ok(bool cond, String label) {
  if (!cond) {
    throw StateError('FAIL [$label]');
  }
}

void main() {
  var n = 0;
  const V = PUNCH_CONFIRM_MS;

  // — דוגמת-החוזה verbatim (צילום-ערך של punch-confirm-ms.test.mjs) —
  // JSON.stringify(3000) === "3000": הערך שווה 3000 בדיוק.
  _ok(V == 3000, 'הערך $V ≠ 3000');                       n++;
  _ok(V is int, 'לא מספר-שלם (JSON.stringify ללא נקודה)'); n++;
  // JSON.stringify(V) של Dart ⇒ "3000" (זהה לצילום-ה-JS).
  _ok(V.toString() == '3000', 'ייצוג-מחרוזת ≠ "3000"');   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(PUNCH_CONFIRM_MS == 3000, 'assert-live guard');

  print('OK PUNCH_CONFIRM_MS: $n asserts passed');
}
