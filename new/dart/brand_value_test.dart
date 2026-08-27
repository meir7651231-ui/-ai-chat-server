import 'brand_value.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
LipskeyCatalogProduct _p({String brand = 'ליפסקי'}) => LipskeyCatalogProduct(
  sku: 'X1', nameHe: 'ברז', nameEn: 'Tap', brand: brand,
  categoryHe: 'ברזים', categoryEn: 'Taps', categoryEmoji: '🚰', page: 3,
);
void main(){
  var n=0;
  _eq(brandValue(_p(brand: '  חוליות  ')), 'חוליות', '1'); n++;
  _eq(brandValue(_p()), 'ליפסקי', '2'); n++;
  _eq(brandValue(_p(brand: 'Huliot')), 'Huliot', '3'); n++;
  print('✓ brandValue: $n');
}
