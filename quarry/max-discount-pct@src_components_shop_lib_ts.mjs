/** 🪨 טיוטת-חוט (דרגת-מחצבה) · maxDiscountPct — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:116-130 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): maxDiscountPct, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function maxDiscountPct(criterionIds, criteria) {
    let pct = 0;
    for (const id of criterionIds) {
        const c = criteria.find((x) => x.id === id);
        if (c && Number.isFinite(c.discountPct) && c.discountPct > pct)
            pct = c.discountPct;
    }
    return Math.min(100, Math.max(0, pct));
}
/* ---------- חגים קרובים ---------- */
/**
 * החגים בטווח הימים הקרוב — סריקה יום-יום עם holidayOf; שם-חג ייחודי
 * (חג רב-ימי מוחזר ביומו הראשון בטווח).
 */
