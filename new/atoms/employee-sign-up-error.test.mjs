/** בדיקת-חוזה · employee-sign-up-error — סדר-שגיאות · גבולות · תקין. */
import { employeeSignUpError as __pure_employeeSignUpError } from './employee-sign-up-error.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_employeeSignUpError_EMPLOYEE_SIGN_UP_ERROR_T = {
  k1: "כתובת האימייל אינה תקינה",
  k2: "מספר טלפון תקין הוא שדה חובה",
  k3: "הסיסמה חייבת להיות לפחות 6 תווים",
  k4: "קוד-ההזמנה מהמנהל הוא שדה חובה",
};
const employeeSignUpError = (...a) => __pure_employeeSignUpError(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_employeeSignUpError_EMPLOYEE_SIGN_UP_ERROR_T);
import assert from 'node:assert';
const ok = ['a@b.co', '050-1234567', '123456', 'slug.777'];
assert.strictEqual(employeeSignUpError(...ok), '');
assert.strictEqual(employeeSignUpError('bad', ...ok.slice(1)), 'כתובת האימייל אינה תקינה');
assert.strictEqual(employeeSignUpError(ok[0], 'abc', ok[2], ok[3]), 'מספר טלפון תקין הוא שדה חובה');
assert.strictEqual(employeeSignUpError(ok[0], ok[1], '12345', ok[3]), 'הסיסמה חייבת להיות לפחות 6 תווים');
assert.strictEqual(employeeSignUpError(ok[0], ok[1], ok[2], '  '), 'קוד-ההזמנה מהמנהל הוא שדה חובה');
// סדר: מייל-שבור + טלפון-שבור ⇒ שגיאת-המייל
assert.strictEqual(employeeSignUpError('x', 'y', '1', ''), 'כתובת האימייל אינה תקינה');
// טלפון בינלאומי עם +
assert.strictEqual(employeeSignUpError(ok[0], '+972 50 123 4567', ok[2], ok[3]), '');
console.log('✓ employee-sign-up-error');
