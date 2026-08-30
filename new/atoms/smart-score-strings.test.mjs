// בדיקת-צילום · smart-score-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SMART_SCORE_T } from './smart-score-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SMART_SCORE_T), "{\"k1\":100}");
console.log('OK smart-score-strings');
