/** 🪨 טיוטת-חוט (דרגת-מחצבה) · normEmail — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:77-82 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normEmail
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function normEmail(email) {
    return email.trim().toLowerCase();
}
/** קוד-הזמנה קצר ודטרמיניסטי מ-seed (הקורא מספק אנטרופיה: slug+חותם-זמן).
 *  8 תווים base36 — לא סוד קריפטוגרפי (אישור-המנהל הוא השער), רק מגדר-רך לקישור. */
