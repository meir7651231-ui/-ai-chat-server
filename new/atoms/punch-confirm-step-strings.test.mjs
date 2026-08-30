// בדיקת-צילום · punch-confirm-step-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PUNCH_CONFIRM_STEP_T } from './punch-confirm-step-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUNCH_CONFIRM_STEP_T), "{\"k1\":3000}");
console.log('OK punch-confirm-step-strings');
