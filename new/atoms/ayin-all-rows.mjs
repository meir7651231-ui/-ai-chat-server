/** חוט · ayin-all-rows — דוח כל-השמות בכרטיסי מעקב-הטיפול.
 *  חוזה: ayin-all-rows.contract.md · שקעים: unitLabel, emptyAyin, stageLabel
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:296-334 (קריאות-השכן שוקעו). */
export function ayinAllRows(cfg, supporters, unitLabel, emptyAyin, stageLabel) {
    const unit = unitLabel(cfg);
    const rows = [['תורם/ת', 'טלפון', 'שם', unit, 'הערה', 'סטטוס', 'שלב']];
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
                n.done ? 'טופל ✓' : 'ממתין',
                stageLabel(cfg, a.stage),
            ]);
        }
    }
    return rows;
}
