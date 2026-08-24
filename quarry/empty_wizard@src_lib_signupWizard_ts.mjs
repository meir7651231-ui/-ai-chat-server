/** 🪨 טיוטת-חוט (דרגת-מחצבה) · EMPTY_WIZARD — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/signupWizard.ts:50-65 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
