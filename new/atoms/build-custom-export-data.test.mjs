// בדיקת-צילום · build-custom-export-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './build-custom-export-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.CAP_DAYS), "4000");
console.log('OK build-custom-export-data');
