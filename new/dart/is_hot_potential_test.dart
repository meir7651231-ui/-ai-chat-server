import '../dart-data/is_hot_potential-terms.dart' as td_is_hot_potential;
import 'is_hot_potential.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'מחלקים'), term: (k)=>td_is_hot_potential.kTerms[k]!), true, '1');
  n++;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'ברזי מטבח'), term: (k)=>td_is_hot_potential.kTerms[k]!), true, '2');
  n++;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'צינורות'), term: (k)=>td_is_hot_potential.kTerms[k]!), false, '3');
  n++;
  print('✓ isHotPotential: $n');
}
