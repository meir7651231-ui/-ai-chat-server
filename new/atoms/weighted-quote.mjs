/** חוט · weighted-quote — תמחור-משוקלל: שיעורים×מחיר-לשיעור, עיגול חצי-שיעור/שקל.
 *  חוזה: weighted-quote.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:288-295 (תורגם TS→JS);
 *  השכנים lessonPriceForTier/lessonsInTerm הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function weightedQuote(c, opts, lessonPriceForTier, lessonsInTerm) {
    const perLesson = lessonPriceForTier(c, opts.tier);
    const raw = lessonsInTerm(opts.freq, opts.unit, opts.term, opts.months);
    return { lessons: Math.round(raw * 2) / 2, perLesson, total: Math.round(raw * perLesson) };
}
