// בדיקת-צילום · support-day-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUPPORT_DAY_LABEL_T } from './support-day-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORT_DAY_LABEL_T), "{\"k1\":\"היום\",\"k2\":\"אתמול\"}");
console.log('OK support-day-label-strings');
