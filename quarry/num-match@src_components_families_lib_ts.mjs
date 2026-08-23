/** 🪨 טיוטת-חוט (דרגת-מחצבה) · numMatch — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:129-153 (25 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): numMatch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function numMatch(q, n) {
    q = String(q || '').trim();
    if (!q)
        return true;
    let m = q.match(/^(\d+)\s*\+$/);
    if (m)
        return n >= +m[1];
    m = q.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m)
        return n >= +m[1] && n <= +m[2];
    if (/^\d+$/.test(q))
        return n === +q;
    return true;
}
/**
 * היסטוריית הפעולות של המשפחה (כמו famHistoryOf במקור) — נגזרת מהנתונים:
 * הצטרפות · אירועי הלוח של המשפחה (P3 פריט 9) · לוג מדד האמינות · מסמכים ·
 * שיבוצים · תשלומים · היעדרויות. ממוינת מהחדש לישן, עד 40 הפעולות האחרונות.
 */
