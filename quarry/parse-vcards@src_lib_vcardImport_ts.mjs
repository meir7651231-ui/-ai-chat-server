/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseVcards — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/vcardImport.ts:153-228 (76 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseVcards, unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseVcards(text) {
    const lines = unfoldLines(text || '');
    const out = [];
    let cur = null;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        if (/^BEGIN:VCARD$/i.test(trimmed)) {
            cur = { fullName: '', family: '', given: '', phones: [], emails: [], org: '', title: '', address: '', note: '' };
            continue;
        }
        if (/^END:VCARD$/i.test(trimmed)) {
            if (cur) {
                if (!cur.fullName) {
                    cur.fullName = [cur.given, cur.family].filter(Boolean).join(' ').trim();
                }
                out.push(cur);
            }
            cur = null;
            continue;
        }
        if (!cur)
            continue;
        const prop = splitProperty(line);
        if (!prop)
            continue;
        const { name, params, value } = prop;
        switch (name) {
            case 'FN':
                cur.fullName = decodeValue(value, params).trim();
                break;
            case 'N': {
                const decoded = decodeValue(value, params);
                const segs = decoded.split(';');
                cur.family = (segs[0] || '').trim();
                cur.given = (segs[1] || '').trim();
                break;
            }
            case 'TEL': {
                const v = value.trim();
                if (v)
                    cur.phones.push({ value: v, label: phoneLabel(params) });
                break;
            }
            case 'EMAIL': {
                const v = decodeValue(value, params).trim();
                if (v)
                    cur.emails.push(v);
                break;
            }
            case 'ORG': {
                const v = decodeValue(value, params).replace(/;+$/, '').trim();
                if (v && v.toLowerCase() !== 'null')
                    cur.org = v;
                break;
            }
            case 'TITLE':
                cur.title = decodeValue(value, params).trim();
                break;
            case 'ADR':
                cur.address = joinAddress(value, params);
                break;
            case 'NOTE':
                cur.note = decodeValue(value, params).trim();
                break;
            default:
                break; // PHOTO/URL/X-* וכו' — מדולגים
        }
    }
    return out;
}
/** ספרות בלבד ממספר-טלפון (לזיהוי מספרי-חירום/זבל קצרים). */
const digitsOnly = (s) => (s || '').replace(/\D/g, '');
/**
 * כרטיס-זבל שאין טעם לייבא: בלי שם, או שכל הטלפונים קצרים-מדי (מספרי-מערכת/חירום
 * כמו 100/101/102) ואין מייל. שם עם מספר/מייל אמיתי — נשמר.
 */
