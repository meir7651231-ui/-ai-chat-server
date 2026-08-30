// בדיקת-צילום · suggestions-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUGGESTIONS_T } from './suggestions-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUGGESTIONS_T), "{\"k1\":\"active\",\"k2\":\"shop\",\"k3\":\"families\",\"k4\":\"courses\",\"k5\":\"punch\",\"k6\":\"הכרטיסייה נגמרה\"}");
console.log('OK suggestions-strings');
