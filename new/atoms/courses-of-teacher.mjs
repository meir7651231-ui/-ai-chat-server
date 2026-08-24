/** חוט · courses-of-teacher — קודם אוטומטית (אפיון-Golden). חוזה: courses-of-teacher.contract.md */
export function coursesOfTeacher(courses, teacherId) {
    return teacherId ? courses.filter((c) => c.teacherId === teacherId) : courses;
}
/**
 * מצב החדרים ברגע נתון — now מוזרק (טוהר): חדר פעיל תפוס כשמפגש של חוג
 * בחדר חל באותו יום-שבוע והשעה בתוך [תחילת המפגש, +משך המשבצת); ברירת
 * המחדל 60 דק׳ (slot של החדר כשמוגדר). חדרים מושבתים לא מוחזרים.
 */
