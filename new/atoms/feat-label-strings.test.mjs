// בדיקת-צילום · feat-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FEAT_LABEL_T } from './feat-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FEAT_LABEL_T), "{\"k1\":\"nav.ayin\",\"k2\":\"מעקב טיפול\"}");
console.log('OK feat-label-strings');
