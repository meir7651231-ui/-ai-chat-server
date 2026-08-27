import 'chip_priority.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(chipPriority('diameter'), 1, '1'); n++;
  _eq(chipPriority('brand'), 17, '2'); n++;
  _eq(chipPriority('size'), 18, '3'); n++;
  _eq(chipPriority('nonexistent'), 99, '4'); n++;
  print('✓ chipPriority: $n');
}
