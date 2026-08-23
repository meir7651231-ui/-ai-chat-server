/** 🪨 טיוטת-חוט (דרגת-מחצבה) · lessonsInTerm — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:236-261 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): lessonsInTerm, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function lessonsInTerm(freq, unit, term, months = 1) {
    const f = Math.max(0, Number.isFinite(freq) ? freq : 0);
    const perWeek = unit === 'week' ? f : f / WEEKS_PER_MONTH;
    const perMonth = unit === 'month' ? f : f * WEEKS_PER_MONTH;
    const n = Math.max(1, months || 1);
    switch (term) {
        case 'once':
            return 1;
        case 'weekly':
            return perWeek;
        case 'biweekly':
            return perWeek * 2;
        case 'monthly':
            return perMonth;
        case 'months':
            return perMonth * n;
        case 'half_year':
            return perMonth * 6;
        case 'year':
            return perMonth * 12;
        default:
            return 0;
    }
}
/** מחיר-לשיעור לפי רמת-ההנחה שנבחרה (fallback ל-lessonPrice המלא). */
