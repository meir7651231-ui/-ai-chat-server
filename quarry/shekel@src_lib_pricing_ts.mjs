/** 🪨 טיוטת-חוט (דרגת-מחצבה) · shekel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pricing.ts:188-194 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): shekel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function shekel(n) {
    return '₪' + Math.round(n).toLocaleString('he-IL');
}
const PRICES_LS_KEY = 'maor_prices';
/** קריאת טבלת-המחירים השמורה (מכשיר-המטמיע), או ברירת-המחדל. */
