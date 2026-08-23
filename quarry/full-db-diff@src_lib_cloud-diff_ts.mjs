/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fullDbDiff — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:173-183 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fullDbDiff, metaOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function fullDbDiff(db) {
    const sets = [];
    for (const col of ENTITY_COLLECTIONS) {
        for (const item of db[col]) {
            sets.push({ col, id: item.id, data: item });
        }
    }
    return { sets, deletes: [], meta: metaOf(db) };
}
/** האם ה-diff ריק — אין מה לדחוף. */
