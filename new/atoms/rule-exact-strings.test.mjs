// בדיקת-צילום · rule-exact-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RULE_EXACT_T } from './rule-exact-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_EXACT_T), "{\"k1\":100}");
console.log('OK rule-exact-strings');
