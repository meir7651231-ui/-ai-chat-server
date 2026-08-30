// בדיקת-צילום · gematria-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './gematria-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.U), "[\"\",\"א\",\"ב\",\"ג\",\"ד\",\"ה\",\"ו\",\"ז\",\"ח\",\"ט\"]");
assert.strictEqual(JSON.stringify(D.T), "[\"\",\"י\",\"כ\",\"ל\",\"מ\",\"נ\",\"ס\",\"ע\",\"פ\",\"צ\"]");
assert.strictEqual(JSON.stringify(D.H), "[\"\",\"ק\",\"ר\",\"ש\",\"ת\",\"תק\",\"תר\",\"תש\",\"תת\",\"תתק\"]");
console.log('OK gematria-data');
