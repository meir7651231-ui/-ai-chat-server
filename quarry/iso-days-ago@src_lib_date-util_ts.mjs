/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoDaysAgo — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/date-util.ts:20-29 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoDaysAgo, setDate, getDate, isoLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return isoLocal(d);
}
/**
 * האם תאריך ISO בטווח כוללני — קצה ריק = פתוח (UX סינון 3; ה-helper
 * המשותף לסינוני-ההיסטוריה של הקופות והחנות — בלי כפל לוגיקה).
 */
