// בדיקת-חוזה · invoiceVatOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/invoice_vat_of_test.dart
import 'invoice_vat_of.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(invoiceVatOf(118, vatRate: 0.18), 18, '1'); n++;
  _eq(invoiceVatOf(1180, vatRate: 0.18), 180, '2'); n++;
  _eq(invoiceVatOf(59, vatRate: 0.18), 9, '3'); n++;
  _eq(invoiceVatOf(100, vatRate: 0.18), 15, '4 round-up'); n++;
  _eq(invoiceVatOf(117, vatRate: 0.17), 17, '5 alt-rate'); n++;
  _eq(invoiceVatOf(0, vatRate: 0.18), 0, '6 zero'); n++;
  _eq(invoiceVatOf(1, vatRate: 0.18), 0, '7 tiny'); n++;

  assert(invoiceVatOf(118, vatRate: 0.18) == 18, 'assert-live guard');
  print('OK invoiceVatOf: $n asserts passed');
}
