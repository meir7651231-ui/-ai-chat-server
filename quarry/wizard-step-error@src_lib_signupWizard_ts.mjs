/** 🪨 טיוטת-חוט (דרגת-מחצבה) · wizardStepError — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/signupWizard.ts:66-87 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): wizardStepError, signUpError
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function wizardStepError(step, s) {
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
/** תווית התחום/הגודל לתצוגה (לוח הבקרה) — id → תווית קריאה. */
