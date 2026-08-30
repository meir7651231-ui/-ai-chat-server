// בדיקת-צילום · with-nedarim-hok-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WITH_NEDARIM_HOK_T } from './with-nedarim-hok-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WITH_NEDARIM_HOK_T), "{\"k1\":\"card\",\"k2\":\"הו״ק נדרים · \"}");
console.log('OK with-nedarim-hok-strings');
