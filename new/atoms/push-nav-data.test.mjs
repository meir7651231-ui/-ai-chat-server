// בדיקת-צילום · push-nav-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './push-nav-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.NAV_HIST_MAX), "20");
console.log('OK push-nav-data');
