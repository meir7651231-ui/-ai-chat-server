import 'is-enc-doc.dart';

// רתמת-זהב: אותם קלטים→פלטים כמו is-enc-doc.test.mjs (דוגמאות-החוזה).
// undefined של JS ⇒ null ב-Dart (השניים חסרי-ערך; שניהם ⇒ false).
void main() {
  final cases = <List<dynamic>>[
    [{'enc': 'q1XZ', 'iv': 'AAAAAAAAAAAAAAAA'}, true],
    [{'enc': 'q1XZ'}, false],
    [{'iv': 'AAAA'}, false],
    [null, false],
    [null, false], // undefined ב-JS
    ['enc', false],
    [42, false],
    [{'enc': 5, 'iv': 'AAAA'}, false],
    [{'enc': 'q1XZ', 'iv': 'AAAA', 'meta': {'v': 1}}, true],
    [<String, dynamic>{}, false],
  ];
  var f = 0;
  for (final c in cases) {
    final d = c[0];
    final w = c[1] as bool;
    final g = isEncDoc(d);
    if (g != w) {
      print('✗ $d ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('is-enc-doc: הזהב נכשל');
  print('✓ is-enc-doc (Dart): 10 בדיקות מ-7 דוגמאות-חוזה — ירוק (Dart≡JS)');
}
