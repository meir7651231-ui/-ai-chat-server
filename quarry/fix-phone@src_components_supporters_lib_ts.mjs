/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fixPhone — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:230-234 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fixPhone, formatIsraeliPhone
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function fixPhone(p) {
    return formatIsraeliPhone(p);
}
/** "₪1,200 + $300" או "—" כשאין כלום — כולל היסטוריה (הכרעת 9.8). */
