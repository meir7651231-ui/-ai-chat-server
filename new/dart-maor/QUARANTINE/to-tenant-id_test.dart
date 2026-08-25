/// בדיקת חוט · to-tenant-id — כל 12 הקלטות-ה-Golden מהחוזה + בדיקת-ה-JS (to-tenant-id.test.mjs).
/// כישלון ⇒ StateError (זהות-ביט לפלט המוקלט).
import 'to-tenant-id.dart';

void check(String name, dynamic got, dynamic want) {
  if (got != want) {
    throw StateError('✗ $name: $got ≠ $want');
  }
}

void main() {
  // 12 זוגות ה-Golden — קלט ⇒ פלט מוקלט, זהה-ביט ל-JS.
  final cases = <List<String>>[
    ['', '', 'org'],
    ['', 'אבג', 'x--org'],
    ['', 'כהן לוי', 'x--org'],
    ['', 'abc', 'abc'],
    ['', 'a@b.com', 'a-b-com'],
    ['', '2026-08-24', '2026-08-24'],
    ['', '2026-08-24T12:00:00', '2026-08-24t12-00-00'],
    ['', '0501234567', '0501234567'],
    ['', '03-1234567', '03-1234567'],
    ['', 'https://x.co', 'https-x-co'],
    ['', 'שלום עולם', 'x--org'],
    ['', '12', '12-org'],
  ];
  var i = 0;
  for (final c in cases) {
    i++;
    check('golden #$i (${c[0]}, ${c[1]})', toTenantId(c[0], c[1]), c[2]);
  }
  print('OK');
}
