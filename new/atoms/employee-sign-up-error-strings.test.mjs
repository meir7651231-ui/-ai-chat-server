// בדיקת-צילום · employee-sign-up-error-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { EMPLOYEE_SIGN_UP_ERROR_T } from './employee-sign-up-error-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EMPLOYEE_SIGN_UP_ERROR_T), "{\"k1\":\"כתובת האימייל אינה תקינה\",\"k2\":\"מספר טלפון תקין הוא שדה חובה\",\"k3\":\"הסיסמה חייבת להיות לפחות 6 תווים\",\"k4\":\"קוד-ההזמנה מהמנהל הוא שדה חובה\"}");
console.log('OK employee-sign-up-error-strings');
