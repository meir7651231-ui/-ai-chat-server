// בדיקת-צילום · intel-day-diff-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_DAY_DIFF_T } from './intel-day-diff-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_DAY_DIFF_T), "{\"k1\":86400000,\"k2\":10}");
console.log('OK intel-day-diff-strings');
