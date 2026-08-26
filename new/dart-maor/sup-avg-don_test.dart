import 'sup-avg-don.dart';

// שקעי-הבדיקה כמוגדר בחוזה (סמנטיקת-המקור המצומצמת לדוגמאות)
num _totIls(dynamic sp, dynamic r) =>
    (sp['ils'] ?? 0) + (sp['usd'] ?? 0) * (r as num);
num _cnt(dynamic sp) => sp['count'] ?? 0;

void main() {
  // 1) ממוצע בסיסי
  assert(supAvgDon([
        {'ils': 400, 'count': 2},
        {'ils': 200, 'count': 1}
      ], _totIls, _cnt, 3.7) ==
      200);
  // 2) עיגול-מטה
  assert(supAvgDon([
        {'ils': 1000, 'count': 3}
      ], _totIls, _cnt, 3.7) ==
      333);
  // 3) עיגול-מעלה
  assert(supAvgDon([
        {'ils': 500, 'count': 3}
      ], _totIls, _cnt, 3.7) ==
      167);
  // 4) אפס תרומות ⇒ null
  assert(supAvgDon([
        {'ils': 0, 'count': 0},
        {'ils': 0, 'count': 0}
      ], _totIls, _cnt, 3.7) ==
      null);
  // 5) השער זורם לשקע
  assert(supAvgDon([
        {'ils': 100, 'usd': 100, 'count': 1}
      ], _totIls, _cnt, 4) ==
      500);
  // 6) ברירת-מחדל rate=3.7 (אי-העברת rate)
  assert(supAvgDon([
        {'ils': 0, 'usd': 10, 'count': 1}
      ], _totIls, _cnt) ==
      37);

  // 7) 🔧 ratchet-הסגר: ‏Math.round(-0.4) ⇒ ‏-0 (שימור-סימן-שלילי).
  //    שקע-שווי שמחזיר -0.4 לתורם יחיד עם count=1 ⇒ round(-0.4) = -0.
  final r7 = supAvgDon([
    {'v': -0.4}
  ], (dynamic sp, dynamic r) => sp['v'] as num, (dynamic sp) => 1);
  assert(r7 == 0); // -0 == 0 ערכית
  assert((r7 as double).isNegative); // אך הסימן שלילי — כמו JS ‎-0‎

  // 8) גבול-הטווח ‏-0.5 ⇒ גם-כן ‎-0‎ (חצי-כלפי-‎+∞‎ עם שימור-סימן).
  final r8 = supAvgDon([
    {'v': -0.5}
  ], (dynamic sp, dynamic r) => sp['v'] as num, (dynamic sp) => 1);
  assert(r8 == 0);
  assert((r8 as double).isNegative);

  print('✓ sup-avg-don: 8 בדיקות (6 חוזה + 2 ratchet ‎-0‎) — ירוק');
}
