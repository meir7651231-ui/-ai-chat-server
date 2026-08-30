// בדיקת-צילום · migrate-supporters-to-keyed-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MIGRATE_SUPPORTERS_TO_KEYED_T } from './migrate-supporters-to-keyed-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MIGRATE_SUPPORTERS_TO_KEYED_T), "{\"k1\":\"supporters\",\"k2\":\"events\"}");
console.log('OK migrate-supporters-to-keyed-strings');
