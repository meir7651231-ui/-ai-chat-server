/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pad2 — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:34-38 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pad2
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pad2(n) {
    return String(n).padStart(2, '0');
}
/** "HH:MM" → דקות מחצות; מחרוזת לא תקינה → NaN. */
