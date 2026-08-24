/** אטום-קבוע · enroll-new-family — קודם אוטומטית (צילום-ערך). חוזה: enroll-new-family.contract.md */
export const ENROLL_NEW_FAMILY = '__new';
/** נרמול שם להשוואה — כמו normName במקור. */
function normNameLocal(s) {
    return normSearch(s).replace(/\s/g, '');
}
/** האם להציע "＋ משפחה חדשה" עבור השאילתה — ≥2 תווים ואין משפחה בשם זהה. */
