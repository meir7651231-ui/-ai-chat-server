// בדיקת-צילום · gen-recovery-key-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GEN_RECOVERY_KEY_T } from './gen-recovery-key-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GEN_RECOVERY_KEY_T), "{\"k1\":\"ABCDEFGHJKLMNPQRSTUVWXYZ23456789\",\"k2\":24}");
console.log('OK gen-recovery-key-strings');
