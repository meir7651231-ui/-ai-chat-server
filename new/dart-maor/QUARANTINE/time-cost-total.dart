// חוט · time-cost-total — עלות-העבודה: סכום (שעות × תעריף) של רשומות-השעתון.
// חוזה: new/atoms/time-cost-total.contract.md · מוצא: maor/src/lib/ayin.ts:109-113.
// המרה מ-JS (new/atoms/time-cost-total.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// אפס-import (רק dart-core). טהור, לא משנה קלט.
//
// הערות-המרה (JS→Dart, לפי RULES-DIGEST):
//  · המקור: `(a.time || []).reduce((t, e) => t + (+e.hours || 0) * (e.rate || 0), 0)`.
//  · `+e.hours || 0` — כפייה-מספרית-JS ואז falsy⇒0 (כלל 7+10): מחרוזת-מספרית
//    נכפית ('3'⇒3), זבל/חסר/null ⇒ NaN/0 ⇒ 0. ‏⇒ שקע `_hoursNum`.
//  · `e.rate || 0` — **בלי** unary-plus במקור! רק falsy⇒0; ערך truthy עובר
//    לכפל, ושם ToNumber: מחרוזת-מספרית ('80')⇒80, מחרוזת-זבל⇒NaN (מדביק את
//    הסכום — נאמן ל-JS). ‏⇒ שקע `_rateNum` (falsy⇒0, אחרת ToNumber, זבל⇒NaN).
//  · `a.time || []` — time חסר/null/falsy ⇒ ריק. לא-List ⇒ 0 (אין מה לסכם;
//    זהה לתקדים mat-cost-total).
num timeCostTotal(Map a) {
  final time = a['time'];
  if (time is! List) return 0;
  num total = 0;
  for (final e in time) {
    final row = e is Map ? e : const {};
    total += _hoursNum(row['hours']) * _rateNum(row['rate']);
  }
  return total;
}

// שקע `+v || 0` של JS: מספר⇒עצמו (NaN⇒0) · מחרוזת-מספרית⇒ערך · זבל/חסר/null ⇒ 0.
num _hoursNum(Object? v) {
  if (v is num) return v.isNaN ? 0 : v; // NaN||0⇒0; ‏0/-0||0⇒0 — זהה בתוצאה
  if (v is String) {
    final p = num.tryParse(v.trim());
    return (p == null || p.isNaN) ? 0 : p;
  }
  if (v is bool) return v ? 1 : 0; // +true=1, +false=0||0=0
  return 0; // null / מפתח-חסר ⇒ +v הוא 0/NaN ⇒ ||0 ⇒ 0
}

// שקע `v || 0` + ‏ToNumber-של-הכפל: falsy ⇒ 0; truthy ⇒ כפייה-מספרית,
// מחרוזת-זבל ⇒ NaN (מודבק בסכום — נאמן ל-JS, בניגוד ל-hours שיש לו ||0 אחרי +).
num _rateNum(Object? v) {
  if (v is num) return v.isNaN ? 0 : v; // NaN falsy ⇒ 0; ‏0 falsy ⇒ 0
  if (v is String) {
    if (v.isEmpty) return 0; // '' falsy ⇒ 0
    final p = num.tryParse(v.trim());
    return p ?? double.nan; // truthy-זבל ⇒ NaN בכפל
  }
  if (v is bool) return v ? 1 : 0; // false falsy⇒0; true⇒1
  return 0; // null / מפתח-חסר ⇒ falsy ⇒ 0
}
