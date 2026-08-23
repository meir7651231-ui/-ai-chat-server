/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinAllRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:296-334 (39 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinAllRows, unitLabel, emptyAyin, stageLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinAllRows(cfg, supporters) {
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
/** כל השמות בכרטיסי מעקב-הטיפול — אותה סמנטיקה כמו ayinAllRows (שם ריק מדולג). */
