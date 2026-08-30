import '../dart-data/brand_by_id-data.dart' as td_brand_by_id;
import 'brand_by_id.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(brandById('aquatec', kBrands: td_brand_by_id.kBrands)?.name, 'AQUATEC', '1'); n++;
  _eq(brandById('aquatec', kBrands: td_brand_by_id.kBrands)?.emoji, '💧', '2'); n++;
  _eq(brandById('no-such-brand', kBrands: td_brand_by_id.kBrands), null, '3'); n++;
  print('✓ brandById: $n');
}
