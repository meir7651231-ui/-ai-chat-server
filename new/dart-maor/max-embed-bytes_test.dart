// בדיקת-חוזה (רתמת-זהב) · MAX_EMBED_BYTES — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/max-embed-bytes.test.mjs:
//   B == 3145728 · B == 3*1024*1024 · Number.isInteger(B) (‏int בטיפוס) · B > 0.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/max-embed-bytes_test.dart  ⇒ exit 0
import 'max-embed-bytes.dart';

void main() {
  var n = 0;
  final b = maxEmbedBytes;

  // 1) B === 3145728.
  if (b != 3145728) {
    throw StateError('FAIL [==3145728]: got=$b');
  }
  n++;

  // 2) B === 3 * 1024 * 1024.
  if (b != 3 * 1024 * 1024) {
    throw StateError('FAIL [==3*1024*1024]: got=$b');
  }
  n++;

  // 3) Number.isInteger(B) — ב-Dart הטיפוס עצמו int (מקבילה מדויקת לשלמות).
  if (b is! int) {
    throw StateError('FAIL [isInteger]: not an int');
  }
  n++;

  // 4) B > 0.
  if (!(b > 0)) {
    throw StateError('FAIL [>0]: got=$b');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(maxEmbedBytes == 3145728, 'assert-live guard');

  print('OK maxEmbedBytes: $n asserts passed');
}
