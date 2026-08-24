/** חוט · org-join-full-code — קודם אוטומטית (אפיון-Golden). חוזה: org-join-full-code.contract.md */
export function orgJoinFullCode(slug, code) {
    return slug + '.' + code;
}
/** פירוק "קוד מהבוס" ל-{slug, code}. null אם הצורה אינה תקינה (סלאג חוקי + קוד לא-ריק). */
