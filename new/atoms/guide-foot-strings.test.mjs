// בדיקת-צילום · guide-foot-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GUIDE_FOOT_T } from './guide-foot-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GUIDE_FOOT_T), "{\"k1\":\"המדריך המלא והמפורט נמצא בקובץ \\\"מדריך למשתמש\\\" — מסך-מסך וכפתור-כפתור.\"}");
console.log('OK guide-foot-strings');
