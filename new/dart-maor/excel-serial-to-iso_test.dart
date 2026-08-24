// רתמת-זהב · excel-serial-to-iso — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט).
// המקור: new/atoms/excel-serial-to-iso.test.mjs (12 הקלטות-Golden). אם עובר ⇒ Dart≡JS.
import 'excel-serial-to-iso.dart';

void main() {
  const cases = <List<String>>[
    ['', ''],
    ['אבג', ''],
    ['כהן לוי', ''],
    ['abc', ''],
    ['a@b.com', ''],
    ['2026-08-24', ''],
    ['2026-08-24T12:00:00', ''],
    ['0501234567', ''],
    ['03-1234567', ''],
    ['https://x.co', ''],
    ['שלום עולם', ''],
    ['12', '1900-01-11'],
  ];
  for (final c in cases) {
    final got = excelSerialToIso(c[0]);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ excel-serial-to-iso (Dart): ${cases.length} דוגמאות-חוזה — ירוק');
}
