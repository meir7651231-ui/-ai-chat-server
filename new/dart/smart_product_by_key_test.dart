// בדיקת-חוזה golden · smartProductByKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/smart_product_by_key_test.dart
import 'smart_product_by_key.dart';

void main() {
  var n = 0;
  const cat = <SmartProduct>[
    SmartProduct(key: 'faucet-a'),
    SmartProduct(key: 'pipe-b'),
    SmartProduct(key: 'faucet-a'),
  ];

  final r1 = smartProductByKey('pipe-b', catalog: cat);
  if (r1 == null || r1.key != 'pipe-b') throw StateError('FAIL 1: $r1');
  n++;

  final r2 = smartProductByKey('faucet-a', catalog: cat);
  if (!identical(r2, cat[0])) throw StateError('FAIL 2 first-wins');
  n++;

  if (smartProductByKey('nope', catalog: cat) != null) {
    throw StateError('FAIL 3');
  }
  n++;

  if (smartProductByKey('faucet-a', catalog: const []) != null) {
    throw StateError('FAIL 4');
  }
  n++;

  assert(smartProductByKey('pipe-b', catalog: cat)!.key == 'pipe-b',
      'assert-live');
  print('OK smartProductByKey: $n asserts passed');
}
