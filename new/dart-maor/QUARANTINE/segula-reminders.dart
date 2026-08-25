// ⚛️ אטום-Dart (דרגת-חוזה) · segulaReminders — תזכורות-סגולה מדורגות מתאריך-התחלה.
// מוצא: maor/src/components/supporters/lib.ts:324-337 · המקור: new/atoms/segula-reminders.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core). חוק-4 — התנהגות זהה-ביט
//        למקור-ה-JS. ברירת-המחדל של הדילוגים מוטבעת (זהה ל-segula-offsets, בלי import — חוק-1).
//
// תפקיד: כל דילוג N ⇒ תאריך-ההתחלה + N ימים (ISO); הדילוג הגדול ביותר מסומן final:true.
//
// הערות-המרה (מקור→Dart — הנקודות שמנוע-ה-AST פספס):
//  • `new Date(startIso+'T12:00:00')` → `DateTime.parse('${startIso}T12:00:00')`
//    (עוגן-צהריים מקומי — נמנעת גלישת-יום סביב DST, כמו במקור).
//  • `d.setDate(d.getDate()+day)` = חשבון-לוח מנרמל של JS ⇒ בנאי-DateTime מנרמל:
//    `DateTime(y, m, day + N, 12)` — גלישה מעבר לסוף-חודש מתגלגלת לחודש-הבא, זהה ל-setDate.
//    ‏setDate של JS חותך שבר לכיוון-אפס (ToIntegerOrInfinity) ⇒ `n.truncate()`.
//  • `Math.max(...offsets)`: מערך-ריק ⇒ ‎-Infinity (אין איבר שישווה); NaN באחד-הדילוגים ⇒
//    ‏NaN ⇒ `day === max` תמיד false. משוחזר ידנית (reduce עם `>` היה בולע NaN).
//  • `String(x).padStart(2,'0')` → `x.toString().padLeft(2, '0')`; `getMonth()+1` ≡ `d.month`.
//  • `day === max`: ב-Dart ‏`num ==` בין int ל-double שווה-ערך (40 == 40.0) — תואם JS.
//  • ברירת-מחדל-פרמטר: Dart דורש קבוע ⇒ `offsets == null` נופל למוטבע (undefined-JS ≡ השמטה).

dynamic segulaReminders(dynamic startIso, [dynamic offsets]) {
  final List offs =
      offsets == null ? const [1, 7, 21, 35, 40] : (offsets as List);
  final base = DateTime.parse('${startIso}T12:00:00');
  // Math.max(...offsets): ריק ⇒ -Infinity; NaN ⇒ NaN (ואז final=false לכולם).
  num mx = double.negativeInfinity;
  for (final o in offs) {
    final n = o as num;
    if (n.isNaN) {
      mx = double.nan;
      break;
    }
    if (n > mx) mx = n;
  }
  final out = <Map<String, dynamic>>[];
  for (final o in offs) {
    final n = o as num;
    final d = DateTime(base.year, base.month, base.day + n.truncate(), 12);
    final m = d.month.toString().padLeft(2, '0');
    final dd = d.day.toString().padLeft(2, '0');
    out.add({'day': o, 'date': '${d.year}-$m-$dd', 'final': o == mx});
  }
  return out;
}
