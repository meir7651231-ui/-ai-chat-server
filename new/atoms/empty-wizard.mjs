/** אטום-קבוע · empty-wizard — קודם אוטומטית (צילום-ערך). חוזה: empty-wizard.contract.md */
export const EMPTY_WIZARD = {
    industry: '',
    size: '',
    needs: [],
    orgName: '',
    contactName: '',
    phone: '',
    email: '',
    password: '',
    password2: '',
};
/**
 * שגיאת השלב הנוכחי (0-based) — null = תקין להמשך. שלב הצרכים (2) אופציונלי.
 * השלב האחרון (4) עובר דרך signUpError — אותה ולידציה כמו הטופס הרזה.
 */
