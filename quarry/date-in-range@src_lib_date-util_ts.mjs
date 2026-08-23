/** 🪨 טיוטת-חוט (דרגת-מחצבה) · dateInRange — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/date-util.ts:30-33 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): dateInRange
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function dateInRange(iso, fromIso, toIso) {
    return (!fromIso || iso >= fromIso) && (!toIso || iso <= toIso);
}
