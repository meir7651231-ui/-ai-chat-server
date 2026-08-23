/** 🪨 טיוטת-חוט (דרגת-מחצבה) · weightedQuote — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:288-297 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): weightedQuote, lessonPriceForTier, lessonsInTerm
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function weightedQuote(c, opts) {
    const perLesson = lessonPriceForTier(c, opts.tier);
    const raw = lessonsInTerm(opts.freq, opts.unit, opts.term, opts.months);
    return { lessons: Math.round(raw * 2) / 2, perLesson, total: Math.round(raw * perLesson) };
}
/** תמחור משוקלל מתוך שדות-שיבוץ שמורים (או null אם החוג אינו פר-שיעור / חסר תדירות). */
