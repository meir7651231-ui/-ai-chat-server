// בדיקת-צילום · make-normalize-site-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './make-normalize-site-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.cf), "{}");
console.log('OK make-normalize-site-data');
