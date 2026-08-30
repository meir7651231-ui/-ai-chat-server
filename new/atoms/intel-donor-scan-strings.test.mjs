// בדיקת-צילום · intel-donor-scan-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_DONOR_SCAN_T } from './intel-donor-scan-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_DONOR_SCAN_T), "{\"k1\":12}");
console.log('OK intel-donor-scan-strings');
