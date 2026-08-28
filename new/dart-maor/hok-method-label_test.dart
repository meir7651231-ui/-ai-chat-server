import '../dart-data-maor/hok-method-label-terms.dart' as td_hok_method_label;
// רתמת-זהב · hok-method-label — assert-ים = דוגמאות-החוזה (הקלטות-Golden) של בדיקת-ה-JS (זהות).
import 'hok-method-label.dart';

void main() {
  const cases = <List<String>>[
    ['', 'אחר'],
    ['אבג', 'אבג'],
    ['כהן לוי', 'כהן לוי'],
    ['abc', 'abc'],
    ['a@b.com', 'a@b.com'],
    ['2026-08-24', '2026-08-24'],
    ['2026-08-24T12:00:00', '2026-08-24T12:00:00'],
    ['0501234567', '0501234567'],
    ['03-1234567', '03-1234567'],
    ['https://x.co', 'https://x.co'],
    ['שלום עולם', 'שלום עולם'],
    ['12', '12'],
  ];
  for (final c in cases) {
    final got = hokMethodLabel(c[0], term: (k)=>td_hok_method_label.kTerms[k]!);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ hok-method-label (Dart): ${cases.length} הקלטות-Golden — ירוק');
}
