// בדיקת-אטום · productsOfMaterial — מייבא רק את האטום.
import 'products_of_material.dart';

void main() {
  const p1 = LipskeyCatalogProduct(nameHe: 'צינור PPR 32', categoryHe: 'צנרת');
  const p2 = LipskeyCatalogProduct(nameHe: 'ברז', categoryHe: 'ברזי ניל');
  const p3 = LipskeyCatalogProduct(nameHe: 'צינור נחושת', categoryHe: 'צנרת');
  const p4 = LipskeyCatalogProduct(nameHe: 'צינור HDPE', categoryHe: 'מחברי HDPE');
  final pool = [p1, p2, p3, p4];

  // sanity על materialOf.
  assert(materialOf(p1) == 'PPR');
  assert(materialOf(p2) == 'נחושת'); // דרך kCategoryMaterial
  assert(materialOf(p3) == 'נחושת'); // דרך היוריסטיקת-המונח
  assert(materialOf(p4) == 'HDPE');

  // נחושת → p2 ואז p3 (סדר-בריכה).
  final cu = productsOfMaterial(pool, 'נחושת');
  assert(cu.length == 2);
  assert(identical(cu[0], p2) && identical(cu[1], p3));

  // PPR → p1 בלבד.
  assert(productsOfMaterial(pool, 'PPR').single.nameHe == 'צינור PPR 32');

  // חומר-ללא-מוצר ⇒ ריק.
  assert(productsOfMaterial(pool, 'פלדה').isEmpty);
  // בריכה ריקה ⇒ ריק.
  assert(productsOfMaterial(const [], 'נחושת').isEmpty);
  print('products_of_material OK');
}
