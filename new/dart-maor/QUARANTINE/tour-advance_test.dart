// בדיקת חוט · tour-advance — כל דוגמאות-החוזה + בדיקת-ה-JS (tour-advance.test.mjs)
import 'tour-advance.dart';

void expectEq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('✗ $label = $got ≠ $want');
  }
}

void main() {
  // דוגמאות-החוזה המחייבות (length=15) — זהות לבדיקת-ה-JS:
  final cases = [
    [0, 1, 15, 1],
    [5, -1, 15, 4],
    [0, -1, 15, 0], // הצמדה לפני-ההתחלה
    [14, 1, 15, null], // סיום
    [13, 1, 15, 14],
    [20, 1, 15, null], // מעבר-לקצה
  ];
  for (final c in cases) {
    expectEq(tourAdvance(c[0], c[1], c[2]), c[3],
        'tourAdvance(${c[0]},${c[1]},${c[2]})');
  }
  print('OK');
}
