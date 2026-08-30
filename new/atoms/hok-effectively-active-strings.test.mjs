// בדיקת-צילום · hok-effectively-active-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { HOK_EFFECTIVELY_ACTIVE_T } from './hok-effectively-active-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HOK_EFFECTIVELY_ACTIVE_T), "{\"k1\":\"נדרים\",\"k2\":\"סולה\"}");
console.log('OK hok-effectively-active-strings');
