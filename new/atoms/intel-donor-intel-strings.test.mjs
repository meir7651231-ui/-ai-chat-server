// בדיקת-צילום · intel-donor-intel-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_DONOR_INTEL_T } from './intel-donor-intel-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_DONOR_INTEL_T), "{\"k1\":12}");
console.log('OK intel-donor-intel-strings');
