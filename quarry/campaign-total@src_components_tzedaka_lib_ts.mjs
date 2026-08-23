/** 🪨 טיוטת-חוט (דרגת-מחצבה) · campaignTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:68-76 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): campaignTotal, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function campaignTotal(boxes, campaignId) {
    let sum = 0;
    for (const b of boxes)
        for (const c of b.collections)
            if (c.campaignId === campaignId)
                sum += Number.isFinite(c.amount) ? c.amount : 0;
    return sum;
}
/* ---------- דורש טיפול ---------- */
