// בדיקת-צילום · build-course-daily-rows-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './build-course-daily-rows-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.DAY_NAMES), "[\"ראשון\",\"שני\",\"שלישי\",\"רביעי\",\"חמישי\",\"שישי\",\"שבת\"]");
console.log('OK build-course-daily-rows-data');
