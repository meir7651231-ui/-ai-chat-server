import 'size_system.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(sizeSystem('DN110'), 'DN ניקוז', '1');
  n++;
  _eq(sizeSystem('1/2"'), 'תבריג (אינץ\')', '2');
  n++;
  _eq(sizeSystem('32'), 'HDPE (מ"מ)', '3');
  n++;
  _eq(sizeSystem('90'), 'DN ניקוז', '4');
  n++;
  _eq(sizeSystem('abc'), 'אחר', '5');
  n++;
  print('✓ sizeSystem: $n');
}
