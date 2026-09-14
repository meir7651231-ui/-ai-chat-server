// בדיקת-Golden · chainArrowText — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'chain_arrow_text.dart';
import '../dart-data/k_lipskey_catalog-table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((chainArrowText(const <LipskeyCatalogProduct>[])).toString(), '', '#0'); n++;
  _eq((chainArrowText(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'a', nameHe: 'a', nameEn: 'a', categoryHe: 'a', categoryEn: 'a', categoryEmoji: 'a', page: 0),const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)])).toString(), 'a ← b', '#1'); n++;
  _eq((chainArrowText(const <LipskeyCatalogProduct>[const LipskeyCatalogProduct(sku: 'b', nameHe: 'b', nameEn: 'b', categoryHe: 'b', categoryEn: 'b', categoryEmoji: 'b', page: 1)])).toString(), 'b', '#2'); n++;
  print('✓ chainArrowText: '+n.toString()+' Golden');
}
