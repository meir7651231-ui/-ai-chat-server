/** 🪨 טיוטת-חוט (דרגת-מחצבה) · waitlistFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:368-375 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): waitlistFor
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function waitlistFor(enrollments, courseId) {
    return enrollments
        .filter((e) => e.courseId === courseId && e.status === 'wait')
        .sort((a, b) => (a.enrolledAt || '').localeCompare(b.enrolledAt || ''));
}
/** המפגש הקרוב הבא של הקורס (לזכאות השלמה בחיסור — 48 שעות).
 *  S7 (20.8): `now` מוזרק (ברירת-מחדל = השעון) ⇒ דטרמיניסטי ובר-בדיקה. */
