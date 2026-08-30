/** קופסת-חיבורים · quiet-hours — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/quietHours.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { QUIET_FROM, QUIET_TO, PREFIX_TZ } from '../atoms/quiet-hours-data.mjs';
export { QUIET_FROM, QUIET_TO } from '../atoms/quiet-hours-data.mjs';
/** חלון-נוחות (שעות מקומיות אצל התורם). מחוץ לזה = "אנשים לא ערים / לא נעים". */

// מ-21:00

// עד 08:00
/** קידומות בין-לאומיות נפוצות בקהילת-התורמים → היסט-UTC משוער (מתעלם מדקויות-שעון-קיץ). */

/** מנרמל טלפון ל-E.164-ish: מחזיר קידומת בין-לאומית אם קיימת ('+..' / '00..'), אחרת ''. */
function intlPrefix(phone) {
    const raw = (phone || '').replace(/[\s()\-.]/g, '');
    let s = raw;
    if (s.startsWith('00'))
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        s = '+' + s.slice(2);
    if (!s.startsWith('+'))
        return null; // מקומי (05x / 0x) — אין קידומת בין-לאומית
    // התאמה לקידומת הארוכה-ביותר (‏+380 לפני +3).
    let best = null;
    for (const e of PREFIX_TZ)
        if (s.startsWith(e.p) && (!best || e.p.length > best.length))
            best = e.p;
    return best;
}
/**
 * חלון-הקשר לתורם. `nowHour`/`nowMin` = שעת-הרכז המקומית; `orgUtcOffset` = היסט-ה-UTC
 // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
 * של הרכז (למשל ‎-new Date().getTimezoneOffset()/60‎). מספר-ישראלי/מקומי ⇒ אותו אזור.
 */
export function contactWindow(phone, nowHour, orgUtcOffset) {
    const p = intlPrefix(phone);
    const entry = p ? PREFIX_TZ.find((e) => e.p === p) : null;
    // ישראל/מקומי: אין הסטה. חו״ל מוכר: הסטה מול הרכז.
    const intl = !!entry && entry.p !== '+972';
    const shift = entry && intl ? entry.off - orgUtcOffset : 0;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    let local = (nowHour + shift) % 24;
    if (local < 0)
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        local += 24;
    const localHour = Math.floor(local);
    const quiet = localHour >= QUIET_FROM || localHour < QUIET_TO;
    return { quiet, localHour, region: intl && entry ? entry.label : '', intl };
}
/** האם עכשיו שעת-מנוחה מקומית אצל הרכז עצמו (לבאנר-הכללי). */
export function localQuiet(nowHour) {
    return nowHour >= QUIET_FROM || nowHour < QUIET_TO;
}
