import '../dart-data-maor/gematria-sockets.dart' as sk_gematria;
// בדיקת-חוזה לאטום gemValue (Dart). מראה חוזה = new/atoms/gematria-value.test.mjs.
import 'gematria-value.dart';

void main() {
  final cases = <List<Object?>>[
    ['אבג', 6],
    ['דוד', 14],
    ['שלום', 376],
    ['תשפ״ו', 786],
    ['ט״ו', 15],
    ['אמן', 91],
    ['ץ', 90],
    ['', null],
    ['abc', null],
  ];
  var fail = 0;
  for (final c in cases) {
    final a = c[0] as String;
    final w = c[1] as int?;
    final g = gemValue(a, sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2);
    if (g != w) {
      fail = 1;
      print('✗ gemValue("$a", sk_gematria.gematria_U, sk_gematria.gematria_T, sk_gematria.gematria_H, sk_gematria.gematria_T2) = $g ≠ $w');
    }
  }
  if (fail != 0) throw StateError('gematria-value: חוזה נכשל');
  print('✓ gematria-value: 9 דוגמאות-חוזה — ירוק');
}
