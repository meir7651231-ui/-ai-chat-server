// בדיקת-צילום · cockpit-days-since-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COCKPIT_DAYS_SINCE_T } from './cockpit-days-since-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_DAYS_SINCE_T), "{\"k1\":86400000}");
console.log('OK cockpit-days-since-strings');
