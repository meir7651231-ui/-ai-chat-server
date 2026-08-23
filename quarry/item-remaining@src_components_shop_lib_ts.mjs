/** 🪨 טיוטת-חוט (דרגת-מחצבה) · itemRemaining — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:87-108 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): itemRemaining, liveRedemptions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function itemRemaining(db, itemId) {
    const item = db.shopItems.find((i) => i.id === itemId);
    if (!item || item.stock === undefined)
        return null;
    let used = 0;
    for (const a of db.shopAssignments) {
        const p = db.shopProducts.find((x) => x.id === a.productId);
        if (!p)
            continue;
        for (const r of liveRedemptions(a)) {
            const c = p.components.find((x) => x.id === r.componentId);
            if (c?.itemId === itemId)
                used++;
        }
    }
    return Math.max(0, item.stock - used);
}
/* ---------- מחיר אפקטיבי ---------- */
/**
 * המחיר הסמלי אחרי הנחות קריטריונים — ההנחה **הגבוהה** מבין קריטריוני
 * המוטב (לא מצטבר — ברירת ארכיטקט, הבעלים רשאי להכריע אחרת), עיגול לש"ח
 * שלם, לעולם לא שלילי.
 */
