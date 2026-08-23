/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sanitizeSupportText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:36-40 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sanitizeSupportText
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sanitizeSupportText(raw) {
    return (raw ?? '').replace(/\s+$/u, '').replace(/^\s+/u, '').slice(0, SUPPORT_MSG_MAX);
}
/** האם הטקסט שליח (לא-ריק אחרי ניקוי). */
