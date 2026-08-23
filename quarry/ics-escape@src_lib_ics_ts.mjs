/** 🪨 טיוטת-חוט (דרגת-מחצבה) · icsEscape — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ics.ts:26-39 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): icsEscape
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
