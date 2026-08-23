/** 🪨 טיוטת-חוט (דרגת-מחצבה) · overrideColumn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/customExport.ts:127-158 (32 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): overrideColumn, isoOf, getFullYear, getMonth, getDate, fmtD
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function overrideColumn(rows, colIdx, overrides) {
    if (colIdx < 0)
        return rows;
    return rows.map((r, i) => {
        if (i === 0 || overrides[i] === undefined)
            return r;
        const c = [...r];
        c[colIdx] = overrides[i];
        return c;
    });
}
function inR(iso, r) {
    if (!iso)
        return false;
    if (r.from && iso < r.from)
        return false;
    if (r.to && iso > r.to)
        return false;
    return true;
}
function isoOf(d) {
    const p2 = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
function fmtD(iso) {
    if (!iso)
        return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}
/**
 * בניית שורות הדו"ח — כותרת מהשדות הנבחרים בלבד, ואז שורת נתונים לכל רשומה.
 * selectedKeys קובע גם את הסדר (לפי סדר ה-defs, מסונן להנבחרים).
 */
