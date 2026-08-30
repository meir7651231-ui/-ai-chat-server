// בדיקת-צילום · hash-pin-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HASH_PIN_T } from './hash-pin-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HASH_PIN_T), "{\"k1\":\"SHA-256\"}");
console.log('OK hash-pin-strings');
