import '../dart-data-maor/gematria-terms.dart' as td_gematria;
// בדיקת-חוזה לאטום gem (Dart, term: (k)=>td_gematria.kTerms[k]!). מראה חוזה = new/atoms/gematria.test.mjs.
// כולל ratchet-הסגר: n≥1000 כפולת-100 ⇒ '״' (JS slice בטוח על מחרוזת ריקה).
import 'gematria.dart';

void main() {
  final cases = <List<Object>>[
    [15, 'ט״ו'],
    [16, 'ט״ז'],
    [5, 'ה׳'],
    [786, 'תשפ״ו'],
    [30, 'ל׳'],
    [21, 'כ״א'],
    [0, ''],
    [-3, ''],
    [double.nan, ''],
  ];
  var fail = 0;
  for (final c in cases) {
    final a = c[0] as num;
    final w = c[1] as String;
    final g = gem(a, term: (k)=>td_gematria.kTerms[k]!);
    if (g != w) {
      fail = 1;
      print('✗ gem($a, term: (k)=>td_gematria.kTerms[k]!) = "$g" ≠ "$w"');
    }
  }

  // ratchet-הסגר: המקרה שהפיל את הפורט — s ריק ⇒ substring(0,-1) זרק RangeError.
  assert(gem(1000, term: (k)=>td_gematria.kTerms[k]!) == '״', 'gem(1000, term: (k)=>td_gematria.kTerms[k]!) צריך "״" (JS slice בטוח), קיבל "${gem(1000, term: (k)=>td_gematria.kTerms[k]!)}"');
  assert(gem(double.infinity, term: (k)=>td_gematria.kTerms[k]!) == '', 'Infinity ⇒ ""');
  assert(gem(999, term: (k)=>td_gematria.kTerms[k]!) == 'תתקצ״ט', 'gem(999, term: (k)=>td_gematria.kTerms[k]!)="${gem(999, term: (k)=>td_gematria.kTerms[k]!)}"');

  if (fail != 0) throw StateError('gematria: חוזה נכשל');
  print('✓ gematria: 9 דוגמאות-חוזה + ratchet-הסגר — ירוק');
}
