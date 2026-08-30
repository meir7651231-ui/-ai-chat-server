// בדיקת-צילום · term-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TERM_LABEL_T } from './term-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TERM_LABEL_T), "{\"k1\":\"months\",\"k2\":\" חודשים\"}");
console.log('OK term-label-strings');
