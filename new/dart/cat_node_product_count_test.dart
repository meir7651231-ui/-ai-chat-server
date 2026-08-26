// בדיקת-חוזה golden · catNodeProductCount — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/cat_node_product_count_test.dart
import 'cat_node_product_count.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // עץ: שורש (פנימי) עם 2 עלים — קטגוריות 'צנרת' ו-'ברזים'; עלה נוסף בלי lipskey.
  final tree = const CatalogNode(isLeaf: false, children: [
    CatalogNode(isLeaf: true, lipskeyCategory: 'צנרת'),
    CatalogNode(isLeaf: true, lipskeyCategory: 'ברזים'),
    CatalogNode(isLeaf: true), // lipskeyCategory==null ⇒ מדולג
  ]);
  final products = const [
    CatProduct(categoryHe: 'צנרת'),
    CatProduct(categoryHe: 'צנרת'),
    CatProduct(categoryHe: 'ברזים'),
    CatProduct(categoryHe: 'חשמל'), // מחוץ לקטגוריות ⇒ לא נספר
  ];
  // cats={'צנרת','ברזים'} ⇒ 3 מוצרים תואמים.
  _eq(catNodeProductCount(tree, allProducts: products), 3, '1 basic'); n++;

  // עלה-בודד: cats={'צנרת'} ⇒ 2.
  final leaf = const CatalogNode(isLeaf: true, lipskeyCategory: 'צנרת');
  _eq(catNodeProductCount(leaf, allProducts: products), 2, '2 leaf'); n++;

  // עץ עמוק (פנימי בתוך פנימי) — אוסף רקורסיבית.
  final deep = const CatalogNode(isLeaf: false, children: [
    CatalogNode(isLeaf: false, children: [
      CatalogNode(isLeaf: true, lipskeyCategory: 'חשמל'),
    ]),
  ]);
  _eq(catNodeProductCount(deep, allProducts: products), 1, '3 deep'); n++;

  // מוצרים ריקים ⇒ 0.
  _eq(catNodeProductCount(tree, allProducts: const []), 0, '4 no products'); n++;

  // עלה בלי קטגוריה ⇒ cats ריק ⇒ 0.
  _eq(catNodeProductCount(const CatalogNode(isLeaf: true), allProducts: products),
      0, '5 leaf no cat'); n++;

  assert(catNodeProductCount(leaf, allProducts: products) == 2, 'assert-live');
  print('OK catNodeProductCount: $n asserts passed');
}
