/** 🪨 טיוטת-חוט (דרגת-מחצבה) · paidInRange — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:47-53 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): paidInRange, inRange, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function paidInRange(e, r) {
    return (e.payments || [])
        .filter((p) => inRange(p.date, r))
        .reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
}
/** יתרת חוב — סה"כ עסקה פחות ששולם, לא שלילית (כמו payBal במקור). */
