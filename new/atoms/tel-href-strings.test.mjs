// בדיקת-צילום · tel-href-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TEL_HREF_T } from './tel-href-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TEL_HREF_T), "{\"k1\":\"tel:\"}");
console.log('OK tel-href-strings');
