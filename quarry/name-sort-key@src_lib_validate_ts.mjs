/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nameSortKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/validate.ts:85-91 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nameSortKey, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nameSortKey(t) {
    const tokens = normSearch(t)
        .split(/\s+/)
        .filter((w) => w && !NAME_TITLES.has(w));
    return tokens.slice().sort().join(' ');
}
