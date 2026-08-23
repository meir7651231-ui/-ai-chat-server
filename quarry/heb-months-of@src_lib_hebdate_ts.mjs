/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hebMonthsOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:91-99 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hebMonthsOf, isHebLeapYear
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hebMonthsOf(hebYear) {
    const order = isHebLeapYear(hebYear) ? ORDER_LEAP : ORDER_COMMON;
    return order.map(monthHeOf);
}
/**
 * עברי→לועזי: 'כ״ג' (23) + 'אב' + 5786 → '2026-08-06'.
 * מחזירה null אם הצירוף לא קיים בשנה זו (יום 30 בחודש חסר, אדר א׳ בשנה פשוטה…).
 */
