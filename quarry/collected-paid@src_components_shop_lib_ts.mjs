/** 🪨 טיוטת-חוט (דרגת-מחצבה) · collectedPaid — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:440-446 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): collectedPaid, liveRedemptions, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function collectedPaid(assignments) {
    let sum = 0;
    for (const a of assignments)
        for (const r of liveRedemptions(a))
            sum += Number.isFinite(r.paid) ? r.paid : 0;
    return sum;
}
/** הסבסוד הכולל — שווי שנמסר פחות מה ששולם. */
