// בדיקת-צילום · reenroll-counts-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { REENROLL_COUNTS_T } from './reenroll-counts-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(REENROLL_COUNTS_T), "{\"k1\":\"yes\",\"k2\":\"hold\"}");
console.log('OK reenroll-counts-strings');
