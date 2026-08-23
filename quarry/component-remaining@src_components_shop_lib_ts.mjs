/** 🪨 טיוטת-חוט (דרגת-מחצבה) · componentRemaining — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:200-220 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): componentRemaining, liveRedemptions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function componentRemaining(componentId, productId, assignments, stock) {
    if (stock === undefined)
        return null;
    let used = 0;
    for (const a of assignments) {
        if (a.productId !== productId)
            continue;
        for (const r of liveRedemptions(a))
            if (r.componentId === componentId)
                used++;
    }
    return Math.max(0, stock - used);
}
/* ---------- תוקף קופונים ---------- */
/**
 * תאריך פקיעת קופון — '' כשאין validDays (או 0) או שאין לשיוך since.
 * הפקיעה = since + validDays; יום הגבול עצמו עדיין בתוקף (פג רק למחרת).
 */
