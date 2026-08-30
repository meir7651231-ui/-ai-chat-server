// בדיקת-צילום · net-check-terms — המונחים זהים ביט-אחר-ביט למקור.
import { NET_CHECK_TERMS } from './net-check-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NET_CHECK_TERMS), "{\"k1\":\"האתר עצמו\",\"k2\":\"כניסה לחשבון (Auth)\",\"k3\":\"חידוש-חיבור (Token)\",\"k4\":\"סנכרון נתונים (Firestore)\"}");
console.log('OK net-check-terms');
