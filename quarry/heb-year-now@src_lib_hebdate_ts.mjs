/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hebYearNow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:52-78 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hebYearNow, hebParts, pad2, isoOf, getFullYear, getMonth, getDate, hebToIsoEn, isInteger
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hebYearNow() {
    return hebParts(new Date()).year;
}
function pad2(n) {
    return String(n).padStart(2, '0');
}
function isoOf(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
/** המרה עברי→לועזי כששם החודש כבר בשם Intl (סריקת ~440 ימים מהעוגן). */
function hebToIsoEn(day, monthEn, hebYear) {
    if (!Number.isInteger(day) || day < 1 || day > 30)
        return null;
    if (!Number.isInteger(hebYear) || hebYear < 4000 || hebYear > 7000)
        return null;
    const gy = hebYear - 3761; // 1 באוגוסט של השנה הזו קודם תמיד לא׳ תשרי של hebYear
    for (let i = 0; i < 440; i++) {
        const d = new Date(gy, 7, 1 + i, 12); // צהריים — חסין להיסטי שעון קיץ
        const p = hebParts(d);
        if (p.year === hebYear && p.month === monthEn && p.day === day)
            return isoOf(d);
    }
    return null; // התאריך לא קיים בשנה זו (למשל ל׳ חשוון בשנה חסרה/כסדרה)
}
/** האם שנה עברית מעוברת — בדיקה מול Intl (האם קיים בה 'Adar I'), עם cache. */
const leapCache = new Map();
