// 🧪 בדיקת-אטום · frictionFactor — מוכיחה בדיוק את דוגמאות-החוזה (חוק-4, דיבר 12).
// מייבאת אך ורק את האטום-שלה (חוק-4): friction_factor.dart. שום אטום אחר.
// pow025 המוזרק כאן = מימוש-Newton verbatim מהמקור (pressure_drop.dart:327-341) —
//   כדי שהענף הטורבולנטי ישוחזר ביט-בביט (כולל חוסר-הדיוק המכוון של Newton-5).
// הרצה: dart run --enable-asserts friction_factor_test.dart  ⇒  exit 0.

import 'friction_factor.dart';

// --- מימוש-השקע verbatim מהמקור (לצורך הבדיקה בלבד; לא אטום מיובא) ---
double _srcSqrt(double x) {
  // Newton's method, 5 iterations — verbatim pressure_drop.dart:334-341.
  var r = x / 2;
  for (var i = 0; i < 5; i++) {
    r = 0.5 * (r + x / r);
  }
  return r;
}

double _srcPow025(double x) {
  // verbatim pressure_drop.dart:327-332.
  final s = x > 0 ? x : 1e-9;
  final r1 = _srcSqrt(s);
  return _srcSqrt(r1);
}

// מונה-קריאות — מוכיח ש-pow025 לא נקרא בענפים 1–2 (עדשה-עוינת).
int _pow025Calls = 0;
double _countingPow025(double x) {
  _pow025Calls++;
  return _srcPow025(x);
}

void _eq(double got, double want, String label) {
  if (got != want) {
    throw StateError('❌ $label: got=$got  want=$want');
  }
}

void main() {
  // ── ענף 1: reynolds < 100 ⇒ 0.64 (כולל 0 ושלילי — pow025 לא נקרא) ──
  _pow025Calls = 0;
  _eq(frictionFactor(50.0, pow025: _countingPow025), 0.64, 'Re=50');
  _eq(frictionFactor(0.0, pow025: _countingPow025), 0.64, 'Re=0 (edge)');
  _eq(frictionFactor(-5.0, pow025: _countingPow025), 0.64, 'Re=-5 (negative edge)');
  _eq(frictionFactor(99.999, pow025: _countingPow025), 0.64, 'Re=99.999');

  // ── ענף 2: 100 ≤ reynolds < 2300 ⇒ 64/Re (pow025 עדיין לא נקרא) ──
  _eq(frictionFactor(100.0, pow025: _countingPow025), 0.64, 'Re=100 (threshold ⇒ 64/100)');
  _eq(frictionFactor(1000.0, pow025: _countingPow025), 0.064, 'Re=1000');
  _eq(frictionFactor(2000.0, pow025: _countingPow025), 0.032, 'Re=2000');
  _eq(frictionFactor(2299.999, pow025: _countingPow025),
      0.02782609905482568, 'Re=2299.999 (just laminar)');

  // עדשה-עוינת: עד כאן pow025 לא נקרא ולו פעם אחת.
  assert(_pow025Calls == 0,
      'pow025 must NOT be called on branches 1–2 (got $_pow025Calls calls)');

  // ── ענף 3: reynolds ≥ 2300 ⇒ 0.316 / pow025(Re) (Blasius) ──
  _eq(frictionFactor(2300.0, pow025: _srcPow025),
      0.04257426326393983, 'Re=2300 (Blasius threshold)');
  _eq(frictionFactor(5000.0, pow025: _srcPow025),
      0.03186200857405711, 'Re=5000');
  _eq(frictionFactor(10000.0, pow025: _srcPow025),
      0.023748791125411388, 'Re=10000');
  _eq(frictionFactor(100000.0, pow025: _srcPow025),
      0.007329733454851802, 'Re=100000');

  // אי-הרציפות ב-2300 נשמרה: הקפיצה מ-≈0.02783 ל-≈0.04257 (חוק-4).
  final justBelow = frictionFactor(2299.999, pow025: _srcPow025);
  final atThreshold = frictionFactor(2300.0, pow025: _srcPow025);
  assert(atThreshold > justBelow,
      'discontinuity at Re=2300 must persist: $atThreshold vs $justBelow');

  // ── ענף 3 נקרא pow025 (שקע-מוזרק פעיל) ──
  _pow025Calls = 0;
  frictionFactor(10000.0, pow025: _countingPow025);
  assert(_pow025Calls == 1,
      'pow025 must be called exactly once on turbulent branch (got $_pow025Calls)');

  print('✅ frictionFactor — 13/13 חוזה-דוגמאות ירוקות · '
      'שקע-pow025 מוזרק · אי-רציפות-2300 נשמרה · עדשה-עוינת (0/-5) עברה.');
}
