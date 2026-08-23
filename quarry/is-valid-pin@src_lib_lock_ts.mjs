/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isValidPin — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:68-72 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isValidPin
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isValidPin(pin) {
    return /^\d{4,8}$/.test(pin);
}
/** גיבוב הקוד ל-hex של SHA-256 (עם מלח). */
