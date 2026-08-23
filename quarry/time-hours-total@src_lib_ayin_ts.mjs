/** 🪨 טיוטת-חוט (דרגת-מחצבה) · timeHoursTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:104-108 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): timeHoursTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function timeHoursTotal(a) {
    return (a.time || []).reduce((t, e) => t + (+e.hours || 0), 0);
}
/** עלות-העבודה — סכום (שעות × תעריף) של רשומות-השעתון. טהור. */
