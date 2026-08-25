// בדיקות sup12m — כל דוגמאות-החוזה + בדיקת-ה-JS (sup12m.test.mjs), אחד-לאחד.
import 'sup12m.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

void main() {
  // שקע-הבדיקה כמוגדר בחוזה: supLast = (sp) => sp.last || ''
  dynamic last(dynamic sp) =>
      (sp is Map && sp.containsKey('last') && _jsTruthy(sp['last']))
          ? sp['last']
          : '';

  // 1) תרומה בתוך החלון
  ok(sup12m([{'last': '2026-01-01'}], '2026-08-24', last) == 1, 'דוגמה 1: ≠ 1');
  // 2) יום-הסף עצמו נספר (>=)
  ok(sup12m([{'last': '2025-08-24'}], '2026-08-24', last) == 1, 'דוגמה 2: ≠ 1');
  // 3) יום אחד לפני הסף — לא נספר
  ok(sup12m([{'last': '2025-08-23'}], '2026-08-24', last) == 0, 'דוגמה 3: ≠ 0');
  // 4) last ריק/חסר — לא נספר
  ok(sup12m([{'last': ''}, <String, dynamic>{}], '2026-08-24', last) == 0,
      'דוגמה 4: ≠ 0');
  // 5) ספירה מעורבת
  ok(
      sup12m([
            {'last': '2026-08-01'},
            {'last': '2024-12-31'},
            {'last': '2025-09-15'}
          ], '2026-08-24', last) ==
          2,
      'דוגמה 5: ≠ 2');
  // 6) שנה מעוברת — הסף מ-2024-03-01 הוא 2023-03-02
  ok(
      sup12m([
            {'last': '2023-03-02'},
            {'last': '2023-03-01'}
          ], '2024-03-01', last) ==
          1,
      'דוגמה 6: ≠ 1');
  // 7) רשימה ריקה
  ok(sup12m([], '2026-08-24', last) == 0, 'דוגמה 7: ≠ 0');

  print('OK');
}

// עותק-בדיקה מקומי של falsiness-JS עבור שקע-הבדיקה (sp.last || '').
bool _jsTruthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is String) return v.isNotEmpty;
  if (v is num) return !(v == 0 || v.isNaN);
  return true;
}
