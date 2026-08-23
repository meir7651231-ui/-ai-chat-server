/** 🪨 טיוטת-חוט (דרגת-מחצבה) · monthHeOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:42-46 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): monthHeOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function monthHeOf(en) {
    return MONTHS.find((m) => m[0] === en)?.[1] ?? '';
}
/** שם Intl של חודש לפי תווית עברית ('אב' → 'Av'), או null אם לא מוכר. */
