import '../dart-data/is_manifold-terms.dart' as td_is_manifold;
import 'is_manifold.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'מחלק 3 יציאות'), term: (k)=>td_is_manifold.kTerms[k]!), true, '1');
  n++;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'סעפת פליז'), term: (k)=>td_is_manifold.kTerms[k]!), true, '2');
  n++;
  _eq(isManifold(const LipskeyCatalogProduct(nameHe: 'ברך 90'), term: (k)=>td_is_manifold.kTerms[k]!), false, '3');
  n++;
  print('✓ isManifold: $n');
}
