import 'p53_adapter_model.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(p53AdapterModel('63x50'), 'B', '1');
  n++;
  _eq(p53AdapterModel('25x20'), 'A', '2');
  n++;
  _eq(p53AdapterModel('110x'), 'B', '3');
  n++;
  _eq(p53AdapterModel('32'), 'A', '4');
  n++;
  print('✓ p53AdapterModel: $n');
}
