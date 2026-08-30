/** חוט · delivery-list-lines — שורות תדפיס יום-חלוקה מקובצות פר-מתנדב.
 *  חוזה: delivery-list-lines.contract.md · שקע: statusLabel
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:86-113 (קריאת-השכן שוקעה). */
export function deliveryListLines(rows, statusLabel, T) {
    const byVol = new Map();
    for (const r of rows) {
        const arr = byVol.get(r.volunteerName) ?? [];
        arr.push(r);
        byVol.set(r.volunteerName, arr);
    }
    const out = [];
    for (const [volName, list] of byVol) {
        out.push(`🦺 ${volName} (${list.length}${T.k1}`);
        for (const r of list) {
            out.push(`  • ${r.familyName} · ${statusLabel(r.status)}` +
                (r.address ? ' · 📍 ' + r.address : '') +
                (r.note ? ' · ' + r.note : ''));
        }
    }
    return out;
}
