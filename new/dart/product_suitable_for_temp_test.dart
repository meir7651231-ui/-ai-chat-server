// בדיקת-חוזה · productSuitableForTemp — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_suitable_for_temp_test.dart
import 'product_suitable_for_temp.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — maxTempC == null ⇒ תמיד true (אין דירוג) —
  _eq(productSuitableForTemp(60, maxTempC: null), true, '1 null/60');   n++;
  _eq(productSuitableForTemp(-10, maxTempC: null), true, '7 null/-10'); n++;
  _eq(productSuitableForTemp(1000000, maxTempC: null), true, '9 null/big'); n++;

  // — עומד (tempC <= maxTempC) —
  _eq(productSuitableForTemp(60, maxTempC: 90), true, '2 60<=90'); n++;
  _eq(productSuitableForTemp(90, maxTempC: 90), true, '4 eq');     n++;
  _eq(productSuitableForTemp(0, maxTempC: 0), true, '5 0<=0');     n++;

  // — חורג (tempC > maxTempC) —
  _eq(productSuitableForTemp(95, maxTempC: 90), false, '3 95>90'); n++;
  _eq(productSuitableForTemp(1, maxTempC: 0), false, '6 1>0');     n++;
  _eq(productSuitableForTemp(-10, maxTempC: -20), false, '8 -10>-20'); n++;

  // assert חי (חוק: --enable-asserts) —
  assert(productSuitableForTemp(90, maxTempC: 90), 'assert-live guard');

  print('OK productSuitableForTemp: $n asserts passed');
}
