/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollmentQuote — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:298-303 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollmentQuote, weightedQuote
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollmentQuote(c, e) {
    if (!c.perLesson || !e.freq || !e.freqUnit || !e.term)
        return null;
    return weightedQuote(c, { freq: e.freq, unit: e.freqUnit, term: e.term, months: e.termMonths, tier: e.tier || '' });
}
/** סכום ששולם עד כה על השיבוץ — סכומים לא-מספריים (NaN מקלט פגום) נספרים כ-0. */
