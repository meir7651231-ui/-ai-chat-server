/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationYears — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/annualReport.ts:32-36 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationYears, reverse
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationYears(donations) {
    return [...new Set(donations.map((d) => (d.date || '').slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))].sort().reverse();
}
/** תרומות השנה בלבד, ממוינות עולה לפי תאריך. */
