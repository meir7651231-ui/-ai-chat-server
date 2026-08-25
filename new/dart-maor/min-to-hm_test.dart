// רתמת-זהב · min-to-hm — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-pad2 מקומי: ריפוד דו-ספרתי (כמו האטום pad2). אם עובר ⇒ Dart≡JS.
import 'min-to-hm.dart';

String pad2(int n) => n.toString().padLeft(2, '0');

void main() {
  // 1-5) דוגמאות-החוזה
  assert(minToHM(0, pad2) == '00:00', "✗ 1 חצות 0⇒'00:00'");
  assert(minToHM(75, pad2) == '01:15', "✗ 2 75⇒'01:15'");
  assert(minToHM(600, pad2) == '10:00', "✗ 3 600⇒'10:00'");
  assert(minToHM(59, pad2) == '00:59', "✗ 4 59⇒'00:59'");
  assert(minToHM(1439, pad2) == '23:59', "✗ 5 1439⇒'23:59'");

  // 6) השקע נקרא פעמיים: שעות (1) ואז שארית (15)
  final calls = <int>[];
  String spy(int n) {
    calls.add(n);
    return pad2(n);
  }

  minToHM(75, spy);
  assert(calls.length == 2 && calls[0] == 1 && calls[1] == 15,
      '✗ 6 השקע נקרא פעמיים (1 ואז 15)');

  print('✓ min-to-hm (Dart): 6 דוגמאות-חוזה — ירוק');
}
