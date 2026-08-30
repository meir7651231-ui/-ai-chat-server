// בדיקת-צילום · ids-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/ids-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"DEVICE_TAG_KEY\":\"maor_device_tag\",\"cachedTag\":null}");
console.log('OK ids-data');
