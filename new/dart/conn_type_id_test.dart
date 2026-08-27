import 'conn_type_id.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(connTypeId(EndType.hdpeCompression), 'plumbing.conn.hdpeCompression', '1'); n++;
  _eq(connTypeId(EndType.bspMale), 'plumbing.conn.bspMale', '2'); n++;
  _eq(connTypeId(EndType.drainOpening), 'plumbing.conn.drainOpening', '3'); n++;
  print('✓ connTypeId: $n');
}
