// בדיקת-צילום · stale-boxes-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STALE_BOXES_T } from './stale-boxes-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STALE_BOXES_T), "{\"k1\":\"home\"}");
console.log('OK stale-boxes-strings');
