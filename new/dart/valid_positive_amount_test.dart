// בדיקת-חוזה · validPositiveAmount — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/valid_positive_amount_test.dart
import 'valid_positive_amount.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  assert(got == want, 'assert [$label]');
}

void main() {
  var n = 0;

  // — קלט תקין: חיובי סופי (מקור-הבדיקה :148-151) —
  _eq(validPositiveAmount(500), true, '1 positive int');            n++;
  _eq(validPositiveAmount(0.5), true, '2 positive double');         n++;

  // — קלט פסול: שלילי / אפס / null (מקור-הבדיקה :153-163) —
  _eq(validPositiveAmount(-500), false, '3 negative');             n++;
  _eq(validPositiveAmount(0), false, '4 zero not strictly > 0');   n++;
  _eq(validPositiveAmount(null), false, '5 null short-circuits');  n++;

  // — לא-סופי: infinity / nan (מקור-הבדיקה :165-168) —
  _eq(validPositiveAmount(double.infinity), false, '6 +infinity'); n++;
  _eq(validPositiveAmount(double.nan), false, '7 NaN not finite'); n++;

  // — עדשה-עוינת: קצות שהמקור מטפל בהם ואינם בבדיקת-המקור במפורש —
  _eq(validPositiveAmount(double.negativeInfinity), false, '8 -infinity'); n++;
  _eq(validPositiveAmount(-0.5), false, '9 negative double');      n++;
  _eq(validPositiveAmount(0.0), false, '10 zero double');          n++;
  _eq(validPositiveAmount(double.minPositive), true, '11 smallest positive'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(validPositiveAmount(500) == true, 'assert-live guard');

  print('OK validPositiveAmount: $n asserts passed');
}
