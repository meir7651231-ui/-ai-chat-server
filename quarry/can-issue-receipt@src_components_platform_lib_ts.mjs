/** 🪨 טיוטת-חוט (דרגת-מחצבה) · canIssueReceipt — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:239-248 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): canIssueReceipt
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function canIssueReceipt(p) {
    return p.superAdmin || p.isManager || p.cloudRoot || !p.cloudConnected;
}
/** אישור בקשת-הצטרפות (טהור) — מוסיף ל-members (בלי כפילויות, מנורמל). ללא דריסות = מלא. */
