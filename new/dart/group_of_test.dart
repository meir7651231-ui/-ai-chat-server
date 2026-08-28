import '../dart-data/group_of-terms.dart' as td_group_of;
import 'group_of.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'מחברי HDPE'), term: (k)=>td_group_of.kTerms[k]!), 'חיבורים ומחברים', '1'); n++;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'מחסומים'), term: (k)=>td_group_of.kTerms[k]!), 'ניקוז וסיפונים', '2'); n++;
  _eq(groupOf(const LipskeyCatalogProduct(categoryHe: 'קטגוריה-עתידית'), term: (k)=>td_group_of.kTerms[k]!), 'אחר', '3'); n++;
  print('✓ groupOf: $n');
}
