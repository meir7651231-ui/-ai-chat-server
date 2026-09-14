// בדיקת-Golden · companyCategorySections — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'company_category_sections.dart';
import '../dart-data/k_lipskey_catalog-table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((companyCategorySections(const <LipskeyCatalogProduct>[])).toString(), '[]', '#0'); n++;
  _eq((companyCategorySections(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0),const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)])).toString(), '[Instance of \'Section\', Instance of \'Section\']', '#1'); n++;
  _eq((companyCategorySections(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)])).toString(), '[Instance of \'Section\']', '#2'); n++;
  print('✓ companyCategorySections: '+n.toString()+' Golden');
}
