// בדיקת-צילום · wizard-step-error-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WIZARD_STEP_ERROR_T } from './wizard-step-error-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WIZARD_STEP_ERROR_T), "{\"k1\":\"בחרו את תחום העסק כדי להמשיך\",\"k2\":\"בחרו את גודל הארגון\",\"k3\":\"שם הארגון חובה\",\"k4\":\"שם איש קשר חובה\",\"k5\":\"טלפון חובה — נחזור אליכם לאישור\"}");
console.log('OK wizard-step-error-strings');
