// בדיקת-צילום · read-cloud-envelope-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { READ_CLOUD_ENVELOPE_T } from './read-cloud-envelope-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(READ_CLOUD_ENVELOPE_T), "{\"k1\":\"object\"}");
console.log('OK read-cloud-envelope-strings');
