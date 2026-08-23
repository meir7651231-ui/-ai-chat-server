/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nameIndex — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:70-75 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nameIndex, allMembers
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nameIndex(db) {
    const map = new Map();
    for (const m of allMembers(db))
        map.set(m.id, m);
    return map;
}
