// בדיקת-צילום · custom-export-terms — המונחים זהים ביט-אחר-ביט למקור.
import { CUSTOM_EXPORT_TERMS } from './custom-export-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CUSTOM_EXPORT_TERMS), "{\"k1\":\"memorial\",\"k2\":\"anniversary\",\"k3\":\"bday\"}");
console.log('OK custom-export-terms');
