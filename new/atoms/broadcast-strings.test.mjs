// בדיקת-צילום · broadcast-strings
import { S } from '../atoms/broadcast-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"ended\",\"k1\":\"wait\",\"k2\":\"שלום, כאן \",\"k3\":\"העמותה\",\"k4\":\" — הודעה בנוגע ל\\\"\"}");
console.log('OK broadcast-strings');
