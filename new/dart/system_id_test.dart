import 'system_id.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(systemId(WaterSystem.supply), 'plumbing.sys.supply', '1'); n++;
  _eq(systemId(WaterSystem.drainage), 'plumbing.sys.drainage', '2'); n++;
  print('✓ systemId: $n');
}
