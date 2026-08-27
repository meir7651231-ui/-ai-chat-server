// בדיקת-אטום · familyOf
import 'family_of.dart';

void main() {
  // קטגוריה לא-אביזרית → null (fallback)
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: 'צינורות PPR',
        nameHe: 'צינור 50',
      )) ==
      null);

  // מצמד חד-קוטרי → 'מצמד'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprCouplers,
        nameHe: 'מצמד 50',
      )) ==
      'מצמד');

  // מצמד דו-קוטרי (50×40) → 'מצרה'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprCouplers,
        nameHe: 'מצמד 50×40',
      )) ==
      'מצרה');

  // מצמד "50x50" — קטרים זהים → נשאר 'מצמד'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprCouplers,
        nameHe: 'מצמד 50x50',
      )) ==
      'מצמד');

  // ברך רגילה → 'ברך 90°'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprElbows,
        nameHe: 'ברך 63',
      )) ==
      'ברך 90°');

  // ברך עם 45 בשם → 'ברך 45°'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprElbows,
        nameHe: 'ברך 45 63',
      )) ==
      'ברך 45°');

  // מסעף → verbatim מהמפה
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: kPprTees,
        nameHe: 'טי 50',
      )) ==
      'מסעף (טי)');

  print('familyOf OK');
}
