import 'valid_date_range.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(validDateRange(DateTime(2026, 1, 1), DateTime(2026, 1, 2)), true, '1'); n++;
  _eq(validDateRange(DateTime(2026, 1, 2), DateTime(2026, 1, 1)), false, '2'); n++;
  _eq(validDateRange(DateTime(2026, 1, 1), DateTime(2026, 1, 1)), false, '3'); n++;
  print('✓ validDateRange: $n');
}
