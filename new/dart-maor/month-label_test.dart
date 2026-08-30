// רתמת-זהב · month-label — כל 12 הקלטות-ה-Golden של בדיקת-ה-JS (זהות-ביט).
// פלט = מחרוזת יחידה ⇒ השוואת-שוויון ישירה (כלל-8 חל רק על מערכים). StateError על כשל.
import 'month-label.dart';

void main() {
  const cases = <List<String>>[
    ['', 'undefined/'],
    ['אבג', 'undefined/אבג'],
    ['כהן לוי', 'undefined/כהן לוי'],
    ['abc', 'undefined/abc'],
    ['a@b.com', 'undefined/a@b.com'],
    ['2026-08-24', '08/2026'],
    ['2026-08-24T12:00:00', '08/2026'],
    ['0501234567', 'undefined/0501234567'],
    ['03-1234567', '1234567/03'],
    ['https://x.co', 'undefined/https://x.co'],
    ['שלום עולם', 'undefined/שלום עולם'],
    ['12', 'undefined/12'],
  ];
  for (final c in cases) {
    final got = monthLabel(c[0]);
    if (got is! String || got != c[1]) {
      throw StateError('✗ "${c[0]}" ⇒ $got ≠ ${c[1]}');
    }
  }
  print('OK — month-label (Dart): ${cases.length} הקלטות-Golden — ירוק');
}
