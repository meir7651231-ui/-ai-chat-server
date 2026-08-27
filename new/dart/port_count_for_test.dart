import 'port_count_for.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'צינור PPR')), 2, '1');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'פקק')), 1, '2');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'מסעף')), 3, '3');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct()), 2, '4');
  n++;
  print('✓ portCountFor: $n');
}
