// בדיקת-חוזה · productSuitableForTemp — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_suitable_for_temp_test.dart
import 'product_suitable_for_temp.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

// sku → maxTempC (double) או null (אין spec) — מגלם productMaxTempC (מקור:59).
const Map<String, double> _max = {
  'HDPE': 40,
  'PEX': 95,
  'CU': 110,
  // 'RAW' — חסר ⇒ null.
};

double? _maxOf(_Prod p) => _max[p.sku];

bool _ok(String sku, int tempC) =>
    productSuitableForTemp(_Prod(sku), tempC, maxTempCOf: _maxOf);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_ok('HDPE', 80), false, '1 HDPE@80 ⇒ unsuitable (80>40)'); n++;
  _eq(_ok('HDPE', 20), true, '2 HDPE@20 ⇒ ok');                 n++;
  _eq(_ok('HDPE', 40), true, '3 HDPE@40 ⇒ ok (boundary ≤)');    n++;
  _eq(_ok('PEX', 95), true, '4 PEX@95 ⇒ ok');                   n++;
  _eq(_ok('PEX', 96), false, '5 PEX@96 ⇒ unsuitable');          n++;
  _eq(_ok('RAW', 80), true, '6 no spec ⇒ true (unknown)');      n++;

  assert(_ok('HDPE', 80) == false, 'assert-live guard');
  print('OK productSuitableForTemp: $n asserts passed');
}
