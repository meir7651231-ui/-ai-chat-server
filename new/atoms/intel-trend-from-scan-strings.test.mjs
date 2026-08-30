// בדיקת-צילום · intel-trend-from-scan-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_TREND_FROM_SCAN_T } from './intel-trend-from-scan-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_TREND_FROM_SCAN_T), "{\"k1\":\"flat\",\"k2\":\"down\",\"k3\":100}");
console.log('OK intel-trend-from-scan-strings');
