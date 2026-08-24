/** חוט · count-by — ספירה לפי מפתח, ממוין מהגדול לקטן. חוזה: count-by.contract.md
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:83-91. */
export function countBy(items, key) {
    const m = new Map();
    for (const it of items) {
        const k = key(it);
        m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
