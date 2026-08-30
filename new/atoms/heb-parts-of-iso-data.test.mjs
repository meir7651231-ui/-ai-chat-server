// בדיקת-צילום · heb-parts-of-iso-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './heb-parts-of-iso-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.HP_CACHE_MAX), "3000");
console.log('OK heb-parts-of-iso-data');
