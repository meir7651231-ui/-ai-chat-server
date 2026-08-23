/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pushRecent — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/navhist.ts:34-37 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pushRecent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pushRecent(ids, id) {
    return [id, ...ids.filter((x) => x !== id)].slice(0, RECENT_MAX);
}
