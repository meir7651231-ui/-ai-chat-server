// בדיקת-חוזה golden · batchRejectHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/batch_reject_he_test.dart
import 'batch_reject_he.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(batchRejectHe(42, maxBatch: 20),
      'השינוי נרחב מדי — 42 יעדים (מעל התקרה 20). צמצם את הטווח.', '1'); n++;
  _eq(batchRejectHe(0, maxBatch: 5),
      'השינוי נרחב מדי — 0 יעדים (מעל התקרה 5). צמצם את הטווח.', '2 zero'); n++;
  _eq(batchRejectHe(1000, maxBatch: 999),
      'השינוי נרחב מדי — 1000 יעדים (מעל התקרה 999). צמצם את הטווח.', '3 big'); n++;
  assert(batchRejectHe(3, maxBatch: 2).contains('3 יעדים'), 'assert-live');
  print('OK batchRejectHe: $n asserts passed');
}
