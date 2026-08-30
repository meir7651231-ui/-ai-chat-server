// בדיקת-צילום · col-ref-to-index-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COL_REF_TO_INDEX_T } from './col-ref-to-index-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COL_REF_TO_INDEX_T), "{\"k1\":26}");
console.log('OK col-ref-to-index-strings');
