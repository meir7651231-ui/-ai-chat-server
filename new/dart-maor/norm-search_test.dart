// בדיקת-חוזה (רתמת-זהב) · normSearch — 7 דוגמאות-המקור (norm-search.test.mjs),
// ביט-אחר-ביט; שקע-T מוזן מאטום-הדאטה (זהה לצילום-ה-JS). בנוסף: הוכחה-דו-פלטפורמית
// בפאזר של validate-proof.
// הרצה: dart run --enable-asserts norm-search_test.dart
import '../dart-data-maor/norm-search-sockets.dart' as sk_ns;
import 'norm-search.dart';

void main() {
  final cases = <List<String?>>[
    ['שָׁלוֹם', 'שלומ'],
    ['כהן ז"ל', 'כהנ זל'],
    ['בֵּן־דָּוִד', 'בנדוד'],
    ['ABC', 'abc'],
    ['חוגים', 'חוגימ'],
    [null, ''],
    ['  יוסף ', 'יוספ'],
  ];
  var f = 0;
  for (final c in cases) {
    final got = normSearch(c[0], sk_ns.normSearch_T);
    if (got != c[1]) {
      print('✗ "${c[0]}" ⇒ "$got" ≠ "${c[1]}"');
      f = 1;
    }
  }
  if (f != 0) throw StateError('נכשל');
  print('✓ norm-search.dart: 7 דוגמאות-חוזה — ירוק');
}
