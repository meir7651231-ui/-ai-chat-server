// בדיקת-צילום · lesson-tier-options-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { LESSON_TIER_OPTIONS_T } from './lesson-tier-options-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LESSON_TIER_OPTIONS_T), "{\"k1\":\"מחיר מלא · ₪\",\"k2\":\"הנחה 1\",\"k3\":\"הנחה 2\",\"k4\":\"הנחה 3\"}");
console.log('OK lesson-tier-options-strings');
