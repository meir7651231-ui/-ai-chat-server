// בדיקת-צילום · sign-up-error-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SIGN_UP_ERROR_T } from './sign-up-error-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SIGN_UP_ERROR_T), "{\"k1\":\"שם הארגון הוא שדה חובה\",\"k2\":\"שם איש הקשר הוא שדה חובה\",\"k3\":\"מספר טלפון תקין הוא שדה חובה — נחזור אליכם לאישור\",\"k4\":\"כתובת האימייל אינה תקינה\",\"k5\":\"הסיסמה חייבת להיות לפחות 6 תווים\",\"k6\":\"הסיסמאות אינן זהות\"}");
console.log('OK sign-up-error-strings');
