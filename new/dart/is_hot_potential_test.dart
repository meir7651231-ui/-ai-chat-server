import 'is_hot_potential.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'מחלקים')), true, '1');
  n++;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'ברזי מטבח')), true, '2');
  n++;
  _eq(isHotPotential(const LipskeyCatalogProduct(categoryHe: 'צינורות')), false, '3');
  n++;
  print('✓ isHotPotential: $n');
}
