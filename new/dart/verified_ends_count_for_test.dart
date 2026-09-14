// בדיקת-Golden · verifiedEndsCountFor — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'verified_ends_count_for.dart';
import '../dart-data/k_lipskey_catalog-table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((verifiedEndsCountFor(const LipskeyCatalogProduct(sku: '9101601610', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0))).toString(), '2', '#0'); n++;
  _eq((verifiedEndsCountFor(const LipskeyCatalogProduct(sku: '9105020030', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0))).toString(), '2', '#1'); n++;
  _eq((verifiedEndsCountFor(const LipskeyCatalogProduct(sku: 'HW-MANIFOLD-6', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0))).toString(), '7', '#2'); n++;
  _eq((verifiedEndsCountFor(const LipskeyCatalogProduct(sku: '77777632', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0))).toString(), '2', '#3'); n++;
  _eq((verifiedEndsCountFor(const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0))).toString(), '0', '#4'); n++;
  print('✓ verifiedEndsCountFor: '+n.toString()+' Golden');
}
