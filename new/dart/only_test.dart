import 'only.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(only({WaterSystem.supply}, WaterSystem.supply), true, '1'); n++;
  _eq(only({WaterSystem.supply}, WaterSystem.drainage), false, '2'); n++;
  _eq(only({WaterSystem.supply, WaterSystem.drainage}, WaterSystem.supply), false, '3'); n++;
  _eq(only(<WaterSystem>{}, WaterSystem.supply), false, '4'); n++;
  print('✓ only: $n');
}
