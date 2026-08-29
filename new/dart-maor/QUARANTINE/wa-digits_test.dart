/// בדיקת-Golden · wa-digits — כל 12 זוגות-החוזה (wa-digits.contract.md)
/// + מקרי בדיקת-ה-JS (wa-digits.test.mjs) — זהים.
import 'wa-digits.dart';

void expectEq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('✗ $label ⇒ $got ≠ $want');
  }
}

void main() {
  // 12 הקלטות-Golden מהחוזה ומבדיקת-ה-JS
  final cases = <List<dynamic>>[
    ['', null],
    ['אבג', null],
    ['כהן לוי', null],
    ['abc', null],
    ['a@b.com', null],
    ['2026-08-24', '97220260824'],
    ['2026-08-24T12:00:00', '20260824120000'],
    ['0501234567', '972501234567'],
    ['03-1234567', '97231234567'],
    ['https://x.co', null],
    ['שלום עולם', null],
    ['12', null],
  ];
  for (final c in cases) {
    expectEq(waDigits(c[0]), c[1], 'waDigits(${c[0]})');
  }
  print('OK');
}
