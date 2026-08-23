/** 🪨 טיוטת-חוט (דרגת-מחצבה) · timeCostTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:109-113 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): timeCostTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function timeCostTotal(a) {
    return (a.time || []).reduce((t, e) => t + (+e.hours || 0) * (e.rate || 0), 0);
}
/** עלות-החומרים/רכש — סכום (כמות × מחיר-יחידה) של רשומות-החומרים. טהור. */
