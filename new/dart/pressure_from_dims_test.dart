import 'pressure_from_dims.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(pressureFromDims(const LipskeyCatalogProduct(dims: {'PN': 16})), 'PN16', '1');
  n++;
  _eq(pressureFromDims(const LipskeyCatalogProduct(dims: {'PN': ''})), null, '2');
  n++;
  _eq(pressureFromDims(const LipskeyCatalogProduct(dims: {'DN': 25})), null, '3');
  n++;
  _eq(pressureFromDims(const LipskeyCatalogProduct()), null, '4');
  n++;
  print('✓ pressureFromDims: $n');
}
