/** 🪨 טיוטת-חוט (דרגת-מחצבה) · componentCounts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:691-696 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): componentCounts
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function componentCounts(p) {
    const out = { meeting: 0, coupon: 0, gift: 0, holidayGift: 0 };
    for (const c of p.components)
        out[c.kind]++;
    return out;
}
