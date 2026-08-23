/** 🪨 טיוטת-חוט (דרגת-מחצבה) · courseDateError — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:57-65 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): courseDateError, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function courseDateError(start, end, config) {
    if (start && end && end < start) {
        const courseWord = config ? termOf(config, 'entity.course', 'חוג') : 'חוג';
        return 'תאריך הסיום מוקדם מתאריך ההתחלה — ה' + courseWord + ' לא יופיע בלוח. תקנו את התאריכים';
    }
    return null;
}
/** גיל בשנים מלאות מתאריך לידה, או null אם אין תאריך. */
