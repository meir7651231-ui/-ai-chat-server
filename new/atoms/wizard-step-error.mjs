/** חוט · wizard-step-error — ולידציית-שלב באשף-ההרשמה (5 שלבים); null = תקין.
 *  חוזה: wizard-step-error.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:66-85 (תורגם TS→JS); השכן
 *  signUpError (import מ-lib/config) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function wizardStepError(step, s, signUpError, T) {
    switch (step) {
        case 0:
            return s.industry ? null : T.k1;
        case 1:
            return s.size ? null : T.k2;
        case 2:
            return null; // צרכים — אופציונלי
        case 3:
            if (!s.orgName.trim())
                return T.k3;
            if (!s.contactName.trim())
                return T.k4;
            if (!s.phone.trim())
                return T.k5;
            return null;
        case 4:
            // signUpError מחזיר '' בהצלחה — מנרמלים ל-null לעקביות עם שאר השלבים.
            return signUpError(s.orgName, s.contactName, s.phone, s.email, s.password, s.password2) || null;
        default:
            return null;
    }
}
