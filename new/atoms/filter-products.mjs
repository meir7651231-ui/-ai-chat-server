/** חוט · filter-products — סינון חבילות-הקטלוג (שם/תיאור, פעילות-בלבד רשות).
 *  חוזה: filter-products.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:538-546 (תורגם TS→JS);
 *  השכן smartFilter הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function filterProducts(products, q, onlyActive, smartFilter) {
    const base = onlyActive ? products.filter((p) => p.active) : [...products];
    return smartFilter(q, base, (p) => [p.name, p.desc]);
}
