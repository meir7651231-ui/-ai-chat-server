import '../dart-data/port_count_for-terms.dart' as td_port_count_for;
import 'port_count_for.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'צינור PPR'), term: (k)=>td_port_count_for.kTerms[k]!), 2, '1');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'פקק'), term: (k)=>td_port_count_for.kTerms[k]!), 1, '2');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct(productType: 'מסעף'), term: (k)=>td_port_count_for.kTerms[k]!), 3, '3');
  n++;
  _eq(portCountFor(const LipskeyCatalogProduct(), term: (k)=>td_port_count_for.kTerms[k]!), 2, '4');
  n++;
  print('✓ portCountFor: $n');
}
