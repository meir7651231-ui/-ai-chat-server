// בדיקת-צילום · cockpit-at-risk-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COCKPIT_AT_RISK_T } from './cockpit-at-risk-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_AT_RISK_T), "{\"k1\":60}");
console.log('OK cockpit-at-risk-strings');
