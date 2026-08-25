/// רתמת-זהב · is-data-image — דוגמאות-החוזה של new/atoms/is-data-image.test.mjs
/// בדיוק (אותם קלטים→פלטים). עובר ⇒ Dart≡JS. הרץ: dart run --enable-asserts.
import 'is-data-image.dart';

void main() {
  // [קלט, פלט-צפוי] — מראה 1:1 לטבלת C ב-is-data-image.test.mjs
  final cases = <List<dynamic>>[
    ['data:image/png;base64,iVBORw0K', true],
    ['data:image/jpeg;base64,/9j/4AAQ', true],
    ['data:image/jpg;base64,/9j/', true],
    ['data:image/webp;base64,UklGR', true],
    ['data:image/gif;base64,R0lGO', true],
    ['data:image/svg+xml;base64,PHN2Zw==', false], // svg מוחרג במכוון
    ['https://x.example/a.png', false],
    ['data:image/png,AAAA', false], // חסר ;base64
    [null, false], // JS null ⇒ לא-מחרוזת
    [42, false],
    [<String, dynamic>{}, false], // JS {} ⇒ לא-מחרוזת
  ];

  for (final c in cases) {
    final s = c[0];
    final want = c[1] as bool;
    final got = isDataImage(s);
    assert(got == want, '✗ ${s.toString()} ⇒ $got ≠ $want');
  }

  print('✓ is-data-image: 11 בדיקות מ-7 דוגמאות-חוזה — ירוק (Dart≡JS)');
}
