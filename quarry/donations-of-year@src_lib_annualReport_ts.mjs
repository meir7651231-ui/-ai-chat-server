/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationsOfYear — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/annualReport.ts:37-45 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationsOfYear, money
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationsOfYear(donations, year) {
    return donations.filter((d) => (d.date || '').startsWith(year + '-')).sort((a, b) => a.date.localeCompare(b.date));
}
function money(amount, cur) {
    return (cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL');
}
/** שורות-הדוח — טהור (בלי DOM); נבדק שורה-שורה. */
