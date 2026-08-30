// בדיקת-צילום · range-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { RANGE_LABEL_T } from './range-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RANGE_LABEL_T), "{\"k1\":\"כל התאריכים\",\"k2\":\"מ-\",\"k3\":\"עד \"}");
console.log('OK range-label-strings');
