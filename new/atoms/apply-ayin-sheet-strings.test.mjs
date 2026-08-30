// בדיקת-צילום · apply-ayin-sheet-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { APPLY_AYIN_SHEET_T } from './apply-ayin-sheet-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(APPLY_AYIN_SHEET_T), "{\"k1\":\"eyes\",\"k2\":\"answer\",\"k3\":\"done\"}");
console.log('OK apply-ayin-sheet-strings');
