// בדיקת-צילום · filter-deliveries-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FILTER_DELIVERIES_T } from './filter-deliveries-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FILTER_DELIVERIES_T), "{\"k1\":\"pickup\",\"k2\":\"איסוף\",\"k3\":\"enroute\",\"k4\":\"בדרך\",\"k5\":\"נמסר\"}");
console.log('OK filter-deliveries-strings');
