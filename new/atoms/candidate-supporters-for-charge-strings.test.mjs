// בדיקת-צילום · candidate-supporters-for-charge-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CANDIDATE_SUPPORTERS_FOR_CHARGE_T } from './candidate-supporters-for-charge-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CANDIDATE_SUPPORTERS_FOR_CHARGE_T), "{\"k1\":\"ext:\"}");
console.log('OK candidate-supporters-for-charge-strings');
