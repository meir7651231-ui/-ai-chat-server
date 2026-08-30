// בדיקת-צילום · rule-prefix-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RULE_PREFIX_T } from './rule-prefix-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_PREFIX_T), "{\"k1\":80}");
console.log('OK rule-prefix-strings');
