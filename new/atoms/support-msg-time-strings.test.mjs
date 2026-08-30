// בדיקת-צילום · support-msg-time-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUPPORT_MSG_TIME_T } from './support-msg-time-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORT_MSG_TIME_T), "{\"k1\":\"2-digit\"}");
console.log('OK support-msg-time-strings');
