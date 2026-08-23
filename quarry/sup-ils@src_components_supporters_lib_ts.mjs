/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supIls — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:106-110 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supIls
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supIls(sp) {
    return (sp.ils || 0) + (sp.hist ?? []).reduce((a, h) => a + (h.c === '$' ? 0 : h.a), 0);
}
/** סה"כ $ כולל היסטוריה. */
