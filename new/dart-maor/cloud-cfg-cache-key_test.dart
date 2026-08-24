// רתמת-זהב · cloud-cfg-cache-key — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אותם קלטים→פלטים בדיוק כמו new/atoms/cloud-cfg-cache-key.test.mjs.
import 'cloud-cfg-cache-key.dart';

void main() {
  const cases = <List<String>>[
    ['', 'maor_cloudcfg:'],
    ['אבג', 'maor_cloudcfg:אבג'],
    ['כהן לוי', 'maor_cloudcfg:כהן לוי'],
    ['abc', 'maor_cloudcfg:abc'],
    ['a@b.com', 'maor_cloudcfg:a@b.com'],
    ['2026-08-24', 'maor_cloudcfg:2026-08-24'],
    ['2026-08-24T12:00:00', 'maor_cloudcfg:2026-08-24T12:00:00'],
    ['0501234567', 'maor_cloudcfg:0501234567'],
    ['03-1234567', 'maor_cloudcfg:03-1234567'],
    ['https://x.co', 'maor_cloudcfg:https://x.co'],
    ['שלום עולם', 'maor_cloudcfg:שלום עולם'],
    ['12', 'maor_cloudcfg:12'],
  ];
  for (final c in cases) {
    final got = cloudCfgCacheKey(c[0]);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ cloud-cfg-cache-key (Dart): ${cases.length} הקלטות-Golden — ירוק');
}
