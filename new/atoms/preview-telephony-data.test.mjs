// בדיקת-צילום · preview-telephony-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './preview-telephony-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.caller), "\"050-1234567\"");
console.log('OK preview-telephony-data');
