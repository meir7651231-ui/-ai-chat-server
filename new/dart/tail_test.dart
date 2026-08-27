import 'tail.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(tail('12345', 3), 345, '1');
  n++;
  _eq(tail('ab', 3), 0, '2');
  n++;
  _eq(tail('7', 2), 7, '3');
  n++;
  _eq(tail('99999', 2), 99, '4');
  n++;
  print('✓ tail: $n');
}
