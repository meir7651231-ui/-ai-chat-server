/** חוט · lessons-in-term — מספר-שיעורים בתקופת-תמחור לפי תדירות.
 *  חוזה: lessons-in-term.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:213+236-259;
 *  הקבוע-השכן WEEKS_PER_MONTH הוגדר מקומית (ערך, לא import — חוק-1). */
export const WEEKS_PER_MONTH = 52 / 12;

export function lessonsInTerm(freq, unit, term, months = 1, T) {
    const f = Math.max(0, Number.isFinite(freq) ? freq : 0);
    const perWeek = unit === T.k1 ? f : f / WEEKS_PER_MONTH;
    const perMonth = unit === T.k2 ? f : f * WEEKS_PER_MONTH;
    const n = Math.max(1, months || 1);
    switch (term) {
        case T.k3:
            return 1;
        case T.k4:
            return perWeek;
        case T.k5:
            return perWeek * 2;
        case T.k6:
            return perMonth;
        case T.k7:
            return perMonth * n;
        case T.k8:
            return perMonth * 6;
        case T.k9:
            return perMonth * 12;
        default:
            return 0;
    }
}
