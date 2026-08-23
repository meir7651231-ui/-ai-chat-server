/** 🪨 טיוטת-חוט (דרגת-מחצבה) · courseFitsMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:477-496 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): courseFitsMember, gradeFits
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function courseFitsMember(c, gender, age, 
/** כיתת הילד/ה — מועברת רק כש-courses.gradeimg פעיל (פער 28). */
grade) {
    if (c.gender && c.gender !== 'all' && gender && c.gender !== gender)
        return false;
    if (age != null) {
        if (c.ageMin && age < c.ageMin)
            return false;
        if (c.ageMax && age > c.ageMax)
            return false;
    }
    if (!gradeFits(c, grade))
        return false;
    return true;
}
/**
 * אזהרת התנגשות לו"ז — מפגשי חוג-היעד מול מפגשי השיבוצים הפעילים של הילד
 * (אותו יום ואותה שעה). מחזירה טקסט אזהרה או null. מייעץ — לא חוסם.
 */
