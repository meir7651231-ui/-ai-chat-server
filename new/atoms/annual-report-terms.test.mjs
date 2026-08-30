// בדיקת-צילום · annual-report-terms — המונחים זהים ביט-אחר-ביט למקור.
import { ANNUAL_REPORT_TERMS } from './annual-report-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ANNUAL_REPORT_TERMS), "{\"k1\":\"text/plain;charset=utf-8\"}");
console.log('OK annual-report-terms');
