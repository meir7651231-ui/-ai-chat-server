// בדיקת-צילום · sup-score-bins-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUP_SCORE_BINS_T } from './sup-score-bins-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP_SCORE_BINS_T), "{\"k1\":10,\"k2\":100}");
console.log('OK sup-score-bins-strings');
