import 'is_manifold.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'מחלק 3 יציאות')), true, '1');
  n++;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'סעפת פליז')), true, '2');
  n++;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'ברך 90')), false, '3');
  n++;
  print('✓ isManifold: $n');
}
