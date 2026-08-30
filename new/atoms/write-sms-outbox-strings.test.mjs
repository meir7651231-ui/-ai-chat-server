// בדיקת-צילום · write-sms-outbox-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_SMS_OUTBOX_T } from './write-sms-outbox-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_SMS_OUTBOX_T), "{\"k1\":\"smsOutbox\",\"k2\":\"pending\"}");
console.log('OK write-sms-outbox-strings');
