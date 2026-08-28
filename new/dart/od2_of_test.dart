import '../dart-data/od2_of-terms.dart' as td_od2_of;
// בדיקת-אטום · od2Of — מייבא רק את האטום.
import 'od2_of.dart';

void main() {
  // מצרה בשם → הקוטר השני.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מצרה 50x40'), term: (k)=>td_od2_of.kTerms[k]!) == 40);
  // × יוניקוד.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 20×2.8 בטעות'), term: (k)=>td_od2_of.kTerms[k]!) == null ||
      od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 110×90'), term: (k)=>td_od2_of.kTerms[k]!) == 90);
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 110×90'), term: (k)=>td_od2_of.kTerms[k]!) == 90);
  // קטרים זהים ⇒ null.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מחבר 50x50'), term: (k)=>td_od2_of.kTerms[k]!) == null);
  // לא-דו-קוטרי בשם, אבל ב-dims['מידה'].
  assert(od2Of(const LipskeyCatalogProduct(
        nameHe: 'ברך PPR',
        dims: {'מידה': '63x50'},
      ), term: (k)=>td_od2_of.kTerms[k]!) ==
      50);
  // אין בכלל ⇒ null.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'ברז ניל'), term: (k)=>td_od2_of.kTerms[k]!) == null);
  print('od2_of OK');
}
