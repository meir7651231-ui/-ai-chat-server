// רתמת-זהב · segula-title — כל 5 דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// undefined של JS (דוגמה 4) ⇒ null ב-Dart (אותה זרוע-שקר של name||'').
// הפלט מחרוזת יחידה ⇒ השוואת-שוויון ישירה (כלל-8 חל רק על מערכים).
import 'segula-title.dart';

void main() {
  final cases = <List<dynamic>>[
    [
      ['משה', {'day': 1, 'final': false}, 40],
      '🕯 סגולה — משה · יום 1/40'
    ],
    [
      ['משה', {'day': 40, 'final': true}, 40],
      '🎯 סיום סגולה — משה · יום 40/40'
    ],
    [
      ['', {'day': 7, 'final': false}, 40],
      '🕯 סגולה —  · יום 7/40'
    ],
    [
      [null, {'day': 21, 'final': false}, 40],
      '🕯 סגולה —  · יום 21/40'
    ],
    [
      ['רבקה', {'day': 35, 'final': false}, 40],
      '🕯 סגולה — רבקה · יום 35/40'
    ],
  ];
  for (final c in cases) {
    final a = c[0] as List<dynamic>;
    final want = c[1] as String;
    final got = segulaTitle(a[0], a[1], a[2]);
    if (got != want) {
      throw StateError('✗ $a ⇒ $got ≠ $want');
    }
  }
  print('✓ segula-title (Dart): 5 דוגמאות-חוזה — ירוק OK');
}
