import 'non_empty_string.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(nonEmptyString('  hi '), 'hi', '1');
  n++;
  _eq(nonEmptyString('   '), null, '2');
  n++;
  _eq(nonEmptyString(5), null, '3');
  n++;
  _eq(nonEmptyString('x'), 'x', '4');
  n++;
  print('✓ nonEmptyString: $n');
}
