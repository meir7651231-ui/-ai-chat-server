/** חוט · attach-charges-bulk — חיבור-אצווה של עסקאות לכרטיסים (דדופ-גלובלי מתעדכן, C2+C10).
 *  חוזה: attach-charges-bulk.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:449-540 (תורגם TS→JS); השכנים
 *  histDedupKey/chargeDedupKey/chargeToHist/fillCardFromCharge/withNedarimHok
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function attachChargesBulk(supporters, items, histDedupKey, chargeDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok) {
    const byId = new Map(supporters.map((s, i) => [s.id, i]));
    const next = supporters.slice();
    // 🐛 נחיל-סולה C2 (HIGH): דדופ **גלובלי** — מפתח שכבר יושב על כרטיס כלשהו
    // (או שנוסף במהלך האצווה) לא נרשם שוב בשום כרטיס אחר.
    const globalKeys = new Set();
    for (const s of supporters)
        for (const h of s.hist ?? []) {
            const k = histDedupKey(h);
            if (k)
                globalKeys.add(k);
        }
    let added = 0;
    for (const { supId, charge } of items) {
        const idx = byId.get(supId);
        if (idx == null)
            continue;
        if (!charge.amount)
            continue; // 🐛 C10: ביטול (amount=0) אינו כסף
        const key = chargeDedupKey(charge);
        if (key && globalKeys.has(key))
            continue;
        if (key)
            globalKeys.add(key);
        next[idx] = withNedarimHok(fillCardFromCharge({ ...next[idx], hist: [...(next[idx].hist || []), chargeToHist(charge)] }, charge), charge);
        added++;
    }
    return { supporters: next, added };
}
