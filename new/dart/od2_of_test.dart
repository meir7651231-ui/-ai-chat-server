// בדיקת-אטום · od2Of — מייבא רק את האטום.
import 'od2_of.dart';

void main() {
  // מצרה בשם → הקוטר השני.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מצרה 50x40')) == 40);
  // × יוניקוד.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 20×2.8 בטעות')) == null ||
      od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 110×90')) == 90);
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מעבר 110×90')) == 90);
  // קטרים זהים ⇒ null.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'מחבר 50x50')) == null);
  // לא-דו-קוטרי בשם, אבל ב-dims['מידה'].
  assert(od2Of(const LipskeyCatalogProduct(
        nameHe: 'ברך PPR',
        dims: {'מידה': '63x50'},
      )) ==
      50);
  // אין בכלל ⇒ null.
  assert(od2Of(const LipskeyCatalogProduct(nameHe: 'ברז ניל')) == null);
  print('od2_of OK');
}
