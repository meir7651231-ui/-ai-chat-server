// רתמת-זהב · is-safe-accent — assert-ים = 12 הקלטות-Golden של בדיקת-ה-JS (אותם קלטים→פלטים).
import 'is-safe-accent.dart';

void main() {
  const cases = <(String, bool)>[
    ('', false),
    ('אבג', false),
    ('כהן לוי', false),
    ('abc', true),
    ('a@b.com', false),
    ('2026-08-24', false),
    ('2026-08-24T12:00:00', false),
    ('0501234567', false),
    ('03-1234567', false),
    ('https://x.co', false),
    ('שלום עולם', false),
    ('12', false),
  ];
  for (final c in cases) {
    final got = isSafeAccent(c.$1);
    assert(got == c.$2, '✗ "${c.$1}" ⇒ $got ≠ ${c.$2}');
  }
  print('✓ is-safe-accent (Dart): 12 הקלטות-Golden — ירוק');
}
