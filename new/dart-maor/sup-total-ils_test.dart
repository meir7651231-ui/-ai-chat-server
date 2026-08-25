/// בדיקת חוט · sup-total-ils (Dart) — כל 5 דוגמאות-החוזה (= בדיקת-ה-JS
/// new/atoms/sup-total-ils.test.mjs ביט-אחר-ביט) + נאמנות-JS נוספת.
/// שקעי-הבדיקה כמוגדר בחוזה: ‏supIls=(sp)⇒sp.ils||0 · ‏supUsd=(sp)⇒sp.usd||0
/// (ה-`||` של JS ⇒ עוזר-falsy מפורש). הפלט סקלרי ⇒ שוויון ישיר (חוק-8 על
/// מערכים אינו חל). כשל ⇒ StateError.
/// הרצה: dart run --enable-asserts new/dart-maor/sup-total-ils_test.dart ⇒ OK
import 'sup-total-ils.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

/// falsy של JS: undefined/null · false · 0/-0/NaN · ''.
bool _falsy(dynamic v) =>
    v == null || v == false || (v is num && (v == 0 || v.isNaN)) || v == '';

// ‏(sp) => sp.ils || 0 — שקע-השקלים מהחוזה (מפתח-חסר ⇒ null ≈ undefined).
dynamic _supIls(dynamic sp) {
  final v = (sp as Map)['ils'];
  return _falsy(v) ? 0 : v;
}

// ‏(sp) => sp.usd || 0 — שקע-הדולרים מהחוזה.
dynamic _supUsd(dynamic sp) {
  final v = (sp as Map)['usd'];
  return _falsy(v) ? 0 : v;
}

void main() {
  // rate מושמט = ה-undefined של בדיקת-ה-JS ⇒ ברירת-המחדל 3.7 של האטום.
  dynamic tot(Map sp) => supTotalIls(sp, supIls: _supIls, supUsd: _supUsd);
  dynamic totR(Map sp, dynamic rate) =>
      supTotalIls(sp, rate: rate, supIls: _supIls, supUsd: _supUsd);

  // 1) ₪ בלבד — השער לא משנה.
  ok(totR({'ils': 100}, 3.7) == 100, 'דוגמה 1: ≠ 100');
  // 2) ברירת-מחדל rate=3.7 (‏rate לא הועבר — undefined ב-JS).
  ok(tot({'usd': 10}) == 37, 'דוגמה 2: ≠ 37');
  // 3) שער מפורש: 100 + 100×4 = 500.
  ok(totR({'ils': 100, 'usd': 100}, 4) == 500, 'דוגמה 3: ≠ 500');
  // 4) תורם ריק.
  ok(totR(<String, dynamic>{}, 3.7) == 0, 'דוגמה 4: ≠ 0');
  // 5) לא מעוגל: 250 + 2×3.7 = 257.4.
  ok(totR({'ils': 250, 'usd': 2}, 3.7) == 257.4, 'דוגמה 5: ≠ 257.4');

  // — נאמנות-JS נוספת (מגזרת המקור; לא מרחיבה את החוזה) —
  // חוק-2: rate:null מפורש ≠ השמטה ⇒ ‏ToNumber(null)=0 ⇒ ענף-הדולר מתאפס.
  ok(totR({'ils': 100, 'usd': 50}, null) == 100, 'rate:null ⇒ ≠ 100');
  // חוק-15: rate מחרוזת ⇒ ‏ToNumber ('4' ⇒ 4).
  ok(totR({'ils': 100, 'usd': 100}, '4') == 500, "rate:'4' ⇒ ≠ 500");
  // רווחים-רגילים נגזמים כמו-JS: ‏Number(' 3.7 ') = 3.7.
  ok(totR({'usd': 10}, ' 3.7 ') == 37, "rate:' 3.7 ' ⇒ ≠ 37");
  // חוקים 16/18: ‏NEL (U+0085) אינו רווח-ES ⇒ ‏Number('3.7␅')=NaN ⇒ תוצאה NaN
  // (‏tryParse של Dart היה גוזם אותו — הדקדוק-הקפדני חוסם).
  final dynamic nel = totR({'usd': 10}, '3.7' + String.fromCharCode(0x85));
  ok(nel is double && nel.isNaN, 'rate עם NEL ⇒ ≠ NaN');
  // חוק-17: אריתמטיקת float64 — ‏0.1 + 0.2×1 של JS.
  ok(totR({'ils': 0.1, 'usd': 0.2}, 1) == 0.30000000000000004,
      'float64: ≠ 0.30000000000000004');

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(totR({'ils': 100}, 3.7) == 100, 'assert-live guard');

  print('OK supTotalIls: 5 דוגמאות-חוזה + 5 נאמנות-JS — ירוק');
}
