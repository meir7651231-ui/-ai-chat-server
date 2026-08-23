/** 🪨 טיוטת-חוט (דרגת-מחצבה) · redemptionsCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:656-680 (25 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): redemptionsCsvRows, beneficiaryLabel, itemOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function redemptionsCsvRows(db, config) {
    const rows = [['תאריך', 'מוטב', 'פריט', 'חבילה', 'שולם', 'שווי', 'אישור', 'מבוטל']];
    for (const a of db.shopAssignments) {
        const product = db.shopProducts.find((p) => p.id === a.productId);
        const who = beneficiaryLabel(db, a, config);
        for (const r of a.redemptions) {
            const comp = product?.components.find((c) => c.id === r.componentId);
            rows.push([
                r.date,
                who,
                comp ? itemOf(db, comp).name : '',
                product?.name ?? '',
                r.paid,
                r.value,
                r.rid ?? '',
                r.voidedAt ? 'בוטל ב-' + r.voidedAt : '',
            ]);
        }
    }
    return rows;
}
/* ---------- תוויות ---------- */
/** "משפחת X — שם הבן/בת" (בלי בן/בת ספציפי/ת — שם המשפחה בלבד). */
