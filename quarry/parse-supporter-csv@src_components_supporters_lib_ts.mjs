/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseSupporterCsv — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:506-533 (28 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseSupporterCsv, parseSupporterGrid, parseCsv, fillEmpty
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseSupporterCsv(text) {
    return parseSupporterGrid(parseCsv(text));
}
/** מיזוג שדות שאינם ריקים מ-b לתוך a (a גובר כשקיים; b ממלא חוסרים).
 *  היסטוריה מצטרפת — כל העסקאות של אותו תורם בקובץ נאספות יחד. */
function fillEmpty(a, b) {
    const out = { ...a };
    Object.keys(b).forEach((k) => {
        if (k === 'hist')
            return;
        if (!out[k] && b[k])
            out[k] = b[k];
    });
    if (a.hist?.length || b.hist?.length)
        out.hist = [...(a.hist ?? []), ...(b.hist ?? [])];
    if (a.ayinNames?.length || b.ayinNames?.length)
        out.ayinNames = [...(a.ayinNames ?? []), ...(b.ayinNames ?? [])];
    return out;
}
/** חיווט "עבור מי" ⇒ שם-לטיפול (בקשת-בעלים 9.8): מוסיף לתיק-המעקב את השמות
 *  שהגיעו מהייבוא. כפילויות מדולגות (planAddName); תיק חסר נפתח (emptyAyin);
 *  הכמות נשארת '' — ממתינה לרישום בשלב-הטיפול (המונה יושב ליד השם בפאנל). */
