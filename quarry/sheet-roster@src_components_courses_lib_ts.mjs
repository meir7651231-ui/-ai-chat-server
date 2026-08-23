/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sheetRoster — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:391-395 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sheetRoster
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sheetRoster(enrollments, courseId) {
    return enrollments.filter((e) => e.courseId === courseId && e.status !== 'ended' && e.status !== 'wait');
}
/** סיכום-נוכחות ליום: כמה מהרשימה מסומנים-נוכחים (presents כולל את התאריך). */
