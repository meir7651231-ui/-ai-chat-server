// רתמת-זהב · parse-csv — 12 דוגמאות-החוזה (זהות לבדיקת-ה-JS new/atoms/parse-csv.test.mjs).
// אם עובר: Dart ≡ JS. הרצה: dart run --enable-asserts parse-csv_test.dart
import 'parse-csv.dart';

bool eq(List<List<String>> a, List<List<String>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) return false;
    for (var j = 0; j < a[i].length; j++) {
      if (a[i][j] != b[i][j]) return false;
    }
  }
  return true;
}

void check(String input, List<List<String>> want) {
  final got = parseCsv(input);
  if (!eq(got, want)) {
    throw StateError('✗ parseCsv(${input.isEmpty ? '""' : input}) ⇒ $got ≠ $want');
  }
}

void main() {
  check('', []);
  check('אבג', [
    ['אבג']
  ]);
  check('כהן לוי', [
    ['כהן לוי']
  ]);
  check('abc', [
    ['abc']
  ]);
  check('a@b.com', [
    ['a@b.com']
  ]);
  check('2026-08-24', [
    ['2026-08-24']
  ]);
  check('2026-08-24T12:00:00', [
    ['2026-08-24T12:00:00']
  ]);
  check('0501234567', [
    ['0501234567']
  ]);
  check('03-1234567', [
    ['03-1234567']
  ]);
  check('https://x.co', [
    ['https://x.co']
  ]);
  check('שלום עולם', [
    ['שלום עולם']
  ]);
  check('12', [
    ['12']
  ]);
  print('✓ parse-csv: 12 הקלטות-Golden — Dart ≡ JS');
}
