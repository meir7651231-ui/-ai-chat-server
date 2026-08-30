// בדיקת-צילום · group-label-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { GROUP_LABEL_OF_T } from './group-label-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GROUP_LABEL_OF_T), "{\"k1\":\"קבוצה \"}");
console.log('OK group-label-of-strings');
