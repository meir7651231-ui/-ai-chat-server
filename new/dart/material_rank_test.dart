import 'material_rank.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(materialRank('PPR'), 0, '1'); n++;
  _eq(materialRank('אלומיניום'), 11, '2'); n++;
  _eq(materialRank('לא-מוכר'), 1 << 10, '3'); n++;
  _eq(materialRank(''), 1 << 20, '4'); n++;
  print('✓ materialRank: $n');
}
