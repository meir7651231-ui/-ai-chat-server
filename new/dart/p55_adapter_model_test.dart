import 'p55_adapter_model.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(p55AdapterModel('40x20'), 'B', '1');
  n++;
  _eq(p55AdapterModel('63x40'), 'B', '2');
  n++;
  _eq(p55AdapterModel('90x63'), 'A', '3');
  n++;
  _eq(p55AdapterModel('20x'), 'A', '4');
  n++;
  print('✓ p55AdapterModel: $n');
}
