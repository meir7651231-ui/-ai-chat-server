/** חוט · ayin-all-rows — דוח כל-השמות בכרטיסי מעקב-הטיפול.
 *  חוזה: ayin-all-rows.contract.md · שקעים: unitLabel, emptyAyin, stageLabel
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:296-334 (קריאות-השכן שוקעו). */
export function ayinAllRows(cfg, supporters, unitLabel, emptyAyin, stageLabel, T) {
    const unit = unitLabel(cfg);
    const rows = [[T.k1, T.k2, T.k3, unit, T.k4, T.k5, T.k6]];
    for (const sp of supporters) {
        if (!sp.ayin)
            continue;
        const a = { ...emptyAyin(), ...sp.ayin };
        for (const n of a.names) {
            if (!n.name.trim())
                continue;
            rows.push([
                sp.name,
                sp.phone || '',
                n.name,
                n.eyes !== '' && n.eyes != null ? n.eyes : '',
                n.note || '',
                n.done ? T.k7 : T.k8,
                stageLabel(cfg, a.stage),
            ]);
        }
    }
    return rows;
}
