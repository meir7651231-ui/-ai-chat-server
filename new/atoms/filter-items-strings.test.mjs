// בדיקת-צילום · filter-items-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FILTER_ITEMS_T } from './filter-items-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FILTER_ITEMS_T), "{\"k1\":\"untracked\",\"k2\":\"out\"}");
console.log('OK filter-items-strings');
