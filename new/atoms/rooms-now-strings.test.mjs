// בדיקת-צילום · rooms-now-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ROOMS_NOW_T } from './rooms-now-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ROOMS_NOW_T), "{\"k1\":60}");
console.log('OK rooms-now-strings');
