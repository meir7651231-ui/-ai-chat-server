/** 🪨 טיוטת-חוט (דרגת-מחצבה) · gem — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebrew.ts:15-28 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function gem(n) {
    n = Math.floor(+n);
    if (!Number.isFinite(n) || n <= 0)
        return ''; // מונע פלט "undefined" מאינדקסים שליליים/שבורים
    const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
    let s = H[Math.floor(n / 100)] || '';
    const r = n % 100;
    if (r === 15)
        s += 'טו';
    else if (r === 16)
        s += 'טז';
    else
        s += T[Math.floor(r / 10)] + U[r % 10];
    return s.length === 1 ? s + '׳' : s.slice(0, -1) + '״' + s.slice(-1);
}
