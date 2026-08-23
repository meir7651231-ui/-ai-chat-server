/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ENROLL_NEW_FAMILY — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:523-530 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normNameLocal, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const ENROLL_NEW_FAMILY = '__new';
/** נרמול שם להשוואה — כמו normName במקור. */
function normNameLocal(s) {
    return normSearch(s).replace(/\s/g, '');
}
/** האם להציע "＋ משפחה חדשה" עבור השאילתה — ≥2 תווים ואין משפחה בשם זהה. */
