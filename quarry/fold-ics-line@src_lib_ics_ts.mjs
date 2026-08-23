/** 🪨 טיוטת-חוט (דרגת-מחצבה) · foldIcsLine — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ics.ts:40-95 (56 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): foldIcsLine, encode, basicDate, basicLocal, getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds, stampUtc, getUTCFullYear
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function foldIcsLine(line) {
    const out = [];
    let cur = '';
    let curBytes = 0;
    let limit = 75; // השורה הראשונה; שורות-המשך: 74 + רווח מוביל
    for (const ch of line) {
        const b = enc.encode(ch).length;
        if (curBytes + b > limit) {
            out.push(cur);
            cur = ' ' + ch;
            curBytes = 1 + b;
            limit = 75;
        }
        else {
            cur += ch;
            curBytes += b;
        }
    }
    if (cur)
        out.push(cur);
    return out.length ? out : [''];
}
/** YYYYMMDD מ-ISO. */
function basicDate(iso) {
    return iso.replace(/-/g, '');
}
/** תאריך+שעה מקומיים בפורמט בסיסי צף: YYYYMMDDTHHMMSS. */
function basicLocal(d) {
    const p = (n, w = 2) => String(n).padStart(w, '0');
    return (String(d.getFullYear()) + p(d.getMonth() + 1) + p(d.getDate()) +
        'T' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()));
}
/** DTSTAMP ב-UTC: YYYYMMDDTHHMMSSZ. */
function stampUtc(now) {
    const p = (n) => String(n).padStart(2, '0');
    return (String(now.getUTCFullYear()) + p(now.getUTCMonth() + 1) + p(now.getUTCDate()) +
        'T' + p(now.getUTCHours()) + p(now.getUTCMinutes()) + p(now.getUTCSeconds()) + 'Z');
}
/** יום-המחרת של ISO (ל-DTEND של אירוע יום-שלם). */
function nextIso(iso) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    const p = (n) => String(n).padStart(2, '0');
    return String(d.getFullYear()) + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
/**
 * בניית קובץ ICS שלם. `now` מוזרק (DTSTAMP) — הפונקציה טהורה ודטרמיניסטית.
 * אירוע-עם-שעה: DTSTART מקומי-צף + DTEND שעה אחת אחריו (כולל גלגול-חצות).
 */
