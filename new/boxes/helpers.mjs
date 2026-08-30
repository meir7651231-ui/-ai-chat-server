/** קופסת-חיבורים · helpers — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/settings/helpers.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { S } from '../atoms/helpers-strings.mjs';
import { isoToday as isoTodayLocal } from '../atoms/iso-today.mjs';
/** תאריך ISO ‏→ DD/MM/YYYY לתצוגה. */
export function fmtDate(iso) {
    if (!iso)
        return '—';
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const p = iso.slice(0, 10).split('-');
    if (p.length !== 3)
        return iso;
    return `${p[2]}/${p[1]}/${p[0]}`;
}
/** חותמת זמן ISO ‏→ DD/MM/YYYY HH:MM לתצוגה. */
export function fmtDateTime(iso) {
    if (!iso)
        return '—';
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const time = iso.length > 15 ? iso.slice(11, 16) : '';
    return fmtDate(iso) + (time ? ' ' + time : '');
}
/** היום בפורמט ISO ‏(YYYY-MM-DD) — מקומי. */
export function isoToday() {
    return isoTodayLocal();
}
/** רשימת הציוד הסטנדרטית לחדרים — כמו במערכת המקורית. */
export const ROOM_EQUIPMENT = [
    S.k0,
    S.k1,
    S.k2,
    S.k3,
    S.k4,
    S.k5,
    S.k6,
    S.k7,
];
