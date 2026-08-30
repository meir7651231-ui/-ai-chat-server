// בדיקת-צילום · constellation-donor-constellation-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './constellation-donor-constellation-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.TIER_KEY), "{\"זהב\":\"gold\",\"כסף\":\"silver\",\"ארד\":\"bronze\",\"רדומה\":\"dormant\"}");
console.log('OK constellation-donor-constellation-data');
