/** 🪨 טיוטת-חוט (דרגת-מחצבה) · coursesOfTeacher — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:103-119 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): coursesOfTeacher
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function coursesOfTeacher(courses, teacherId) {
    return teacherId ? courses.filter((c) => c.teacherId === teacherId) : courses;
}
/**
 * מצב החדרים ברגע נתון — now מוזרק (טוהר): חדר פעיל תפוס כשמפגש של חוג
 * בחדר חל באותו יום-שבוע והשעה בתוך [תחילת המפגש, +משך המשבצת); ברירת
 * המחדל 60 דק׳ (slot של החדר כשמוגדר). חדרים מושבתים לא מוחזרים.
 */
