// בדיקת-צילום · build-month-grid-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { BUILD_MONTH_GRID_T } from './build-month-grid-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_MONTH_GRID_T), "{\"k1\":\"long\",\"k2\":\"numeric\",\"k3\":\"he-u-ca-hebrew\",\"k4\":42,\"k5\":15,\"k6\":31}");
console.log('OK build-month-grid-strings');
