/** 🪨 טיוטת-חוט (דרגת-מחצבה) · termLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:227-235 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): termLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function termLabel(term, months) {
    if (term === 'months')
        return (months && months > 0 ? months : 1) + ' חודשים';
    return PRICING_TERMS.find((x) => x.v === term)?.t ?? '';
}
/**
 * מספר-השיעורים בתקופה לפי התדירות שנבחרה — טהור.
 * freq = כמות; unit = 'week' (פ/שבוע) או 'month' (פ/חודש). ממיר דרך WEEKS_PER_MONTH.
 */
