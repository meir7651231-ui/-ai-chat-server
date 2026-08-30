// בדיקת-צילום · lib-crypto-terms — המונחים זהים ביט-אחר-ביט למקור.
import { LIB_CRYPTO_TERMS } from './lib-crypto-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LIB_CRYPTO_TERMS), "{\"k1\":\"raw\",\"k2\":\"PBKDF2\",\"k3\":\"deriveKey\",\"k4\":\"SHA-256\",\"k5\":\"AES-GCM\",\"k6\":\"encrypt\",\"k7\":\"decrypt\"}");
console.log('OK lib-crypto-terms');
