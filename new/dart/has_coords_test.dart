import 'has_coords.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(hasCoords(32.1, 34.8), true, '1'); n++;
  _eq(hasCoords(null, 34.8), false, '2'); n++;
  _eq(hasCoords(32.1, null), false, '3'); n++;
  _eq(hasCoords(null, null), false, '4'); n++;
  print('✓ hasCoords: $n');
}
