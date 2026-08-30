// בדיקת-צילום · team-intel-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/team-intel-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"RECENT_LIMIT\":6}");
console.log('OK team-intel-data');
