/** 🪨 טיוטת-חוט (דרגת-מחצבה) · familiesImportFormatRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportRows.ts:33-46 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): familiesImportFormatRows
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
/** תומכות בפורמט ייבוא 7 העמודות של SupporterImport (הצלבה לפי שם). */
