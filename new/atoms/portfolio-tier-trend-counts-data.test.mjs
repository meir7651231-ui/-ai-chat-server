// בדיקת-צילום · portfolio-tier-trend-counts-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './portfolio-tier-trend-counts-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.order), "[\"זהב\",\"כסף\",\"ארד\",\"רדומה\"]");
console.log('OK portfolio-tier-trend-counts-data');
