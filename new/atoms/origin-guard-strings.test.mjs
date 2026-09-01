// בדיקת-צילום · origin-guard-strings
import { S } from '../atoms/origin-guard-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"localhost\",\"k1\":\"undefined\"}");
console.log('OK origin-guard-strings');
