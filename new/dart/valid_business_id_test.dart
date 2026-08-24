// בדיקת-חוזה · validBusinessId — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/valid_business_id_test.dart
import 'valid_business_id.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  assert(got == want, 'assert [$label]');
}

void main() {
  var n = 0;

  // — ספרת-ביקורת תקינה (סכום ≡ 0 mod 10) —
  _eq(validBusinessId('000000000'), true, '1 all zeros sum=0');       n++;
  _eq(validBusinessId('123456782'), true, '2 sum=40');                n++;
  _eq(validBusinessId('514567890'), true, '3 sum=40');                n++;
  _eq(validBusinessId('111111118'), true, '4 sum=20');                n++;

  // — מפרידים מוסרים לפני הבדיקה ([\s-] בלבד) —
  _eq(validBusinessId('1-234 56782'), true, '5 dash+space stripped'); n++;
  _eq(validBusinessId('51456789 0'), true, '6 space stripped');       n++;

  // — אורך תקין, ספרת-ביקורת שגויה (ה-Phase-2 bug-fix) —
  _eq(validBusinessId('123456789'), false, '7 sum=47 bad check');     n++;
  _eq(validBusinessId('512345678'), false, '8 sum=39 bad check');     n++;
  _eq(validBusinessId('987654321'), false, '9 sum=47 bad check');     n++;

  // — שער-האורך: לא בדיוק 9 ספרות —
  _eq(validBusinessId('12345678'), false, '10 eight digits');         n++;
  _eq(validBusinessId('1234567820'), false, '11 ten digits');         n++;
  _eq(validBusinessId(''), false, '12 empty');                        n++;

  // — עדשה-עוינת: רק [\s-] מוסר, לא \D (הבחנה מ-waMeDigits/normalizePhone) —
  _eq(validBusinessId('12345678a'), false, '13 letter not stripped'); n++;
  _eq(validBusinessId('123.45678'), false, '14 dot not stripped');    n++;
  _eq(validBusinessId('(123)45678'), false, '15 parens not stripped'); n++;
  _eq(validBusinessId('+00000000'), false, '16 plus not stripped');   n++;
  _eq(validBusinessId('١٢٣٤٥٦٧٨٢'), false, '17 arabic-indic, \\d ASCII only'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(validBusinessId('123456782') == true, 'assert-live guard');

  print('OK validBusinessId: $n asserts passed');
}
