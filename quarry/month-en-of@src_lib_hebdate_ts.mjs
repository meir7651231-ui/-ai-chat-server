/** 🪨 טיוטת-חוט (דרגת-מחצבה) · monthEnOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:47-51 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): monthEnOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function monthEnOf(he) {
    return MONTHS.find((m) => m[1] === he)?.[0] ?? null;
}
/** השנה העברית הנוכחית (למשל 5786). */
