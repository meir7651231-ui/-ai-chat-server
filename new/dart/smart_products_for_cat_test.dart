// בדיקת-חוזה golden · smartProductsForCat — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/smart_products_for_cat_test.dart
import 'smart_products_for_cat.dart';

void main() {
  var n = 0;
  const cat = <SmartProduct>[
    SmartProduct(cat: 'ברזים'),
    SmartProduct(cat: 'צנרת'),
    SmartProduct(cat: 'ברזים'),
  ];

  final a = smartProductsForCat('ברזים', catalog: cat);
  if (a.length != 2 || a.any((p) => p.cat != 'ברזים')) {
    throw StateError('FAIL 1: ${a.map((p) => p.cat).toList()}');
  }
  n++;

  if (smartProductsForCat('צנרת', catalog: cat).length != 1) {
    throw StateError('FAIL 2');
  }
  n++;

  if (smartProductsForCat('חשמל', catalog: cat).isNotEmpty) {
    throw StateError('FAIL 3');
  }
  n++;

  if (smartProductsForCat('ברזים', catalog: const []).isNotEmpty) {
    throw StateError('FAIL 4');
  }
  n++;

  assert(smartProductsForCat('צנרת', catalog: cat).first.cat == 'צנרת',
      'assert-live');
  print('OK smartProductsForCat: $n asserts passed');
}
