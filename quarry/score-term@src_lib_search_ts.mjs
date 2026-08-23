/** 🪨 טיוטת-חוט (דרגת-מחצבה) · scoreTerm — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/search.ts:100-128 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): scoreTerm, normSearch, levenshtein
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function scoreTerm(q, term) {
    const nq = normSearch(q);
    const nt = normSearch(term);
    if (!nq || !nt)
        return 0;
    if (nt === nq)
        return 100;
    if (nt.startsWith(nq))
        return 80;
    // "חוגים" מוצא "חוג" — הסרת סיומת ריבוי (אחרי נרמול: ם' סופית → מ')
    if (nq.length >= 5 && (nq.endsWith('ימ') || nq.endsWith('ות'))) {
        const stem = nq.slice(0, -2);
        if (nt === stem || nt.startsWith(stem))
            return 70;
    }
    if (nq.length >= 2 && nt.includes(nq))
        return 62;
    if (nq.length >= 3 && !/^\d+$/.test(nq)) {
        // "דויד" ≈ "דוד" — השוואה ללא אימות קריאה
        const sq = nq.replace(/[יו]/g, '');
        const st = nt.replace(/[יו]/g, '');
        if (sq.length >= 2 && sq === st)
            return 58;
        // מונח ארוך (≥6) סובל שתי שגיאות; קצר יותר — אחת. הציון יורד 4 לכל שגיאה.
        const max = nt.length >= 6 ? 2 : 1;
        const d = levenshtein(nq, nt);
        if (d <= max)
            return 52 - d * 4;
    }
    return 0;
}
/**
 * הרחבת שאילתה דרך XLAT: אם השאילתה היא מפתח עברי — מוסיפים את הכינויים;
 * אם היא כינוי — מוסיפים את המפתח העברי. תמיד כולל את השאילתה עצמה.
 */
