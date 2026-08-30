// בדיקת-צילום · collection-score-delta-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COLLECTION_SCORE_DELTA_T } from './collection-score-delta-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COLLECTION_SCORE_DELTA_T), "{\"k1\":86400000}");
console.log('OK collection-score-delta-strings');
