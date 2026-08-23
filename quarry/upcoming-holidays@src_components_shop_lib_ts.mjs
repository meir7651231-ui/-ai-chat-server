/** 🪨 טיוטת-חוט (דרגת-מחצבה) · upcomingHolidays — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:131-152 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): upcomingHolidays, getFullYear, getMonth, getDate, holidayOf, isoOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function upcomingHolidays(fromIso, days = 45) {
    const out = [];
    const seen = new Set();
    const start = new Date(fromIso + 'T12:00:00');
    for (let i = 0; i <= days; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const name = holidayOf(d);
        if (name && !seen.has(name)) {
            seen.add(name);
            out.push({ iso: isoOf(d), name });
        }
    }
    return out;
}
let holidayNamesCache = null;
/**
 * כל שמות החגים הייחודיים — סריקת שנה עברית מלאה (400 יום מעוגן קבוע,
 * דטרמיניסטי) עם holidayOf; ממורש ברמת המודול (הרשימה קבועה). לבורר
 * החגים של מתנת-חג (הכרעה 17).
 */
