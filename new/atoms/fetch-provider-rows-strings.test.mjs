// בדיקת-צילום · fetch-provider-rows-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { FETCH_PROVIDER_ROWS_T } from './fetch-provider-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FETCH_PROVIDER_ROWS_T), "{\"k1\":\"incomingPayments\",\"k2\":\"provider\"}");
console.log('OK fetch-provider-rows-strings');
