// בדיקת-צילום · gen-join-code-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GEN_JOIN_CODE_T } from './gen-join-code-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GEN_JOIN_CODE_T), "{\"k1\":2166136261,\"k2\":16777619,\"k3\":36}");
console.log('OK gen-join-code-strings');
