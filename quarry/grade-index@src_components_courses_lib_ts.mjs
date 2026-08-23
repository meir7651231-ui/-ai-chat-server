/** 🪨 טיוטת-חוט (דרגת-מחצבה) · gradeIndex — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:456-465 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): gradeIndex
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function gradeIndex(g) {
    const clean = (g || '').replace(/["'׳״]/g, '').replace(/^כיתה\s*/, '').trim();
    if (!clean)
        return -1;
    return GRADE_ORDER.indexOf(clean);
}
/**
 * התאמת כיתה לחוג: אין טווח לחוג או שכיתת הילד/ה לא מזוהה ⇒ מתאים
 * (רך — לא מסתירים על סמך מידע חסר); אחרת נדרש בתוך [gradeMin, gradeMax].
 */
