// בדיקת-צילום · preview-telephony-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PREVIEW_TELEPHONY_T } from './preview-telephony-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PREVIEW_TELEPHONY_T), "{\"k1\":\"sim\",\"k2\":\"virtual\",\"k3\":\"יום שלישי 10:00 (בשעות)\",\"k4\":\"יום שלישי 20:00 (אחרי-שעות)\",\"k5\":\"שבת 11:00\",\"k6\":400}");
console.log('OK preview-telephony-strings');
