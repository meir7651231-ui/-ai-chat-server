// בדיקת-צילום · fmt-date-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FMT_DATE_T } from './fmt-date-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FMT_DATE_T), "{\"k1\":10}");
console.log('OK fmt-date-strings');
