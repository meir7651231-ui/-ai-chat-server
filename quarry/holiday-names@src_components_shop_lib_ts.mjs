/** 🪨 טיוטת-חוט (דרגת-מחצבה) · holidayNames — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:153-179 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): holidayNames, getFullYear, getMonth, getDate, holidayOf, hebYearOf, hebParts
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function holidayNames() {
    if (holidayNamesCache)
        return holidayNamesCache;
    const out = [];
    const seen = new Set();
    const start = new Date('2026-01-01T12:00:00');
    for (let i = 0; i < 400; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const name = holidayOf(d);
        if (name && !seen.has(name)) {
            seen.add(name);
            out.push(name);
        }
    }
    holidayNamesCache = out;
    return out;
}
/** השנה העברית של תאריך ISO — להשוואת מימושי מתנת-חג בין שנים. */
function hebYearOf(iso) {
    return hebParts(new Date(iso + 'T12:00:00')).year;
}
/**
 * האם רכיב מומש בשיוך. למתנת-חג (holiday מועבר): מומש רק אם קיים מימוש
 * לאותו שם-חג **באותה שנה עברית** של מופע החג — מימוש לחג X אשתקד אינו
 * מכסה את השנה (המתנה מחזורית).
 */
