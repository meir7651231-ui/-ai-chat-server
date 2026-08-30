// בדיקת-צילום · change-password-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CHANGE_PASSWORD_T } from './change-password-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CHANGE_PASSWORD_T), "{\"k1\":\"אין משתמש מחובר — התחברו ונסו שוב\",\"k2\":\"auth/wrong-password\",\"k3\":\"auth/invalid-credential\",\"k4\":\"auth/invalid-login-credentials\",\"k5\":\"הסיסמה הנוכחית שגויה\",\"k6\":\"auth/weak-password\",\"k7\":\"הסיסמה החדשה חלשה מדי — לפחות 6 תווים\"}");
console.log('OK change-password-strings');
