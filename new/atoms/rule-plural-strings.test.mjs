// בדיקת-צילום · rule-plural-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { RULE_PLURAL_T } from './rule-plural-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_PLURAL_T), "{\"k1\":\"ימ\",\"k2\":\"ות\"}");
console.log('OK rule-plural-strings');
