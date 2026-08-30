// בדיקת-צילום · plan-nedarim-sync-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PLAN_NEDARIM_SYNC_T } from './plan-nedarim-sync-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PLAN_NEDARIM_SYNC_T), "{\"k1\":\"extId\",\"k2\":\"phone\",\"k3\":\"email\",\"k4\":\"address\",\"k5\":\"idNum\",\"k6\":40}");
console.log('OK plan-nedarim-sync-strings');
