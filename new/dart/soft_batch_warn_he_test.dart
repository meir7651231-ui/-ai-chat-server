// בדיקת-חוזה · softBatchWarnHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/soft_batch_warn_he_test.dart
import 'soft_batch_warn_he.dart';

String? _s(int c) => softBatchWarnHe(c, softWarn: 5, maxBatch: 20);
String _warn(int c) => 'שים לב — $c פעולות בבת אחת. אפשר להמשיך, או לצמצם.';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s(4), null, '1 below'); n++;
  _eq(_s(5), _warn(5), '2 lower-edge inclusive'); n++;
  _eq(_s(12), _warn(12), '3 mid'); n++;
  _eq(_s(20), _warn(20), '4 upper-edge inclusive'); n++;
  _eq(_s(21), null, '5 above-max'); n++;
  _eq(_s(0), null, '6 zero'); n++;

  assert(_s(5) != null && _s(4) == null, 'assert-live guard');
  print('OK softBatchWarnHe: $n asserts passed');
}
