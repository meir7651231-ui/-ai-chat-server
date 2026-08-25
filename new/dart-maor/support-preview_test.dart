/// בדיקת-Golden · support-preview — שיקוף support-preview.test.mjs + דוגמאות-החוזה.
import 'support-preview.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('✗ $label ⇒ "$got" ≠ "$want"');
  }
}

void main() {
  // 12 הקלטות-ה-Golden מ-support-preview.test.mjs (כולל כל דוגמאות-החוזה).
  final cases = <List<String>>[
    ['', ''],
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
    _eq(supportPreview(c[0]), c[1], 'golden "${c[0]}"');
  }

  // סמנטיקת-המקור (נגזר דטרמיניסטית מקוד-ה-JS): קיצוץ מעל max ⇒ ‏max-1 תווים + '…'.
  final long = 'a' * 50;
  final cut = supportPreview(long) as String;
  _eq(cut.length, 40, 'truncated length');
  _eq(cut, 'a' * 39 + '…', 'truncated content');

  // כיווץ-רווחים גלובלי (/g) + ‏trim — כמו ב-JS.
  _eq(supportPreview('  אבג   דהו  \n גז '), 'אבג דהו גז', 'whitespace collapse');

  print('OK · support-preview: ${cases.length} הקלטות-Golden + סמנטיקה — ירוק');
}
