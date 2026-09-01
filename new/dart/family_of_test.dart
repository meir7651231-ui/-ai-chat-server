import '../dart-data/family_of-terms.dart' as td_family_of;
// בדיקת-אטום · familyOf
import '../dart-data/family_of-data.dart' as td_family_of;
import 'family_of.dart';

void main() {
  // קטגוריה לא-אביזרית → null (fallback)
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: 'צינורות PPR',
        nameHe: 'צינור 50',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      null);

  // מצמד חד-קוטרי → 'מצמד'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprCouplers,
        nameHe: 'מצמד 50',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'מצמד');

  // מצמד דו-קוטרי (50×40) → 'מצרה'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprCouplers,
        nameHe: 'מצמד 50×40',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'מצרה');

  // מצמד "50x50" — קטרים זהים → נשאר 'מצמד'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprCouplers,
        nameHe: 'מצמד 50x50',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'מצמד');

  // ברך רגילה → 'ברך 90°'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprElbows,
        nameHe: 'ברך 63',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'ברך 90°');

  // ברך עם 45 בשם → 'ברך 45°'
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprElbows,
        nameHe: 'ברך 45 63',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'ברך 45°');

  // מסעף → verbatim מהמפה
  assert(familyOf(const LipskeyCatalogProduct(
        categoryHe: td_family_of.kPprTees,
        nameHe: 'טי 50',
      ), kCategoryFamily: td_family_of.kCategoryFamily, term: (k)=>td_family_of.kTerms[k]!) ==
      'מסעף (טי)');

  print('familyOf OK');
}
