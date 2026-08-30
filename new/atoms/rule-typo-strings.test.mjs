// בדיקת-צילום · rule-typo-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RULE_TYPO_T } from './rule-typo-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_TYPO_T), "{\"k1\":52}");
console.log('OK rule-typo-strings');
