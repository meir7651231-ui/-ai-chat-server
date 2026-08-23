/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterProducts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:538-550 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterProducts, smartFilter
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterProducts(products, q, onlyActive) {
    const base = onlyActive ? products.filter((p) => p.active) : [...products];
    return smartFilter(q, base, (p) => [p.name, p.desc]);
}
/**
 * סינון הפריטים — q על השם; מצב מלאי: out=אזל · low=נמוך (≤2, כשיש מעקב)
 * · untracked=ללא מעקב.
 */
