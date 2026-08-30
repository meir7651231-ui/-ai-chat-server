// בדיקת-צילום · rule-skeleton-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { RULE_SKELETON_T } from './rule-skeleton-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RULE_SKELETON_T), "{\"k1\":58}");
console.log('OK rule-skeleton-strings');
