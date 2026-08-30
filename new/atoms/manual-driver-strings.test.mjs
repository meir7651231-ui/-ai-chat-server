// בדיקת-צילום · manual-driver-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MANUAL_DRIVER_T } from './manual-driver-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MANUAL_DRIVER_T), "{\"k1\":\"tel:\",\"k2\":\"manual\",\"k3\":\"חיוג בלחיצה (טלפון קיים)\"}");
console.log('OK manual-driver-strings');
