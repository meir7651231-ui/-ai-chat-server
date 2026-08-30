// בדיקת-צילום · merge-families-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MERGE_FAMILIES_T } from './merge-families-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MERGE_FAMILIES_T), "{\"k1\":\"active\",\"k2\":\"pending\",\"k3\":\"inactive\",\"k4\":\"| מוזג: \"}");
console.log('OK merge-families-strings');
