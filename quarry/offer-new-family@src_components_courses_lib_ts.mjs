/** 🪨 טיוטת-חוט (דרגת-מחצבה) · offerNewFamily — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:531-539 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): offerNewFamily, normNameLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function offerNewFamily(families, q) {
    const t = q.trim();
    return t.length >= 2 && !families.some((f) => normNameLocal(f.name) === normNameLocal(t));
}
/**
 * פתרון המשפחה לשיבוץ-חדש: id קיים ⇒ הקיימת; '__new' ⇒ דה-דופ לפי normName —
 * שם קיים משתמש בקיימת (create=false), אחרת יש ליצור חדשה (create=true).
 */
