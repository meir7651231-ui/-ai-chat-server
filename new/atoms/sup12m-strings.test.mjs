// בדיקת-צילום · sup12m-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUP12M_T } from './sup12m-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP12M_T), "{\"k1\":365}");
console.log('OK sup12m-strings');
