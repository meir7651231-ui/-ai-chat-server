// בדיקת-צילום · sign-up-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SIGN_UP_T } from './sign-up-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SIGN_UP_T), "{\"k1\":\"auth/email-already-in-use\",\"k2\":\"האימייל כבר רשום — נסו להתחבר או לאפס סיסמה\",\"k3\":\"auth/weak-password\",\"k4\":\"הסיסמה חלשה מדי — לפחות 6 תווים\",\"k5\":\"auth/invalid-email\",\"k6\":\"כתובת האימייל אינה תקינה\",\"k7\":\"auth/operation-not-allowed\",\"k8\":\"ההרשמה סגורה כרגע — פנו למנהל המערכת\"}");
console.log('OK sign-up-strings');
