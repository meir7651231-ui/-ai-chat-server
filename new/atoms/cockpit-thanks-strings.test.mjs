// בדיקת-צילום · cockpit-thanks-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COCKPIT_THANKS_T } from './cockpit-thanks-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_THANKS_T), "{\"k1\":\"thanks:\",\"k2\":\"thanks\",\"k3\":\"תרם/ה \",\"k4\":\"היום\",\"k5\":\"לפני \",\"k6\":\" יום\",\"k7\":\"warm\"}");
console.log('OK cockpit-thanks-strings');
