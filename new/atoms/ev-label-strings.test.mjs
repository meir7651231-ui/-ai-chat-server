// בדיקת-צילום · ev-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { EV_LABEL_T } from './ev-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EV_LABEL_T), "{\"k1\":\"custom\"}");
console.log('OK ev-label-strings');
