// בדיקת-צילום · match-incoming-to-planned-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MATCH_INCOMING_TO_PLANNED_T } from './match-incoming-to-planned-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MATCH_INCOMING_TO_PLANNED_T), "{\"k1\":100,\"k2\":10,\"k3\":60}");
console.log('OK match-incoming-to-planned-strings');
