import 'p54_adapter_model.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(p54AdapterModel('63x20'), 'C', '1');
  n++;
  _eq(p54AdapterModel('40x20'), 'B', '2');
  n++;
  _eq(p54AdapterModel('25x20'), 'A', '3');
  n++;
  _eq(p54AdapterModel('110x'), 'C', '4');
  n++;
  print('✓ p54AdapterModel: $n');
}
