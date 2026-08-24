/** חוט · excel-serial-to-iso — קודם אוטומטית (אפיון-Golden). חוזה: excel-serial-to-iso.contract.md */
export function excelSerialToIso(serial) {
    if (!isFinite(serial) || serial < 1)
        return '';
    const dt = new Date(Math.round((serial - 25569) * 86400000));
    if (isNaN(dt.getTime()))
        return '';
    const mo = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const da = String(dt.getUTCDate()).padStart(2, '0');
    return `${dt.getUTCFullYear()}-${mo}-${da}`;
}
/**
 * פענוח רשת-תאים (‏string[][]) לשורות-ייבוא — משמש גם ל-CSV וגם ל-xlsx.
 * זיהוי עמודות לפי כותרת, **סורק את שורת-הכותרות** (לא מניח שורה-1) כדי לתמוך
 * ביצוא-סליקה שבו מעל הכותרות יש שורות-פתיח (כותרת/טווח-תאריכים/סה"כ). אם אין
 * כותרת מזוהה — סדר עמודות קבוע (התנהגות ישנה). טהור ⇒ נבדק ביחידה.
 */
