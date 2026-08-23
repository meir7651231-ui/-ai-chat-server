/** 🪨 טיוטת-חוט (דרגת-מחצבה) · renewTargets — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:198-206 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): renewTargets
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function renewTargets(rows) {
    return rows.filter((r) => r.decision === 'yes' && !r.renewed);
}
/**
 * טיוטת-שיבוץ טהורה לשנה הבאה — מעתיקה מסלול/קבוצה/תמחור מהמקור, מאפסת היסטוריה
 * (used/purchased/presents/absences/payments) ומסמנת פעיל מהיום. ה-id מוזרק
 * מבחוץ (nextId ב-store). אינה נוגעת ב-receiptSeq/כספים.
 */
