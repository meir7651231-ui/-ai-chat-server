// בדיקת-צילום · signals-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/signals-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"SIGNAL\":{\"RECENT_DAYS\":90,\"GAP_DAYS\":365,\"DROP_RATIO\":0.5,\"JUMP_RATIO\":2,\"LAPSING_DAYS\":240}}");
console.log('OK signals-data');
