/** 📦 קופסת-חיבורים · אשף-ההרשמה (lib-signupWizard). חוזה: signup-wizard.contract.md
 *  אשף 5-השלבים של אורביט (SIGNUP3): תחום → גודל → צרכים → פרטי-קשר → חשבון.
 *  9 חוטי maor/src/lib/signupWizard.ts נפגשים כאן ורק כאן (חוק-2);
 *  אפס-IO — המקור טהור (בלי store/DOM), אין שקעי DOM/localStorage/fetch. */
import { VERTICAL_PACKS } from '../atoms/vertical-packs.mjs';
import { wizardIndustries } from '../atoms/wizard-industries.mjs';
import { ORG_SIZES } from '../atoms/org-sizes.mjs';
import { ORG_NEEDS } from '../atoms/org-needs.mjs';
import { WIZARD_STEPS } from '../atoms/wizard-steps.mjs';
import { EMPTY_WIZARD } from '../atoms/empty-wizard.mjs';
import { wizardStepError as __pure_wizardStepError } from '../atoms/wizard-step-error.mjs';
import { WIZARD_STEP_ERROR_T as __d_wizardStepError_WIZARD_STEP_ERROR_T } from '../atoms/wizard-step-error-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const atomWizardStepError = (...a) => __pure_wizardStepError(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_wizardStepError_WIZARD_STEP_ERROR_T);
import { signUpError as __pure_signUpError } from '../atoms/sign-up-error.mjs';
import { SIGN_UP_ERROR_T as __d_signUpError_SIGN_UP_ERROR_T } from '../atoms/sign-up-error-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const signUpError = (...a) => __pure_signUpError(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_signUpError_SIGN_UP_ERROR_T);
import { industryLabel as atomIndustryLabel } from '../atoms/industry-label.mjs';
import { sizeLabel as atomSizeLabel } from '../atoms/size-label.mjs';
import { needLabel as atomNeedLabel } from '../atoms/need-label.mjs';

// ── הכרעת-החיווט: תחומי-האשף נגזרים מאטום-הנתונים של 13 חבילות-הוורטיקל
//    (מקור-אמת יחיד — signupWizard.ts:10-15; השקע packs מחווט כאן). ──
export const WIZARD_INDUSTRIES = wizardIndustries(VERTICAL_PACKS);

// ── קבועי-האשף — כלשונם מהמקור (signupWizard.ts:18-60). ──
export { ORG_SIZES, ORG_NEEDS, WIZARD_STEPS, EMPTY_WIZARD };

/** ולידציית-שלב (0-based; null = תקין). הכרעת-החיווט: השקע signUpError מחווט
 *  לחוט-השכן sign-up-error (config.ts:739-756) — שלב-החשבון (4) עובר את אותה
 *  ולידציה כמו הטופס הרזה (signupWizard.ts:6+81). */
export const wizardStepError = (step, s) => atomWizardStepError(step, s, signUpError);

// ── תוויות-תצוגה (לוח-הבקרה) — השקעים מחווטים לקבועי-הקופסה (signupWizard.ts:88-96). ──
export const industryLabel = (id) => atomIndustryLabel(id, WIZARD_INDUSTRIES);
export const sizeLabel = (id) => atomSizeLabel(id, ORG_SIZES);
export const needLabel = (id) => atomNeedLabel(id, ORG_NEEDS);
