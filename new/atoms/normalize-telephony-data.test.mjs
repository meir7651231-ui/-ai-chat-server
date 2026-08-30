// בדיקת-צילום · normalize-telephony-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './normalize-telephony-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.TEL_KINDS), "[\"sim\",\"virtual\",\"whatsapp\"]");
console.log('OK normalize-telephony-data');
