/** חוט · families-import-format-rows — משפחות בפורמט ייבוא 13 העמודות.
 *  חוזה: families-import-format-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/exportRows.ts:33-46 (תורגם TS→JS). */
export function familiesImportFormatRows(db, T) {
    const rows = [
        [T.k1, T.k2, T.k3, T.k4, T.k5, T.k6, T.k7, T.k8, '', T.k9, T.k10, '', T.k11],
    ];
    for (const f of db.families) {
        rows.push([
            f.name, f.fatherId, f.phone, f.mother, f.motherId, f.phone2, f.city, f.address, '',
            (f.maritalStatus || '').includes(T.k9) ? T.k9 : '', f.community, '', f.notes,
        ]);
    }
    return rows;
}
