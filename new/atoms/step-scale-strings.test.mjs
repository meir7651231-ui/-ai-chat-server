// בדיקת-צילום · step-scale-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { STEP_SCALE_T } from './step-scale-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STEP_SCALE_T), "{\"k1\":10}");
console.log('OK step-scale-strings');
