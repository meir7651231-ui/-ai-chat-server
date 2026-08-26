// בדיקת-חוזה · pdfSafe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/pdf_safe_test.dart
import 'pdf_safe.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(pdfSafe('שלום עולם'), 'שלום עולם', '1 hebrew'); n++;
  _eq(pdfSafe('Budget: 500'), 'Budget: 500', '2 ascii'); n++;
  _eq(pdfSafe('₪1,234'), '₪1,234', '3 shekel kept'); n++;
  _eq(pdfSafe('café ☕'), 'caf', '4 accent+emoji dropped'); n++;
  _eq(pdfSafe('  hi  '), 'hi', '5 trim'); n++;
  _eq(pdfSafe('a\tb\nc'), 'abc', '6 control chars dropped'); n++;
  _eq(pdfSafe(''), '', '7 empty'); n++;

  assert(pdfSafe('₪') == '₪', 'assert-live guard');

  print('OK pdfSafe: $n asserts passed');
}
