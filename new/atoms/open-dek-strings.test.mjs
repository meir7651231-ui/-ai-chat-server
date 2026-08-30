// בדיקת-צילום · open-dek-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { OPEN_DEK_T } from './open-dek-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(OPEN_DEK_T), "{\"k1\":\"pass\",\"k2\":\"raw\",\"k3\":\"AES-GCM\",\"k4\":\"encrypt\",\"k5\":\"decrypt\"}");
console.log('OK open-dek-strings');
