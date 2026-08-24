/** אטום-קבוע · demo-anchor — קודם אוטומטית (צילום-ערך). חוזה: demo-anchor.contract.md */
export const DEMO_ANCHOR = '2026-08-02';
function daysBetween(fromIso, toIso) {
    const a = new Date(fromIso + 'T12:00:00').getTime();
    const b = new Date(toIso + 'T12:00:00').getTime();
    if (isNaN(a) || isNaN(b))
        return 0;
    return Math.round((b - a) / 86_400_000);
}
/** ISO מקומי (YYYY-MM-DD) מ-Date נתון — ללא הזחת אזור הזמן של toISOString. מוטמע (חוק-1: אטום-טהור, מקור maor/src/lib/date-util.ts:14). */
function isoLocal(d) {
    const p2 = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
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
