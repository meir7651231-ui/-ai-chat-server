/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextYearCourseDraft — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:243-278 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextYearCourseDraft, nextYearDates, academicYearLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextYearCourseDraft(src, newId) {
    const { start, end } = nextYearDates(src.start, src.end);
    return {
        ...src,
        id: newId,
        start,
        end,
        year: academicYearLabel(start),
        prevYearId: src.id,
    };
}
/**
 * כל ההשתתפויות של תלמיד/ה לאורך הזמן — שיבוץ אחר שיבוץ בכל החוגים והשנים,
 * ממויין מהחדש לישן לפי תאריך-פתיחת-החוג (שובר-שוויון: enrolledAt). דטרמיניסטי,
 * נגזר מהשדות הקיימים בלבד. "איפה השתתף ומתי" — courseName + yearLabel + תאריכים.
 */
