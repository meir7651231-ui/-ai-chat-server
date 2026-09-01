// בדיקת-אטום · productsOfMaterial — מייבא רק את האטום.
import '../dart-data/products_of_material-data.dart' as td_products_of_material;
import 'products_of_material.dart';

void main() {
  const p1 = LipskeyCatalogProduct(nameHe: 'צינור PPR 32', categoryHe: 'צנרת');
  const p2 = LipskeyCatalogProduct(nameHe: 'ברז', categoryHe: 'ברזי ניל');
  const p3 = LipskeyCatalogProduct(nameHe: 'צינור נחושת', categoryHe: 'צנרת');
  const p4 = LipskeyCatalogProduct(nameHe: 'צינור HDPE', categoryHe: 'מחברי HDPE');
  final pool = [p1, p2, p3, p4];

  // sanity על materialOf.
  assert(materialOf(p1, kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial) == 'PPR');
  assert(materialOf(p2, kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial) == 'נחושת'); // דרך td_products_of_material.kCategoryMaterial
  assert(materialOf(p3, kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial) == 'נחושת'); // דרך היוריסטיקת-המונח
  assert(materialOf(p4, kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial) == 'HDPE');

  // נחושת → p2 ואז p3 (סדר-בריכה).
  final cu = productsOfMaterial(pool, 'נחושת', kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial);
  assert(cu.length == 2);
  assert(identical(cu[0], p2) && identical(cu[1], p3));

  // PPR → p1 בלבד.
  assert(productsOfMaterial(pool, 'PPR', kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial).single.nameHe == 'צינור PPR 32');

  // חומר-ללא-מוצר ⇒ ריק.
  assert(productsOfMaterial(pool, 'פלדה', kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial).isEmpty);
  // בריכה ריקה ⇒ ריק.
  assert(productsOfMaterial(const [], 'נחושת', kMaterials: td_products_of_material.kMaterials, kCategoryMaterial: td_products_of_material.kCategoryMaterial).isEmpty);
  print('products_of_material OK');
}
