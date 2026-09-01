import '../dart-data/size_system-terms.dart' as td_size_system;
import 'size_system.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(sizeSystem('DN110', term: (k)=>td_size_system.kTerms[k]!), 'DN ניקוז', '1');
  n++;
  _eq(sizeSystem('1/2"', term: (k)=>td_size_system.kTerms[k]!), 'תבריג (אינץ\')', '2');
  n++;
  _eq(sizeSystem('32', term: (k)=>td_size_system.kTerms[k]!), 'HDPE (מ"מ)', '3');
  n++;
  _eq(sizeSystem('90', term: (k)=>td_size_system.kTerms[k]!), 'DN ניקוז', '4');
  n++;
  _eq(sizeSystem('abc', term: (k)=>td_size_system.kTerms[k]!), 'אחר', '5');
  n++;
  print('✓ sizeSystem: $n');
}
