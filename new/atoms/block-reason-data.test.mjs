// בדיקת-צילום · block-reason-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './block-reason-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.FULL_HOLIDAYS), "[\"ראש השנה\",\"ראש השנה ב׳\",\"יום כיפור\",\"סוכות\",\"שמחת תורה\",\"פסח\",\"שביעי של פסח\",\"שבועות\",\"תשעה באב\"]");
console.log('OK block-reason-data');
