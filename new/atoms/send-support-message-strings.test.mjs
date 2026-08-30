// בדיקת-צילום · send-support-message-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SEND_SUPPORT_MESSAGE_T } from './send-support-message-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEND_SUPPORT_MESSAGE_T), "{\"k1\":\"supportChats\",\"k2\":\"messages\",\"k3\":\"user\",\"k4\":120}");
console.log('OK send-support-message-strings');
