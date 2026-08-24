/** 🪨 טיוטת-חוט (דרגת-מחצבה) · PRICING_TERMS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:216-226 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const PRICING_TERMS = [
    { v: 'once', t: 'חד-פעמי' },
    { v: 'weekly', t: 'שבועי' },
    { v: 'biweekly', t: 'דו-שבועי' },
    { v: 'monthly', t: 'חודשי' },
    { v: 'months', t: 'מספר חודשים' },
    { v: 'half_year', t: 'חצי-שנתי' },
    { v: 'year', t: 'שנתי' },
];
/** תווית תקופה קריאה — 'מספר חודשים' מציג את המספר. */
