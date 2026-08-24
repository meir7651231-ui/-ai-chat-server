/** אטום-קבוע · enroll-new-family — קודם אוטומטית (צילום-ערך). חוזה: enroll-new-family.contract.md */
export const ENROLL_NEW_FAMILY = '__new';
/** נרמול-חיפוש מוטמע (מקור: maor/src/lib/validate.ts:51-59) — שכן טהור קטן, מוטמע לפי חוק-החשמלאי (inline). */
function normSearch(t) {
    return String(t || '')
        .toLowerCase()
        .replace(/[֑-ׇ]/g, '')
        .replace(/[ךםןףץ]/g, (ch) => ({ ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' })[ch])
        .replace(/['"׳״\-–._]/g, '')
        .trim();
}
/** נרמול שם להשוואה — כמו normName במקור. */
function normNameLocal(s) {
    return normSearch(s).replace(/\s/g, '');
}
/** האם להציע "＋ משפחה חדשה" עבור השאילתה — ≥2 תווים ואין משפחה בשם זהה. */
