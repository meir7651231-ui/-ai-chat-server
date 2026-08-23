/** 🪨 טיוטת-חוט (דרגת-מחצבה) · decodeQuotedPrintable — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/vcardImport.ts:39-152 (114 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): decodeQuotedPrintable, parseInt, charCodeAt, decode, unfoldLines, splitProperty, shift, decodeValue, hasParam, phoneLabel, lastIndexOf, joinAddress
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function decodeQuotedPrintable(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '=' && i + 2 < s.length && HEX2.test(s.slice(i + 1, i + 3))) {
            bytes.push(parseInt(s.slice(i + 1, i + 3), 16));
            i += 2;
        }
        else {
            // תו ASCII רגיל — code-point בטווח בית בודד; מעל 0xFF נשמר כמות-שהוא (נדיר).
            const cp = s.charCodeAt(i);
            bytes.push(cp <= 0xff ? cp : 0x3f /* '?' */);
        }
    }
    try {
        return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
    }
    catch {
        return s;
    }
}
/**
 * איחוד שורות פיזיות לשורות-לוגיות: (א) קיפול-vCard רגיל — שורה שמתחילה ברווח/טאב
 * ממשיכה את הקודמת; (ב) שורת-המשך רכה של QP — שורה שנגמרת ב-`=` מתחברת לבאה בלי
 * ה-`=`. חשוב: ריכוך-ה-`=` חל **רק** על שדה QUOTED-PRINTABLE — אחרת בסיס-64 של
 * PHOTO (שנגמר ב-`=`/`==` ריפוד) היה בולע את גבול-הכרטיס (END/BEGIN) ומאבד רשומות.
 */
function unfoldLines(text) {
    const raw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const out = [];
    let qpActive = false; // השורה-הלוגית הנוכחית היא QP וממתינה להמשך רך
    for (const line of raw) {
        // קיפול-vCard רגיל: המשך בהזחה מצטרף לקודמת.
        if (out.length && (line.startsWith(' ') || line.startsWith('\t'))) {
            out[out.length - 1] += line.slice(1);
            if (!out[out.length - 1].endsWith('='))
                qpActive = false;
            continue;
        }
        // ריכוך-QP: רק כשהשורה-הלוגית הנוכחית היא QP ונגמרת ב-'='.
        if (out.length && qpActive && out[out.length - 1].endsWith('=')) {
            out[out.length - 1] = out[out.length - 1].slice(0, -1) + line;
            if (!out[out.length - 1].endsWith('='))
                qpActive = false;
            continue;
        }
        // שורה-לוגית חדשה — QP-פעיל אם היא שדה-QP שנגמר ב-'=' (ממתין להמשך).
        out.push(line);
        qpActive = /ENCODING=QUOTED-PRINTABLE/i.test(line) && line.endsWith('=');
    }
    return out;
}
/** פיצול "NAME;PARAM;PARAM:VALUE" ל-{ name, params[], value }. ה-`:` הראשון מפריד. */
function splitProperty(line) {
    const colon = line.indexOf(':');
    if (colon < 0)
        return null;
    const head = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const segs = head.split(';');
    const name = (segs.shift() || '').trim().toUpperCase();
    if (!name)
        return null;
    return { name, params: segs, value };
}
const hasParam = (params, token) => params.some((p) => p.toUpperCase().includes(token));
/** ערך-שדה מפוענח לפי הפרמטרים (QUOTED-PRINTABLE אם צוין; אחרת גלמי). */
function decodeValue(value, params) {
    return hasParam(params, 'QUOTED-PRINTABLE') ? decodeQuotedPrintable(value) : value;
}
const PHONE_LABELS = {
    CELL: 'נייד',
    HOME: 'בית',
    WORK: 'עבודה',
    FAX: 'פקס',
    MAIN: 'ראשי',
    VOICE: '',
    PREF: '',
};
/** תווית-טלפון קריאה מהפרמטרים: X-CUSTOM(…עברית…) מפוענח, אחרת מיפוי CELL/HOME/… */
function phoneLabel(params) {
    for (const p of params) {
        const up = p.toUpperCase();
        if (up.startsWith('X-CUSTOM')) {
            // X-CUSTOM(CHARSET=UTF-8,ENCODING=QUOTED-PRINTABLE,=D7=A0=D7=99=D7=99=D7=93)
            const inner = p.slice(p.indexOf('(') + 1, p.lastIndexOf(')'));
            const parts = inner.split(',');
            const last = parts[parts.length - 1] || '';
            const decoded = /=[0-9A-Fa-f]{2}/.test(last) ? decodeQuotedPrintable(last) : last;
            if (decoded.trim())
                return decoded.trim();
        }
    }
    for (const p of params) {
        const key = p.toUpperCase().trim();
        if (key in PHONE_LABELS && PHONE_LABELS[key])
            return PHONE_LABELS[key];
    }
    return '';
}
/** ADR מובנה (po;ext;street;city;region;postal;country) → מחרוזת-כתובת נקייה. */
function joinAddress(value, params) {
    const decoded = decodeValue(value, params);
    return decoded
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', ');
}
/**
 * פענוח קובץ vCard שלם → רשימת אנשי-קשר. כרטיס בלי שם ובלי טלפון/מייל מדולג.
 * דטרמיניסטי, טהור. סדר-הפלט = סדר-הכרטיסים בקובץ.
 */
