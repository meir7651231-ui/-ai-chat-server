// בדיקת-צילום · norm-search-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { NORM_SEARCH_T } from './norm-search-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NORM_SEARCH_T), "{\"k1\":\"כ\",\"k2\":\"מ\",\"k3\":\"נ\",\"k4\":\"פ\",\"k5\":\"צ\"}");
console.log('OK norm-search-strings');
