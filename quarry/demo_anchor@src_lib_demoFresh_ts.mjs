/** 🪨 טיוטת-חוט (דרגת-מחצבה) · DEMO_ANCHOR — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/demoFresh.ts:14-31 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): daysBetween, getTime, isNaN, shift, setDate, getDate, isoLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const DEMO_ANCHOR = '2026-08-02';
function daysBetween(fromIso, toIso) {
    const a = new Date(fromIso + 'T12:00:00').getTime();
    const b = new Date(toIso + 'T12:00:00').getTime();
    if (isNaN(a) || isNaN(b))
        return 0;
    return Math.round((b - a) / 86_400_000);
}
/** מזיז תאריך ISO ב-days; קלט ריק/לא-תקין מוחזר כמות-שהוא. */
function shift(iso, days) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso))
        return iso;
    const d = new Date(iso.slice(0, 10) + 'T12:00:00');
    if (isNaN(d.getTime()))
        return iso;
    d.setDate(d.getDate() + days);
    return isoLocal(d);
}
