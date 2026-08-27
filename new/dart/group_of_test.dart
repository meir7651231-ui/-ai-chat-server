import 'group_of.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'מחברי HDPE')), 'חיבורים ומחברים', '1'); n++;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'מחסומים')), 'ניקוז וסיפונים', '2'); n++;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'קטגוריה-עתידית')), 'אחר', '3'); n++;
  print('✓ groupOf: $n');
}
