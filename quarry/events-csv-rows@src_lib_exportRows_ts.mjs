/** 🪨 טיוטת-חוט (דרגת-מחצבה) · eventsCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportRows.ts:56-77 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): eventsCsvRows, termOf, hebDateFull, fmtD
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function eventsCsvRows(db, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const rows = [
        ['כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', T('entity.family', 'משפחה'), 'עדיפות', 'הערות', 'בוצע'],
    ];
    const evs = [...db.events].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    for (const ev of evs) {
        rows.push([
            ev.title,
            ev.customType || EV_META[ev.type].label,
            ev.date ? hebDateFull(ev.date) : '',
            fmtD(ev.date),
            ev.time || '',
            db.families.find((f) => f.id === ev.famId)?.name || '',
            PRIORITY_LABEL[ev.priority] || ev.priority,
            ev.notes || '',
            ev.done ? 'כן' : 'לא',
        ]);
    }
    return rows;
}
