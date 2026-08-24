/** חוט · ics-escape — קודם אוטומטית (אפיון-Golden). חוזה: ics-escape.contract.md */
export function icsEscape(s) {
    return (s || '')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');
}
const enc = new TextEncoder();
/**
 * קיפול-שורה ל-≤75 אוקטטים (שורת-המשך נפתחת ברווח = אוקטט אחד משלה).
 * נמדד בבייטים של UTF-8 — תו עברי = 2 בייט; לעולם לא חוצים תו באמצע.
 */
