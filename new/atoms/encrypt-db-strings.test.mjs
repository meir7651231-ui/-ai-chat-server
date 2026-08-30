// בדיקת-צילום · encrypt-db-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ENCRYPT_DB_T } from './encrypt-db-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENCRYPT_DB_T), "{\"k1\":\"raw\",\"k2\":\"AES-GCM\",\"k3\":\"encrypt\",\"k4\":\"decrypt\"}");
console.log('OK encrypt-db-strings');
