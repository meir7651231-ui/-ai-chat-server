// בדיקת-צילום · intel-forecast-from-scan-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { INTEL_FORECAST_FROM_SCAN_T } from './intel-forecast-from-scan-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(INTEL_FORECAST_FROM_SCAN_T), "{\"k1\":86400000,\"k2\":365,\"k3\":10,\"k4\":15,\"k5\":92,\"k6\":30,\"k7\":25}");
console.log('OK intel-forecast-from-scan-strings');
