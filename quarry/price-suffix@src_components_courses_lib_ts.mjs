/** 🪨 טיוטת-חוט (דרגת-מחצבה) · priceSuffix — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:195-199 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): priceSuffix
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function priceSuffix(model) {
    return model === 'half_year' ? 'לחצי שנה' : model === 'year' ? 'לשנה' : model === 'punch' ? '' : 'לחודש';
}
/** תווית + צבעי מסלול התמחור. */
