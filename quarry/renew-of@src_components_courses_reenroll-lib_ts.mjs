/** 🪨 טיוטת-חוט (דרגת-מחצבה) · renewOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:47-51 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): renewOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function renewOf(e) {
    return e.renew ?? '';
}
/** האם השיבוץ כבר נרשם לשנה הבאה (יש קישור לשיבוץ-היעד). */
