// בדיקת-Golden · jobBoost — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'job_boost.dart';
import '../dart-data/k_lipskey_catalog-table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0), const <String>{})).toString(), '0', '#0'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1), const <String>{'a','b'})).toString(), '300', '#1'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'c', nameHe: 'c', nameEn: 'c', categoryHe: 'c', categoryEn: 'c', categoryEmoji: 'c', page: 2), const <String>{'b'})).toString(), '0', '#2'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0), const <String>{'a','b'})).toString(), '300', '#3'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0), const <String>{'b'})).toString(), '0', '#4'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1), const <String>{})).toString(), '0', '#5'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1), const <String>{'b'})).toString(), '300', '#6'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'c', nameHe: 'c', nameEn: 'c', categoryHe: 'c', categoryEn: 'c', categoryEmoji: 'c', page: 2), const <String>{})).toString(), '0', '#7'); n++;
  _eq((jobBoost(const LipskeyCatalogProduct(sku: 'c', nameHe: 'c', nameEn: 'c', categoryHe: 'c', categoryEn: 'c', categoryEmoji: 'c', page: 2), const <String>{'a','b'})).toString(), '0', '#8'); n++;
  print('✓ jobBoost: '+n.toString()+' Golden');
}
