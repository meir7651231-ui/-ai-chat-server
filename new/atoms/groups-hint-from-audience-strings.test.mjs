// בדיקת-צילום · groups-hint-from-audience-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GROUPS_HINT_FROM_AUDIENCE_T } from './groups-hint-from-audience-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GROUPS_HINT_FROM_AUDIENCE_T), "{\"k1\":10,\"k2\":12}");
console.log('OK groups-hint-from-audience-strings');
