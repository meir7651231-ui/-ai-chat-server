import 'brand_by_id.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(brandById('aquatec')?.name, 'AQUATEC', '1'); n++;
  _eq(brandById('aquatec')?.emoji, '💧', '2'); n++;
  _eq(brandById('no-such-brand'), null, '3'); n++;
  print('✓ brandById: $n');
}
