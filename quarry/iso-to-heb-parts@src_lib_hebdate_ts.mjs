/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoToHebParts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:107-124 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoToHebParts, isNaN, getTime, hebParts, monthHeOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoToHebParts(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso))
        return null;
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime()))
        return null;
    const p = hebParts(d);
    const monthHe = monthHeOf(p.month);
    if (!monthHe || !p.day || !p.year)
        return null;
    return { day: p.day, monthHe, year: p.year };
}
/**
 * ולידציית-ריצה (ANALYSIS §5 בינוני #2): כל המערכת נשענת על שמות-החודשים
 * האנגליים ש-Intl (לוח 'hebrew') מפיק ('Tishri','Kislev'…). שינוי איות ב-CLDR
 * בעדכון-דפדפן עתידי ישבור המרות-תאריך **בשקט**. הפונקציה סורקת שנה עברית ומחזירה
 * שמות-חודשים שאינם מוכרים (ריק = תקין). נבדקת ב-CI (רשת-ביטחון אמיתית) + נקראת
 * פעם-אחת בזול בטעינה (בדיקת חודש-היום) עם console.warn — כדי שהשבירה תהיה רועשת.
 */
const KNOWN_MONTHS_EN = new Set([...ORDER_COMMON, ...ORDER_LEAP]); // כולל 'Adar' + 'Adar I/II'
