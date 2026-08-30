// בדיקת-צילום · annual-all-lines-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ANNUAL_ALL_LINES_T } from './annual-all-lines-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ANNUAL_ALL_LINES_T), "{\"k1\":\"אין תורמים עם תרומות בשנת \"}");
console.log('OK annual-all-lines-strings');
