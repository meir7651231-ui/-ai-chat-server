// רתמת-זהב · push-nav — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. אותם קלטים→פלטים כמו new/atoms/push-nav.test.mjs.
import 'push-nav.dart';

// השוואת-רשימות איבר-איבר (כלל-המרה 8: לא join — מבחין גבול-איבר ו-[]↔['']).
bool eq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  // 1) מחסנית ריקה
  assert(eq(pushNav([], 'A'), ['A']), '✗ דוגמה 1: [] + A ≠ [A]');

  // 2) סדר נשמר, הנדחף אחרון
  assert(eq(pushNav(['A', 'B'], 'C'), ['A', 'B', 'C']),
      '✗ דוגמה 2: הסדר/המיקום שגויים');

  // 3) תקרת 20 — הישן ביותר נזרק
  {
    final h20 = List.generate(20, (i) => 'v${i + 1}');
    final out = pushNav(h20, 'v21');
    assert(out.length == 20, '✗ דוגמה 3: אורך ${out.length} ≠ 20');
    assert(out[0] == 'v2', '✗ דוגמה 3: הראשון ${out[0]} ≠ v2 (v1 היה אמור להיזרק)');
    assert(out[19] == 'v21', '✗ דוגמה 3: האחרון ${out[19]} ≠ v21');
  }

  // 4) אורך 19 ⇒ 20, אף איבר לא נזרק
  {
    final h19 = List.generate(19, (i) => 'v${i + 1}');
    final out = pushNav(h19, 'v20');
    assert(out.length == 20 && out[0] == 'v1',
        '✗ דוגמה 4: מתחת לתקרה נזרק איבר בטעות');
  }

  // 5) טוהר — הקלט לא משתנה
  {
    final h = ['A', 'B'];
    pushNav(h, 'C');
    assert(h.length == 2 && h[0] == 'A' && h[1] == 'B',
        '✗ דוגמה 5: הקלט המקורי השתנה');
  }

  print('✓ push-nav (Dart): 5 דוגמאות-חוזה — ירוק');
}
