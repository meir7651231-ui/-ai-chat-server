import 'f_money.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(fMoney(9840), '₪9,840', '1');
  n++;
  _eq(fMoney(-1234567), '-₪1,234,567', '2');
  n++;
  _eq(fMoney(0), '₪0', '3');
  n++;
  _eq(fMoney(100), '₪100', '4');
  n++;
  print('✓ fMoney: $n');
}
