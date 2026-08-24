/** חוט · lessons-in-term — מספר-שיעורים בתקופת-תמחור לפי תדירות.
 *  חוזה: lessons-in-term.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:213+237-260;
 *  הקבוע-השכן WEEKS_PER_MONTH הוגדר מקומית (ערך, לא import — חוק-1). */
export const WEEKS_PER_MONTH = 52 / 12;

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
