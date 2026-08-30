// בדיקת-צילום · gem-year-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GEM_YEAR_T } from './gem-year-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GEM_YEAR_T), "{\"k1\":1000}");
console.log('OK gem-year-strings');
