import '../dart-data/invoice_title-terms.dart' as td_invoice_title;
// בדיקת-חוזה · invoiceTitle — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/invoice_title_test.dart
import 'invoice_title.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(invoiceTitle('ORD-1', receipt: true, term: (k)=>td_invoice_title.kTerms[k]!), 'קבלה — ORD-1', '1 receipt'); n++;
  _eq(invoiceTitle('ORD-1', receipt: false, term: (k)=>td_invoice_title.kTerms[k]!), 'חשבונית — ORD-1', '2 invoice'); n++;
  _eq(invoiceTitle('42', receipt: true, term: (k)=>td_invoice_title.kTerms[k]!), 'קבלה — 42', '3'); n++;
  _eq(invoiceTitle('', receipt: false, term: (k)=>td_invoice_title.kTerms[k]!), 'חשבונית — ', '4 empty id'); n++;

  assert(invoiceTitle('x', receipt: true, term: (k)=>td_invoice_title.kTerms[k]!) == 'קבלה — x', 'assert-live guard');
  print('OK invoiceTitle: $n asserts passed');
}
