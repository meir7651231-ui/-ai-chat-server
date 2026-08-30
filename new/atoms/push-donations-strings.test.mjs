// בדיקת-צילום · push-donations-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PUSH_DONATIONS_T } from './push-donations-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUSH_DONATIONS_T), "{\"k1\":400}");
console.log('OK push-donations-strings');
