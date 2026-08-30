import '../dart-data-maor/gematria-sockets.dart' as sk_gematria;
// בדיקת-חוזה לאטום gem (Dart). מראה חוזה = new/atoms/gematria.test.mjs.
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
    final g = gem(a, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2);
    if (g != w) {
      fail = 1;
      print('✗ gem($a, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) = "$g" ≠ "$w"');
    }
  }

  // ratchet-הסגר: המקרה שהפיל את הפורט — s ריק ⇒ substring(0,-1) זרק RangeError.
  assert(gem(1000, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) == '״', 'gem(1000, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) צריך "״" (JS slice בטוח), קיבל "${gem(1000, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2)}"');
  assert(gem(double.infinity, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) == '', 'Infinity ⇒ ""');
  assert(gem(999, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) == 'תתקצ״ט', 'gem(999, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2)="${gem(999, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2)}"');

  if (fail != 0) throw StateError('gematria: חוזה נכשל');
  print('✓ gematria: 9 דוגמאות-חוזה + ratchet-הסגר — ירוק');
}
