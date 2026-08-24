/** חוט · norm-email — קודם אוטומטית (אפיון-Golden). חוזה: norm-email.contract.md */
export function normEmail(email) {
    return email.trim().toLowerCase();
}
/** קוד-הזמנה קצר ודטרמיניסטי מ-seed (הקורא מספק אנטרופיה: slug+חותם-זמן).
 *  8 תווים base36 — לא סוד קריפטוגרפי (אישור-המנהל הוא השער), רק מגדר-רך לקישור. */
