/** 🪨 טיוטת-חוט (דרגת-מחצבה) · encryptExistingCloud — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:481-489 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): encryptExistingCloud, pushDiff, fullDbDiff, supKeyMapOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function encryptExistingCloud(db, dek) {
    // אכיפת-נתונים: אם דלוקה, גם מיגרציית-ההצפנה שומרת skey על אוספים-נאכפים.
    await pushDiff(fullDbDiff(db), dek, supKeyMapOf(db.supporters));
}
/**
 * משיכת כל הנתונים מהענן והרכבת Db תקין דרך persist.migrate.
 * null = פרויקט ריק (אין מסמך meta/org). ענן קיים אך פגום → זריקה (לא נדרוס).
 */
