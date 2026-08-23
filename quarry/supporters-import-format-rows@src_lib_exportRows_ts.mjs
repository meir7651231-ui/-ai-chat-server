/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supportersImportFormatRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportRows.ts:47-55 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supportersImportFormatRows
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supportersImportFormatRows(db) {
    const rows = [['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור']];
    for (const sp of db.supporters) {
        rows.push([sp.name, sp.phone, sp.email, sp.idNum, sp.address, sp.cat, sp.forWho]);
    }
    return rows;
}
/** שורות ייצוא האירועים — כותרת + שורה לכל אירוע, ממוינות לפי תאריך. */
