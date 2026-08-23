/** 🪨 טיוטת-חוט (דרגת-מחצבה) · effectivePrice — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:109-115 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): effectivePrice, maxDiscountPct, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function effectivePrice(basePrice, criterionIds, criteria) {
    const pct = maxDiscountPct(criterionIds, criteria);
    const base = Number.isFinite(basePrice) ? basePrice : 0;
    return Math.max(0, Math.round(base * (1 - pct / 100)));
}
/** אחוז ההנחה האפקטיבי — הגבוה מבין קריטריוני המוטב (0 כשאין). */
