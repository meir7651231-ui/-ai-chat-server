// בדיקת-צילום · intel-strings
import { S } from '../atoms/intel-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"flat\",\"k1\":\"down\"}");
console.log('OK intel-strings');
