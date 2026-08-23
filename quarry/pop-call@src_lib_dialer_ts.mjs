/** 🪨 טיוטת-חוט (דרגת-מחצבה) · popCall — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:133-147 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): popCall
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function popCall(calls) {
    if (!calls || !calls.length)
        return calls;
    return calls.slice(0, -1);
}
/** סיכום יומן-השיחות לתצוגת-החייגן. טהור, סובל undefined. */
