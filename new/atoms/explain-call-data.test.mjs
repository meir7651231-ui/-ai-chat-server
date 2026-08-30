// בדיקת-צילום · explain-call-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './explain-call-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.DOW_HE), "[\"ראשון\",\"שני\",\"שלישי\",\"רביעי\",\"חמישי\",\"שישי\",\"שבת\"]");
console.log('OK explain-call-data');
