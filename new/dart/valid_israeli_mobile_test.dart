// בדיקת-חוזה · validIsraeliMobile — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/valid_israeli_mobile_test.dart
import 'valid_israeli_mobile.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  assert(got == want, 'assert [$label]');
}

void main() {
  var n = 0;

  // — קלט תקין: 10 ספרות 05 עם/בלי מפרידים —
  _eq(validIsraeliMobile('0501234567'), true, '1 ten digits 05');       n++;
  _eq(validIsraeliMobile('050-123 4567'), true, '2 dash+space (docstring)'); n++;
  _eq(validIsraeliMobile('050 1234567'), true, '3 space stripped');     n++;
  _eq(validIsraeliMobile('05-01234567'), true, '4 dash stripped');      n++;
  _eq(validIsraeliMobile('\t0501234567\n'), true, '5 tab+newline are \\s'); n++;
  _eq(validIsraeliMobile('0521234567'), true, '6 third digit free 05\\d'); n++;

  // — קלט פסול: אורך/קידומת שגויים —
  _eq(validIsraeliMobile('050123456'), false, '7 nine digits');         n++;
  _eq(validIsraeliMobile('05012345678'), false, '8 eleven digits');     n++;
  _eq(validIsraeliMobile('0401234567'), false, '9 starts 04 not 05');   n++;
  _eq(validIsraeliMobile('1501234567'), false, '10 no leading 0');      n++;
  _eq(validIsraeliMobile(''), false, '11 empty');                       n++;
  _eq(validIsraeliMobile('972501234567'), false, '12 intl form rejected'); n++;

  // — עדשה-עוינת: רק [\s-] מוסר, לא \D (הבחנה מ-waMeDigits/normalizePhone) —
  _eq(validIsraeliMobile('050.1234567'), false, '13 dot not stripped'); n++;
  _eq(validIsraeliMobile('(050)1234567'), false, '14 parens not stripped'); n++;
  _eq(validIsraeliMobile('+972501234567'), false, '15 plus not stripped'); n++;
  _eq(validIsraeliMobile('05a1234567'), false, '16 letter not stripped'); n++;
  _eq(validIsraeliMobile('٠٥٠١٢٣٤٥٦٧'), false, '17 arabic-indic, \\d ASCII only'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(validIsraeliMobile('0501234567') == true, 'assert-live guard');

  print('OK validIsraeliMobile: $n asserts passed');
}
