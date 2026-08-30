// בדיקת-צילום · purpose-key-of-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PURPOSE_KEY_OF_T } from './purpose-key-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PURPOSE_KEY_OF_T), "{\"k1\":\"_shared_\"}");
console.log('OK purpose-key-of-strings');
