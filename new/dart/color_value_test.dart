import 'color_value.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
LipskeyCatalogProduct _p({String? color}) => LipskeyCatalogProduct(
  sku: 'X1', nameHe: 'ברז', nameEn: 'Tap', color: color,
  categoryHe: 'ברזים', categoryEn: 'Taps', categoryEmoji: '🚰', page: 3,
);
void main(){
  var n=0;
  _eq(colorValue(_p(color: '  אדום  ')), 'אדום', '1'); n++;
  _eq(colorValue(_p(color: null)), '', '2'); n++;
  _eq(colorValue(_p(color: '   ')), '', '3'); n++;
  _eq(colorValue(_p(color: 'כחול')), 'כחול', '4'); n++;
  print('✓ colorValue: $n');
}
