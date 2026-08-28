import '../dart-data/material_rank.dart';
import 'material_rank.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(materialRank('PPR', kMaterialOrder: kKMaterialOrder), 0, '1'); n++;
  _eq(materialRank('אלומיניום', kMaterialOrder: kKMaterialOrder), 11, '2'); n++;
  _eq(materialRank('לא-מוכר', kMaterialOrder: kKMaterialOrder), 1 << 10, '3'); n++;
  _eq(materialRank('', kMaterialOrder: kKMaterialOrder), 1 << 20, '4'); n++;
  print('✓ materialRank: $n');
}
