// בדיקת-צילום · strip-supporter-donations-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STRIP_SUPPORTER_DONATIONS_T } from './strip-supporter-donations-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STRIP_SUPPORTER_DONATIONS_T), "{\"k1\":\"supporters\",\"k2\":\"object\"}");
console.log('OK strip-supporter-donations-strings');
