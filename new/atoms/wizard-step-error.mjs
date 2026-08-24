/** חוט · wizard-step-error — ולידציית-שלב באשף-ההרשמה (5 שלבים); null = תקין.
 *  חוזה: wizard-step-error.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:66-85 (תורגם TS→JS); השכן
 *  signUpError (import מ-lib/config) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function wizardStepError(step, s, signUpError) {
    switch (step) {
        case 0:
            return s.industry ? null : 'בחרו את תחום העסק כדי להמשיך';
        case 1:
            return s.size ? null : 'בחרו את גודל הארגון';
        case 2:
            return null; // צרכים — אופציונלי
        case 3:
            if (!s.orgName.trim())
                return 'שם הארגון חובה';
            if (!s.contactName.trim())
                return 'שם איש קשר חובה';
            if (!s.phone.trim())
                return 'טלפון חובה — נחזור אליכם לאישור';
            return null;
        case 4:
            // signUpError מחזיר '' בהצלחה — מנרמלים ל-null לעקביות עם שאר השלבים.
            return signUpError(s.orgName, s.contactName, s.phone, s.email, s.password, s.password2) || null;
        default:
            return null;
    }
}
