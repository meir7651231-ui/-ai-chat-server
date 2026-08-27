import 'clean.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(clean([' a ', 'a', '', 'b'], 10).join(','), 'a,b', '1');
  n++;
  _eq(clean(['x', 'y', 'z'], 2).join(','), 'x,y', '2');
  n++;
  _eq(clean(['  '], 5).length, 0, '3');
  n++;
  print('✓ clean: $n');
}
