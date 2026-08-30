// בדיקת-צילום · phone-issue-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PHONE_ISSUE_T } from './phone-issue-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PHONE_ISSUE_T), "{\"k1\":\"כנראה חסרה ספרת 0 מובילה: \",\"k2\":\"קצר מדי: \",\"k3\":\"לא מתחיל ב-0: \",\"k4\":\"אורך חריג (\",\"k5\":\" ספרות): \"}");
console.log('OK phone-issue-strings');
