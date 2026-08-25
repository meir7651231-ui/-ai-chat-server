// רתמת-זהב · meta-path — assert-ים = 12 הקלטות-הגולדן של בדיקת-ה-JS (זהות-ביט).
// אם עובר: Dart ≡ JS על כל קלט מוקלט (חוק-4).
import 'meta-path.dart';

void main() {
  // [slug, cloudRoot, want] — בדיוק דוגמאות-הגולדן מ-meta-path.test.mjs.
  const cases = <List<String>>[
    ['', '', 'orgs//meta/org'],
    ['', 'אבג', 'meta/org'],
    ['', 'כהן לוי', 'meta/org'],
    ['', 'abc', 'meta/org'],
    ['', 'a@b.com', 'meta/org'],
    ['', '2026-08-24', 'meta/org'],
    ['', '2026-08-24T12:00:00', 'meta/org'],
    ['', '0501234567', 'meta/org'],
    ['', '03-1234567', 'meta/org'],
    ['', 'https://x.co', 'meta/org'],
    ['', 'שלום עולם', 'meta/org'],
    ['', '12', 'meta/org'],
  ];
  for (final c in cases) {
    final got = metaPath(c[0], c[1]);
    assert(got == c[2], '✗ [${c[0]}, ${c[1]}] ⇒ $got ≠ ${c[2]}');
  }
  print('✓ meta-path (Dart): ${cases.length} הקלטות-גולדן — ירוק');
}
