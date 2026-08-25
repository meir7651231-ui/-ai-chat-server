// חוט · time-hours-total — סה"כ שעות בשעתון: סכום `hours` על רשומות `a.time`.
// חוזה: new/atoms/time-hours-total.contract.md · מוצא: maor/src/lib/ayin.ts:104-106.
// המרה מ-JS (new/atoms/time-hours-total.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// אפס-import (רק dart-core). טהור, לא משנה קלט.
//
// הערות-המרה (JS→Dart, לפי DART-PORTING-RULES; תבנית-אחות: mat-cost-total):
//  · המקור: `(a.time || []).reduce((t, e) => t + (+e.hours || 0), 0)`.
//  · JS `+v`: מספר→עצמו · מחרוזת-מספרית→ערך · מחרוזת-זבל/undefined→NaN · null→0.
//    ואז `|| 0` הופך כל falsy (NaN/0/-0) ל-0. ⇒ _num מחקה: num.tryParse (כלל 10),
//    כשל-פרסור/NaN ⇒ 0; null ו-מפתח-חסר ⇒ 0.
//  · `a.time || []` — time חסר/null ⇒ ריק. כאן: לא-List ⇒ 0 (אין מה לסכם).
num timeHoursTotal(Map a) {
  final time = a['time'];
  if (time is! List) return 0;
  num total = 0;
  for (final e in time) {
    final row = e is Map ? e : const {};
    total += _num(row['hours']);
  }
  return total;
}

// שקע-כפיית-מספר: מחקה את `+v || 0` של JS (מחרוזת-מספרית נספרת, זבל/חסר/null ⇒ 0).
num _num(Object? v) {
  if (v is num) return v; // 0 || 0 == 0 — אין הבדל בתוצאה
  if (v is String) {
    final p = num.tryParse(v);
    return p == null ? 0 : p;
  }
  return 0; // null / מפתח-חסר / טיפוס-אחר ⇒ +v הוא 0 או NaN, ואז ||0 ⇒ 0
}
