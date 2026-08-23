/** 🪨 טיוטת-חוט (דרגת-מחצבה) · exportAllowed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportGate.ts:25-32 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): exportAllowed
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function exportAllowed() {
    return !blocked;
}
/**
 * שער לפני כל נתיב-יציאה: מחזיר true אם מותר. אם חסום — מריץ את ההתרעה
 * (toast) ומחזיר false, כדי שהקורא יעצור בלי להוריד/להדפיס דבר.
 */
