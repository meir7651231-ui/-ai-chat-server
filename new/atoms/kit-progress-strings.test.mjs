// בדיקת-צילום · kit-progress-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { KIT_PROGRESS_T } from './kit-progress-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(KIT_PROGRESS_T), "{\"k1\":100}");
console.log('OK kit-progress-strings');
