/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollCount — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:333-339 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollCount
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollCount(db, courseId) {
    // 'wait' (רשימת-המתנה) אינו תופס מקום — אחרת רשימת-המתנה הייתה חוסמת שיבוץ אמיתי.
    return db.enrollments.filter((e) => e.courseId === courseId && e.status !== 'ended' && e.status !== 'wait').length;
}
/** שכפול-חוג לסמסטר-חדש — כל השדות עם id-חדש ותאריכים-חדשים, שם מסומן "(עותק)".
 *  שיבוצים נפרדים מהחוג ⇒ החוג המשוכפל נולד ריק (בלי תלמידים). */
