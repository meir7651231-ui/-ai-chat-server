/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextYearDates — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:35-46 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextYearDates, atNoon, setFullYear, getFullYear, toIso, shift
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextYearDates(start, end) {
    const shift = (iso) => {
        const d = atNoon(iso);
        d.setFullYear(d.getFullYear() + 1);
        return toIso(d);
    };
    return { start: shift(start), end: shift(end) };
}
/** ההחלטה הנוכחית של השיבוץ (חסר = טרם הוחלט). */
