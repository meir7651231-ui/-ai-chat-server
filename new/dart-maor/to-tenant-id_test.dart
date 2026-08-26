import 'to-tenant-id.dart';

void main() {
  final cases = <List<dynamic>>[
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
  var fail = 0;
  for (final c in cases) {
    final got = toTenantId(c[0], c[1]);
    if (got != c[2]) {
      fail++;
      print('✗ [${c[0]}, ${c[1]}] ⇒ $got ≠ ${c[2]}');
    }
  }
  // בונוס · חוק-13: אימות-עוין — İ (U+0130) ⇒ 'i'+U+0307 (מיפוי-מלא של JS);
  // Dart-VM היה נותן 'i' יחיד ⇒ 'ixx'. הנקודה-המשולבת הופכת ל-'-' בצינור.
  assert(toTenantId('', 'İxx') == 'i-xx', 'İ ⇒ i + combining-dot (מיפוי-מלא)');

  if (fail > 0) throw StateError('$fail הקלטות-Golden נכשלו');
  print('✓ to-tenant-id: ${cases.length} הקלטות-Golden + חוק-13 — ירוק');
}
