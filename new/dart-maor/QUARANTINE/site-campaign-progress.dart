// חוט · site-campaign-progress — התקדמות-קמפיין וספירה-לאחור של האתר-הציבורי
// (שונה מ-campaign-progress של הקופות). המרה נאמנה מ-new/atoms/site-campaign-progress.mjs
// (חוק-4: התנהגות זהה-ביט; המקור קדוש). חוזה: site-campaign-progress.contract.md
// מוצא-המקור: maor/src/lib/publicSite.ts:218-236 (‏campaignProgress).
//
// ‏nowMs מוזרק (שקע-זמן — אפס DateTime.now, טהור/בדיק). אפס-import (dart-core בלבד).
// אובייקט-JS ⇒ Map (מוסכמת-ההמרה); ‏c?.goal ⇒ גישת-Map בטוחה-null.
//
// הערות-המרה (DART-PORTING-RULES):
// - חוק-7 (truthiness): ‏`if (c?.end)` ו-`c?.currency || '₪'` ⇒ עוזר ‏_truthy
//   (‏'' ריק/0/NaN/false/null = שקר, כמו JS; ‏`??` של הטיוטה היה שוגה על '').
// - חוק-5 (slice): ‏`end.slice(0,10)` סלחן-לקצר ⇒ בדיקת-אורך לפני substring.
// - חוק-4 (תאריך-מגלגל): ‏Date.parse של V8 על 'YYYY-MM-DDT00:00:00' —
//   צורה קשיחה ‎\d{4}-\d{2}-\d{2}‎ בלבד; חודש 01–12 ויום 01–31 לקסיקלית
//   (13/00 ויום 00/32+ ⇒ NaN), אבל יום-גולש-בלוח (2026-09-31) *מתגלגל* קדימה
//   (⇒ 1.10) — אומת מול node. ‏DateTime(y,m,d) של Dart מגלגל זהה. חצות-*מקומי*
//   בשתי השפות ⇒ ההפרש חסין-אזור. תאריך-שבור ⇒ null (מקביל ל-NaN) ⇒ daysLeft null.
// - ‏Math.round/ceil/min/max של JS מחלחלים NaN ואינסוף; ‏round/ceil של Dart זורקים
//   על NaN/אינסוף ⇒ עוזרים ‏_jsRound/_jsCeil/_jsMin/_jsMax נאמני-JS.
//   (ל-x≥0 ‏Math.round(חצי-מעלה) ≡ ‏round של Dart — היחס כאן אף-פעם לא שלילי.)

/// truthiness של JS: null/false/0/-0/NaN/'' ⇒ שקר; כל השאר אמת.
bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return !(v == 0 || v.isNaN);
  if (v is String) return v.isNotEmpty;
  return true;
}

/// Math.round של JS — מחלחל NaN/אינסוף (round של Dart זורק עליהם).
num _jsRound(num x) {
  if (x is double && (x.isNaN || x.isInfinite)) return x;
  return x.round();
}

/// Math.ceil של JS — מחלחל NaN/אינסוף.
num _jsCeil(num x) {
  if (x is double && (x.isNaN || x.isInfinite)) return x;
  return x.ceil();
}

/// Math.min של JS — NaN בכל צד ⇒ NaN.
num _jsMin(num a, num b) {
  if (a.isNaN || b.isNaN) return double.nan;
  return a < b ? a : b;
}

/// Math.max של JS — NaN בכל צד ⇒ NaN.
num _jsMax(num a, num b) {
  if (a.isNaN || b.isNaN) return double.nan;
  return a > b ? a : b;
}

/// ‏Date.parse('<10-תווים>T00:00:00') של V8 — חצות-מקומי של חלק-התאריך.
/// מחזיר מילישניות-מאז-אפוך, או null (מקביל ל-NaN של JS) על צורה שבורה.
/// אומת מול node: צורה קשיחה בלבד; חודש 00/13+ ויום 00/32+ ⇒ NaN;
/// יום-גולש-בלוח (למשל 31.9) מתגלגל קדימה — DateTime של Dart מגלגל זהה.
num? _parseLocalMidnightMs(String s) {
  if (s.length != 10) return null;
  final re = RegExp(r'^\d{4}-\d{2}-\d{2}$');
  if (!re.hasMatch(s)) return null;
  final y = int.parse(s.substring(0, 4));
  final m = int.parse(s.substring(5, 7));
  final d = int.parse(s.substring(8, 10));
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return DateTime(y, m, d).millisecondsSinceEpoch; // מקומי, מגלגל-יום כמו V8
}

/// התקדמות-קמפיין של האתר-הציבורי: יעד/נאסף/אחוז-חסום-ומעוגל/מטבע/ימים-נותרו/הצגה.
/// ‏c = Map (אובייקט-הקונפיג) או null/חסר; ‏nowMs = שקע-הזמן (מילישניות).
Map<String, dynamic> campaignProgress(dynamic c, dynamic nowMs) {
  final rawGoal = c == null ? null : c['goal'];
  final rawRaised = c == null ? null : c['raised'];
  final num goal = (rawGoal is num && rawGoal > 0) ? rawGoal : 0;
  final num raised = (rawRaised is num && rawRaised > 0) ? rawRaised : 0;
  final num pct =
      goal > 0 ? _jsMax(0, _jsMin(100, _jsRound((raised / goal) * 100))) : 0;
  num? daysLeft;
  final end = c == null ? null : c['end'];
  if (_truthy(end)) {
    // חצות-מקומי של יום-היעד (חלק-התאריך בלבד) — ספירת ימים קלנדרית: מ-1.9 ל-11.9
    // = 10 (ולא 11 שנוצר מחישוב סוף-יום). עבר ⇒ 0.
    final s = end as String; // JS היה זורק TypeError על .slice של לא-מחרוזת
    final t = _parseLocalMidnightMs(s.length < 10 ? s : s.substring(0, 10));
    if (t != null) {
      final diff = _jsCeil((t - nowMs) / 86400000);
      daysLeft = diff > 0 ? diff : 0;
    }
  }
  final cur = c == null ? null : c['currency'];
  return {
    'goal': goal,
    'raised': raised,
    'pct': pct,
    'currency': _truthy(cur) ? cur : '₪',
    'daysLeft': daysLeft,
    'show': goal > 0,
  };
}
