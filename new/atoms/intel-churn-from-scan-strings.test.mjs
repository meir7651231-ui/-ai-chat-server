// בדיקת-צילום · intel-churn-from-scan-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_CHURN_FROM_SCAN_T } from './intel-churn-from-scan-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_CHURN_FROM_SCAN_T), "{\"k1\":365,\"k2\":30,\"k3\":100,\"k4\":50}");
console.log('OK intel-churn-from-scan-strings');
