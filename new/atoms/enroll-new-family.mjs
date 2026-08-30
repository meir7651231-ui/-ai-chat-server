/** אטום-קבוע · enroll-new-family — קודם אוטומטית (צילום-ערך). חוזה: enroll-new-family.contract.md */
export const makeENROLL_NEW_FAMILY = (T) => (T.k1);
/** נרמול-חיפוש מוטמע (מקור: maor/src/lib/validate.ts:51-59) — שכן טהור קטן, מוטמע לפי חוק-החשמלאי (inline). */
function normSearch(t, T) {
    return String(t || '')
        .toLowerCase()
        .replace(/[֑-ׇ]/g, '')
        .replace(/[ךםןףץ]/g, (ch) => ({ ך: T.k2, ם: T.k3, ן: T.k4, ף: T.k5, ץ: T.k6 })[ch])
        .replace(/['"׳״\-–._]/g, '')
        .trim();
}
/** נרמול שם להשוואה — כמו normName במקור. */
function normNameLocal(s, T) {
    return normSearch(s, T).replace(/\s/g, '');
}
/** האם להציע "＋ משפחה חדשה" עבור השאילתה — ≥2 תווים ואין משפחה בשם זהה. */
