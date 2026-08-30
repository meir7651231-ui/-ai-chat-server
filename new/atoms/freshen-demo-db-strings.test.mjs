// בדיקת-צילום · freshen-demo-db-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FRESHEN_DEMO_DB_T } from './freshen-demo-db-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FRESHEN_DEMO_DB_T), "{\"k1\":86400000,\"k2\":10}");
console.log('OK freshen-demo-db-strings');
