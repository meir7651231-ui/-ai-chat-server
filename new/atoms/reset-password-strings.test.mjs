// בדיקת-צילום · reset-password-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RESET_PASSWORD_T } from './reset-password-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RESET_PASSWORD_T), "{\"k1\":\"auth/user-not-found\",\"k2\":\"לא נמצא משתמש עם האימייל הזה\",\"k3\":\"auth/invalid-email\",\"k4\":\"כתובת האימייל אינה תקינה\"}");
console.log('OK reset-password-strings');
