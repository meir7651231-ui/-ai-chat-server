/** 🪨 טיוטת-חוט (דרגת-מחצבה) · decodeCsvBuffer — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/csvx.ts:43-63 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): decodeCsvBuffer, decode, subarray
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function decodeCsvBuffer(buf) {
    const bytes = new Uint8Array(buf);
    if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe)
        return new TextDecoder('utf-16le').decode(buf);
    if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff)
        return new TextDecoder('utf-16be').decode(buf);
    const probe = bytes.subarray(0, 400);
    let nuls = 0;
    for (const b of probe)
        if (b === 0)
            nuls++;
    if (probe.length > 8 && nuls > probe.length / 5)
        return new TextDecoder('utf-16le').decode(buf);
    const utf8 = new TextDecoder('utf-8').decode(buf);
    if (!utf8.includes('�'))
        return utf8;
    try {
        return new TextDecoder('windows-1255').decode(buf);
    }
    catch {
        return utf8;
    }
}
/**
 * קריאת קובץ טקסט לייבוא — helper משותף לכל מסלולי הייבוא
 * (ילדים / משפחות / תומכות / גיליון מעקב) — P0.5; הפענוח ב-decodeCsvBuffer.
 */
