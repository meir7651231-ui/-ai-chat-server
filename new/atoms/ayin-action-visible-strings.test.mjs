// בדיקת-צילום · ayin-action-visible-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AYIN_ACTION_VISIBLE_T } from './ayin-action-visible-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_ACTION_VISIBLE_T), "{\"k1\":\"done\",\"k2\":\"new\",\"k3\":\"eyes\"}");
console.log('OK ayin-action-visible-strings');
