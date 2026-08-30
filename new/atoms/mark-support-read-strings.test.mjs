// בדיקת-צילום · mark-support-read-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MARK_SUPPORT_READ_T } from './mark-support-read-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MARK_SUPPORT_READ_T), "{\"k1\":\"admin\",\"k2\":\"unreadAdmin\",\"k3\":\"unreadUser\",\"k4\":\"supportChats\"}");
console.log('OK mark-support-read-strings');
