// בדיקת-Golden · filterByImage — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'filter_by_image.dart';
import '../dart-data/k_lipskey_catalog-table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((filterByImage(const <LipskeyCatalogProduct>[], true)).toString(), '[]', '#0'); n++;
  _eq((filterByImage(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0),const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)], false)).toString(), '[Instance of \'LipskeyCatalogProduct\', Instance of \'LipskeyCatalogProduct\']', '#1'); n++;
  _eq((filterByImage(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)], false)).toString(), '[Instance of \'LipskeyCatalogProduct\']', '#2'); n++;
  _eq((filterByImage(const <LipskeyCatalogProduct>[], false)).toString(), '[]', '#3'); n++;
  _eq((filterByImage(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0),const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)], true)).toString(), '[]', '#4'); n++;
  _eq((filterByImage(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)], true)).toString(), '[]', '#5'); n++;
  print('✓ filterByImage: '+n.toString()+' Golden');
}
