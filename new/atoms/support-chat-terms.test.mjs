// בדיקת-צילום · support-chat-terms — המונחים זהים ביט-אחר-ביט למקור.
import { SUPPORT_CHAT_TERMS } from './support-chat-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUPPORT_CHAT_TERMS), "{\"k1\":\"admin\"}");
console.log('OK support-chat-terms');
