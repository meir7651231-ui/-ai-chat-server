// בדיקת-צילום · support-day-label-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUPPORT_DAY_LABEL_T } from './support-day-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORT_DAY_LABEL_T), "{\"k1\":\"היום\",\"k2\":\"אתמול\",\"k3\":10}");
console.log('OK support-day-label-strings');
