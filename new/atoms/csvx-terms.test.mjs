// בדיקת-צילום · csvx-terms — המונחים זהים ביט-אחר-ביט למקור.
import { CSVX_TERMS } from './csvx-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CSVX_TERMS), "{\"k1\":\"text/csv;charset=utf-8\"}");
console.log('OK csvx-terms');
