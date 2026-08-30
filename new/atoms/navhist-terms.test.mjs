// בדיקת-צילום · navhist-terms — המונחים זהים ביט-אחר-ביט למקור.
import { NAVHIST_TERMS } from './navhist-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NAVHIST_TERMS), "{\"k1\":\"↩ חזרה\",\"k2\":\"חזרה למסך הקודם\",\"k3\":\"families\",\"k4\":\"courses\"}");
console.log('OK navhist-terms');
