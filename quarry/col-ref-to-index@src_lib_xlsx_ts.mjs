/** 🪨 טיוטת-חוט (דרגת-מחצבה) · colRefToIndex — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/xlsx.ts:26-54 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): colRefToIndex, charCodeAt, readSharedStrings, unescapeXml
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function colRefToIndex(ref) {
    const m = /^([A-Z]+)/.exec(ref);
    if (!m)
        return 0;
    let n = 0;
    for (const ch of m[1])
        n = n * 26 + (ch.charCodeAt(0) - 64);
    return n - 1;
}
/** טבלת המחרוזות המשותפות: כל `<si>` ⇒ שרשור כל ה-`<t>` שבתוכו (טקסט-עשיר). */
function readSharedStrings(xml) {
    const out = [];
    const siRe = /<si>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRe.exec(xml))) {
        const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
        let t;
        let s = '';
        while ((t = tRe.exec(m[1])))
            s += t[1];
        out.push(unescapeXml(s));
    }
    return out;
}
/**
 * מפענח את הגיליון הראשון של קובץ xlsx לרשת-תאים דחוסה (שורות × עמודות).
 * תא ריק ⇒ מחרוזת ריקה; שורה מדולגת ב-XML פשוט לא מופיעה (הסדר היחסי נשמר,
 * וזיהוי-הכותרות ב-import סורק את השורות ⇒ אין תלות במספרי-שורה מוחלטים).
 * מחזיר [] כשאין גיליון/מבנה לא-צפוי (נכשל-רך — לעולם לא זורק ל-UI).
 */
