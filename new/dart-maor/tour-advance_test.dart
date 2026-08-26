// רתמת-זהב · tour-advance — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart≡JS. הקלטים/פלטים הועתקו verbatim מ-new/atoms/tour-advance.test.mjs.
import 'tour-advance.dart';

void main() {
  // 6 דוגמאות-החוזה (verbatim מ-tour-advance.test.mjs)
  final cases = <List<Object?>>[
    [0, 1, 15, 1],
    [5, -1, 15, 4],
    [0, -1, 15, 0],
    [14, 1, 15, null],
    [13, 1, 15, 14],
    [20, 1, 15, null],
  ];
  for (final c in cases) {
    final g = tourAdvance(c[0], c[1], c[2]);
    final w = c[3];
    assert(g == w, '✗ tourAdvance(${c[0]},${c[1]},${c[2]}) = $g ≠ $w');
  }

  // ── ratchet-הסגר · חוק-17 (float64) ────────────────────────────────────
  // הבאג: `index + delta` על dynamic-int חיבר במרחב-int64 המדויק, בעוד JS
  // מחבר תמיד ב-float64. ‏index=2^53, delta=1 ⇒ JS מעגל בחזרה ל-2^53
  // (‏9007199254740992), אך Dart-int השבור החזיר 2^53+1 (9007199254740993).
  const twoTo53 = 9007199254740992; // 2^53
  final g53 = tourAdvance(twoTo53, 1, 1e300);
  assert(g53 == twoTo53,
      '✗ float64: tourAdvance(2^53,1,∞) = $g53 ≠ $twoTo53 (חיבור-int דלף)');

  // NaN מדביק: index=NaN ⇒ next=NaN ⇒ שתי ההשוואות false ⇒ מחזיר NaN (כמו-JS).
  final gNan = tourAdvance(double.nan, 1, 15);
  assert(gNan is double && (gNan as double).isNaN,
      '✗ NaN: tourAdvance(NaN,1,15) = $gNan (ציפינו NaN)');

  print('✓ tour-advance (Dart): 6 דוגמאות-חוזה + 2 ratchet-הסגר — ירוק');
}
