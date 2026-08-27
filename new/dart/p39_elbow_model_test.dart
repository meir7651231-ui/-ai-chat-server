import 'p39_elbow_model.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(p39ElbowModel('ברך 355'), 'B', '1');
  n++;
  _eq(p39ElbowModel('ברך 160'), 'A', '2');
  n++;
  _eq(p39ElbowModel('x 400 y'), 'B', '3');
  n++;
  _eq(p39ElbowModel('355'), 'A', '4');
  n++;
  print('✓ p39ElbowModel: $n');
}
