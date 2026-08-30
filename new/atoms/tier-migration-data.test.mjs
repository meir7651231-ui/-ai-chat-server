// בדיקת-צילום · tier-migration-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/tier-migration-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"TIER_ORDER\":[\"זהב\",\"כסף\",\"ארד\",\"רדומה\"],\"TIER_RANK\":{\"זהב\":4,\"כסף\":3,\"ארד\":2,\"רדומה\":1}}");
console.log('OK tier-migration-data');
