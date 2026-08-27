// בדיקת-חוזה golden · catalogProductForBrand — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/catalog_product_for_brand_test.dart
import 'catalog_product_for_brand.dart';

void main() {
  var n = 0;
  const pA = LipskeyCatalogProduct();
  const pB = LipskeyCatalogProduct();
  final idx = <String, LipskeyCatalogProduct>{'SKU-A': pA, 'SKU-B': pB};

  final r1 = catalogProductForBrand(const SmartBrand(sku: 'SKU-A'), skuIndex: idx);
  if (!identical(r1, pA)) throw StateError('FAIL 1');
  n++;

  if (catalogProductForBrand(const SmartBrand(), skuIndex: idx) != null) {
    throw StateError('FAIL 2');
  }
  n++;

  if (catalogProductForBrand(const SmartBrand(sku: 'SKU-Z'), skuIndex: idx) !=
      null) {
    throw StateError('FAIL 3');
  }
  n++;

  if (catalogProductForBrand(const SmartBrand(sku: 'SKU-A'), skuIndex: const {}) !=
      null) {
    throw StateError('FAIL 4');
  }
  n++;

  assert(
      identical(
          catalogProductForBrand(const SmartBrand(sku: 'SKU-B'), skuIndex: idx),
          pB),
      'assert-live');
  print('OK catalogProductForBrand: $n asserts passed');
}
