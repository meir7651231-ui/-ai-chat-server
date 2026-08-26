// בדיקת-חוזה ל-sup-ils.dart — 5 דוגמאות-החוזה (זהות ל-sup-ils.test.mjs) +
// ratchet חוק-17 (float64) שמוכיח את תיקון-ההסגר.
import 'sup-ils.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

// השוואת-שוויון בהקשר-JS (num==num; double==int נכון ב-Dart).
bool _eq(dynamic got, num want) => got is num && got == want;

// String(num) בסגנון-JS — לחשיפת עיגול-ה-float64 בראצ'ט (int64 היה ...993).
String _jsStrOf(num n) {
  if (n is int) return n.toString();
  final d = n.toDouble();
  if (d == d.truncateToDouble() && d.abs() < 1e21) {
    return d.abs() < 9007199254740992.0 ? d.toInt().toString() : d.toStringAsFixed(0);
  }
  return d.toString();
}

void main() {
  // 1) המונה השמור בלבד
  ok(_eq(supIls({'ils': 100}), 100), 'ils=100 בלי hist ⇒ 100');

  // 2) hist נוסף; שורת-$ מוחרגת
  ok(
    _eq(
        supIls({
          'ils': 100,
          'hist': [
            {'a': 50, 'c': '₪'},
            {'a': 30, 'c': '\$'},
          ],
        }),
        150),
    '100+50₪ (ה-30\$ מוחרג) ⇒ 150',
  );

  // 3) הכול חסר ⇒ 0
  ok(_eq(supIls({}), 0), 'ils חסר + hist חסר ⇒ 0');

  // 4) שורה בלי c נספרת כשקלית
  ok(
    _eq(
        supIls({
          'hist': [
            {'a': 70},
          ],
        }),
        70),
    'c חסר ⇒ נספר ₪ ⇒ 70',
  );

  // 5) כולה דולרים ⇒ אפס ₪
  ok(
    _eq(
        supIls({
          'ils': 0,
          'hist': [
            {'a': 25, 'c': '\$'},
          ],
        }),
        0),
    'רק \$ ⇒ 0',
  );

  // 6) ratchet חוק-17 (float64): 2^53 + 1 — JS מעגל-double ל-2^53, Dart int64
  //    היה נותן 2^53+1 (מדויק). התיקון (.toDouble ב-_jsAdd) ⇒ תואם-JS.
  {
    final res = supIls({
      'ils': 9007199254740992, // 2^53
      'hist': [
        {'a': 1},
      ],
    });
    ok(res is double, 'ratchet: התוצאה double (מרחב-float64 של JS)');
    ok(res == 9007199254740992, 'ratchet float64: 2^53+1 ⇒ 2^53 (עיגול-JS)');
    // הוכחת-הבאג: הקוד-השבור (int64) היה מחזיר int 9007199254740993.
    // התיקון מחזיר double במרחב-float64 ⇒ הביטוי-הטקסטואלי חושף את העיגול.
    ok(_jsStrOf(res) == '9007199254740992', 'ratchet: מחרוזת-JS = ...992, לא ...993');
  }

  if (_f != 0) {
    throw StateError('sup-ils: בדיקות נכשלו');
  }
  print('✓ sup-ils: 5 דוגמאות-חוזה + ratchet חוק-17 — ירוק');
}
