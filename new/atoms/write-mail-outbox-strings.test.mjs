// בדיקת-צילום · write-mail-outbox-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_MAIL_OUTBOX_T } from './write-mail-outbox-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_MAIL_OUTBOX_T), "{\"k1\":\"mailOutbox\",\"k2\":\"pending\"}");
console.log('OK write-mail-outbox-strings');
