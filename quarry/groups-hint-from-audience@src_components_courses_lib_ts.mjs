/** 🪨 טיוטת-חוט (דרגת-מחצבה) · groupsHintFromAudience — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:92-102 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): groupsHintFromAudience, parseInt
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function groupsHintFromAudience(audience) {
    const m = (audience || '').match(/(\d+)\s*(?:קבוצות|פעמים)/);
    if (!m)
        return null;
    const n = parseInt(m[1], 10);
    return n >= 2 && n <= 12 ? n : null;
}
/**
 * סינון תפקיד-מורה (P3 פריט 15, הכרעה 2): teacherId ⇒ רק החוגים שלה;
 * null (אין תפקיד/אין ענן) ⇒ הכל, כהתנהגות של היום.
 */
