/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollmentPaidStatus — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:321-332 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollmentPaidStatus, payBal, paidOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollmentPaidStatus(e) {
    if (e.paidFull)
        return 'paid';
    const due = e.totalDue || 0;
    if (due > 0)
        return payBal(e) === 0 ? 'paid' : paidOf(e) > 0 ? 'partial' : 'unpaid';
    return 'unpaid';
}
/**
 * מספר המשובצים התופסים מקום בקורס — פעילים + מוקפאים. שיבוץ שהסתיים ('ended')
 * פינה את מקומו ולכן אינו נספר לתפוסה; אחרת קורס עם בוגרים רבים היה נראה "מלא"
 * וחוסם רישום חדש בשקר (JoinModal/EnrollModal), וגם התפוסה המוצגת הייתה מנופחת.
 */
