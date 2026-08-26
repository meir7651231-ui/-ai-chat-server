// בדיקת-חוזה · generateCsvTemplate — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/generate_csv_template_test.dart
import 'generate_csv_template.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(generateCsvTemplate(['צבע'], fixedColumns: ['sku', 'name', 'cat']),
      'sku,name,cat,צבע\n,,,', '1'); n++;
  _eq(generateCsvTemplate([], fixedColumns: ['sku', 'name', 'cat']),
      'sku,name,cat\n,,', '2 no-defs'); n++;
  _eq(generateCsvTemplate(['b', 'c'], fixedColumns: ['a']),
      'a,b,c\n,,', '3'); n++;
  _eq(generateCsvTemplate([], fixedColumns: []), '\n', '4 empty'); n++;
  _eq(generateCsvTemplate([], fixedColumns: ['x']), 'x\n', '5 single'); n++;

  assert(generateCsvTemplate([], fixedColumns: ['x']) == 'x\n', 'assert-live guard');
  print('OK generateCsvTemplate: $n asserts passed');
}
