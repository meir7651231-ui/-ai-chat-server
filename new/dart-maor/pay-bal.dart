// ⚛️ אטום-Dart (דרגת-חוזה) · payBal — יתרת-חוב על שיבוץ-חוג (לעולם לא שלילית).
// מוצא: maor/src/components/courses/lib.ts:309-311 · המקור: new/atoms/pay-bal.mjs
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק dart:math). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// תפקיד: max(0, (e.totalDue || 0) − paidOf(e)) — סה"כ העסקה פחות מה ששולם, נקטם ל-0.
// שקע (חוק-1 — קריאה-לשכן הוזרקה כפרמטר): paidOf(e) → num (סכום e.payments; שכן paidOf במקור).
//        האטום קורא לו פעם-אחת על אותו e.
// קלט: e — שיבוץ (Map, שדה totalDue?) · השקע paidOf. פלט: num ≥ 0.
//
// הערות-המרה (מקור→Dart — מה שמנוע-ה-AST פספס; DART-PORTING-RULES מיושם מראש):
//  · הטיוטה פלטה `dynamic payBal(dynamic e, dynamic paidOf) => max(0, (e.totalDue ?? 0) - paidOf(e))`.
//  · אובייקט-JS e ⇒ Map<String, Object?>; גישת-שדה e.totalDue ⇒ e['totalDue'] (getter-אמת לא עובד על Map).
//  · **truthiness (כלל 7)** של המקור `e.totalDue || 0`: falsy (null/חסר/0/NaN) ⇒ 0. הטיוטה
//    השתמשה ב-`?? 0` (null-coalescing) שאינו זהה ל-`||` (0/NaN היו דולפים) — תוקן
//    לבדיקת-truthy מפורשת (num חוקי ולא-אפס ולא-NaN, אחרת 0).
//  · Math.max ⇒ dart:math max (הטיוטה קראה ל-max בלי import — תוקן).
//  · אין locale/פורמט/getMonth/מוטביליות מעורבים באטום זה.

import 'dart:math';

/// יתרת-חוב על שיבוץ. התנהגות ביט-זהה למקור-ה-JS `payBal`.
/// `paidOf` הוא שקע-מוזרק שמחזיר את סך-ששולם על אותו שיבוץ.
num payBal(Map<String, Object?> e, num Function(Map<String, Object?>) paidOf) {
  final t = e['totalDue'];
  // מקבילה נאמנה ל-JS `e.totalDue || 0`: רק num-חוקי-ולא-אפס עובר, השאר ⇒ 0.
  final num due = (t is num && !t.isNaN && t != 0) ? t : 0;
  return max(0, due - paidOf(e));
}
