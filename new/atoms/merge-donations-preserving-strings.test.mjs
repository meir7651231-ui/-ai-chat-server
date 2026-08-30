// בדיקת-צילום · merge-donations-preserving-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MERGE_DONATIONS_PRESERVING_T } from './merge-donations-preserving-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MERGE_DONATIONS_PRESERVING_T), "{\"k1\":\"supporters\",\"k2\":\"number\"}");
console.log('OK merge-donations-preserving-strings');
