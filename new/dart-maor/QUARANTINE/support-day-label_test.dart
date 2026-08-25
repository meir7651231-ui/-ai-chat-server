// רתמת-זהב · support-day-label — כל 12 הקלטות-ה-Golden של בדיקת-ה-JS (זהות-ביט).
import 'support-day-label.dart';

void main() {
  // [at, todayIso, want] — הועתק אחד-לאחד מ-support-day-label.test.mjs.
  const cases = <List<String>>[
    ['', '', 'היום'],
    ['', 'אבג', ''],
    ['', 'כהן לוי', ''],
    ['', 'abc', ''],
    ['', 'a@b.com', ''],
    ['', '2026-08-24', ''],
    ['', '2026-08-24T12:00:00', ''],
    ['', '0501234567', ''],
    ['', '03-1234567', ''],
    ['', 'https://x.co', ''],
    ['', 'שלום עולם', ''],
    ['', '12', ''],
  ];
  for (final c in cases) {
    final got = supportDayLabel(c[0], c[1]);
    if (got != c[2]) {
      throw StateError('✗ ("${c[0]}","${c[1]}") ⇒ "$got" ≠ "${c[2]}"');
    }
  }
  print('✓ support-day-label (Dart): ${cases.length} הקלטות-Golden — ירוק · OK');
}
