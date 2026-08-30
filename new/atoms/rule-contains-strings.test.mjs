// בדיקת-צילום · rule-contains-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RULE_CONTAINS_T } from './rule-contains-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_CONTAINS_T), "{\"k1\":62}");
console.log('OK rule-contains-strings');
