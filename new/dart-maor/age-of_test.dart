// גולד-Dart · ageOf — הרץ: dart run --enable-asserts age-of_test.dart
import 'age-of.dart';

void main() {
  final now = DateTime(2026, 8, 24, 12, 0, 0);

  // —— 5 דוגמאות-החוזה מ-age-of.test.mjs (שעון-מוזרק) ——
  assert(ageOf('2000-08-24', now) == 26);
  assert(ageOf('2000-08-25', now) == 25); // יום-הולדת מחר ⇒ עדיין 25
  assert(ageOf('2000-08-23', now) == 26);
  assert(ageOf('', now) == null);
  assert(ageOf('שבור', now) == null);

  // —— ratchet · פסילת-תאריך-שבור (הבאג שהוסגר) ——
  // חודש/יום מחוץ-לטווח ⇒ ‏JS NaN ⇒ null (Dart-tryParse הישן היה מקבל/מגלגל).
  assert(ageOf('2000-13-01', now) == null); // חודש 13
  assert(ageOf('2000-00-10', now) == null); // חודש 00
  assert(ageOf('2000-12-32', now) == null); // יום 32
  assert(ageOf('2000-02-00', now) == null); // יום 00
  assert(ageOf('1999-1-1', now) == null); // דקדוק-ISO — ספרה-בודדת נפסלת (כמו V8)

  // —— ratchet · גלישת-יום חוקית מתגלגלת כמו V8 (לא-נפסלת) ——
  // ‏'2000-02-31' ⇒ V8: 2000-03-02 (תקין). גיל ב-2026-08-24 = 26.
  assert(ageOf('2000-02-31', now) == 26);
  assert(ageOf('2000-04-31', now) == 26); // ⇒ 2000-05-01

  // —— חיתוך 10-תווים (slice(0,10) של המקור) ——
  assert(ageOf('2000-08-24T00:00:00', now) == 26); // הזנב נחתך

  print('✓ age-of (Dart-gold): 14 טענות — ירוק');
}
