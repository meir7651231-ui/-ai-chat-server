// בדיקת-צילום · advance-status-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './advance-status-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.ORDER), "[\"pickup\",\"enroute\",\"delivered\"]");
console.log('OK advance-status-data');
