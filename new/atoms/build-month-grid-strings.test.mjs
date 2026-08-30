// בדיקת-צילום · build-month-grid-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { BUILD_MONTH_GRID_T } from './build-month-grid-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_MONTH_GRID_T), "{\"k1\":\"long\",\"k2\":\"numeric\",\"k3\":\"he-u-ca-hebrew\"}");
console.log('OK build-month-grid-strings');
