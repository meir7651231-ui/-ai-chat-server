/** 🪨 טיוטת-חוט (דרגת-מחצבה) · monthLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:64-69 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): monthLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function monthLabel(key) {
    const [y, m] = key.split('-');
    return `${m}/${y}`;
}
/** אינדקס בן-משפחה לפי מזהה — שם + שם משפחה. */
