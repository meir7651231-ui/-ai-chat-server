// בדיקת-צילום · validate-heb-month-names-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { VALIDATE_HEB_MONTH_NAMES_T } from './validate-heb-month-names-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(VALIDATE_HEB_MONTH_NAMES_T), "{\"k1\":3761,\"k2\":440,\"k3\":12}");
console.log('OK validate-heb-month-names-strings');
