// בדיקת-צילום · gen-recovery-key-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { GEN_RECOVERY_KEY_T } from './gen-recovery-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GEN_RECOVERY_KEY_T), "{\"k1\":\"ABCDEFGHJKLMNPQRSTUVWXYZ23456789\"}");
console.log('OK gen-recovery-key-strings');
