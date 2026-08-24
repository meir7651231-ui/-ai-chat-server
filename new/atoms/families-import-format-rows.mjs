/** חוט · families-import-format-rows — משפחות בפורמט ייבוא 13 העמודות.
 *  חוזה: families-import-format-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/exportRows.ts:33-46 (תורגם TS→JS). */
export function familiesImportFormatRows(db) {
    const rows = [
        ['שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון 2', 'עיר', 'כתובת', '', 'אלמן', 'קהילה', '', 'הערות'],
    ];
    for (const f of db.families) {
        rows.push([
            f.name, f.fatherId, f.phone, f.mother, f.motherId, f.phone2, f.city, f.address, '',
            (f.maritalStatus || '').includes('אלמן') ? 'אלמן' : '', f.community, '', f.notes,
        ]);
    }
    return rows;
}
