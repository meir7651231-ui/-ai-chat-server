/** 🪨 טיוטת-חוט (דרגת-מחצבה) · statusLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:21-24 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): statusLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function statusLabel(status) {
    return status === 'pickup' ? 'איסוף' : status === 'enroute' ? 'בדרך' : 'נמסר';
}
