import '../dart-data/critical_business_kind-terms.dart';
// בדיקת-חוזה · criticalBusinessKind — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/critical_business_kind_test.dart
import 'critical_business_kind.dart';

void _eq(CriticalKind? got, CriticalKind? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(criticalBusinessKind(id: 'confirmOrderBtn', labelHe: 'כפתור', term: (k)=>kTerms[k]!),
      CriticalKind.confirmOrder, '1 id-confirmorder');
  n++;
  _eq(criticalBusinessKind(id: 'x', labelHe: 'אשר הזמנה', term: (k)=>kTerms[k]!),
      CriticalKind.confirmOrder, '2 label-confirm');
  n++;
  _eq(criticalBusinessKind(id: 'approveOrder', labelHe: '', term: (k)=>kTerms[k]!),
      CriticalKind.confirmOrder, '3 approveorder');
  n++;
  _eq(criticalBusinessKind(id: 'priceField', labelHe: '', term: (k)=>kTerms[k]!), CriticalKind.price,
      '4 id-price');
  n++;
  _eq(criticalBusinessKind(id: 'x', labelHe: 'מחיר מוצר', term: (k)=>kTerms[k]!), CriticalKind.price,
      '5 label-price');
  n++;
  _eq(criticalBusinessKind(id: 'navbar', labelHe: 'ניווט', term: (k)=>kTerms[k]!), null, '6 none');
  n++;
  _eq(criticalBusinessKind(id: 'priceConfirmOrder', labelHe: '', term: (k)=>kTerms[k]!),
      CriticalKind.confirmOrder, '7 precedence');
  n++;
  _eq(criticalBusinessKind(id: 'PRICE', labelHe: '', term: (k)=>kTerms[k]!), CriticalKind.price,
      '8 lowercase');
  n++;

  assert(criticalBusinessKind(id: 'navbar', labelHe: 'ניווט', term: (k)=>kTerms[k]!) == null,
      'assert-live guard');

  print('OK criticalBusinessKind: $n asserts passed');
}
