// בדיקת-צילום · send-support-reply-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SEND_SUPPORT_REPLY_T } from './send-support-reply-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEND_SUPPORT_REPLY_T), "{\"k1\":\"messages\",\"k2\":\"admin\",\"k3\":120,\"tbl1\":\"supportChats\"}");
console.log('OK send-support-reply-strings');
