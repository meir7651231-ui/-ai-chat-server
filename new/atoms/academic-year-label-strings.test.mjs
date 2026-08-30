// בדיקת-צילום · academic-year-label-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ACADEMIC_YEAR_LABEL_T } from './academic-year-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ACADEMIC_YEAR_LABEL_T), "{\"k1\":100}");
console.log('OK academic-year-label-strings');
