// בדיקת-צילום · fold-ics-line-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FOLD_ICS_LINE_T } from './fold-ics-line-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FOLD_ICS_LINE_T), "{\"k1\":75}");
console.log('OK fold-ics-line-strings');
