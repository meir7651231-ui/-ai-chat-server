import 'angle_digits.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(angleDigits('15°'), '15', '1');
  n++;
  _eq(angleDigits('90'), '90', '2');
  n++;
  _eq(angleDigits('ללא'), 'ללא', '3');
  n++;
  _eq(angleDigits('a45b90'), '45', '4');
  n++;
  print('✓ angleDigits: $n');
}
