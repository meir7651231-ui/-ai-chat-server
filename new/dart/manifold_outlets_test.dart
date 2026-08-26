// בדיקת-חוזה · manifoldOutlets — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/manifold_outlets_test.dart
import 'manifold_outlets.dart';

// שקע: stand-in ל-kVerifiedSpecs (המפה הגדולה אינה זמינה; חוק-3).
({List<({String size})> ends}) _spec(List<String> sizes) =>
    (ends: [for (final s in sizes) (size: s)]);

final Map<String, ({List<({String size})> ends})> _specs = {
  'M4': _spec(['DN20', 'DN20', 'DN20', 'DN20']),
  'M3': _spec(['DN20', 'DN20', 'DN25']),
  '116565': _spec(['DN50', 'DN50', 'DN50']),
  'M2': _spec(['DN20', 'DN20']),
  'M3d': _spec(['DN20', 'DN25', 'DN32']),
};

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(manifoldOutlets((productType: 'מחלק', categoryHe: '', sku: 'M4'), specs: _specs),
      4, '1 four outlets'); n++;
  _eq(manifoldOutlets((productType: 'X', categoryHe: 'מחלקים', sku: 'M3'), specs: _specs),
      2, '2 category gate + maxc=2'); n++;
  _eq(manifoldOutlets((productType: 'מסעף', categoryHe: 'מסעפים', sku: '116565'), specs: _specs),
      0, '3 tee blocked by taxonomy'); n++;
  _eq(manifoldOutlets((productType: 'מחלק', categoryHe: '', sku: 'M2'), specs: _specs),
      0, '4 fewer than 3 ends'); n++;
  _eq(manifoldOutlets((productType: 'מחלק', categoryHe: '', sku: 'MISSING'), specs: _specs),
      0, '5 spec null'); n++;
  _eq(manifoldOutlets((productType: 'מחלק', categoryHe: '', sku: 'M3d'), specs: _specs),
      0, '6 maxc=1 below 2'); n++;

  assert(
    manifoldOutlets((productType: 'מחלק', categoryHe: '', sku: 'M4'), specs: _specs) == 4,
    'assert-live guard',
  );

  print('OK manifoldOutlets: $n asserts passed');
}
