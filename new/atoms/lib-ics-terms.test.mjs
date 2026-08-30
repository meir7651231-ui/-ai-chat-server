// בדיקת-צילום · lib-ics-terms — המונחים זהים ביט-אחר-ביט למקור.
import { LIB_ICS_TERMS } from './lib-ics-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(LIB_ICS_TERMS), "{\"k1\":\"text/calendar;charset=utf-8\"}");
console.log('OK lib-ics-terms');
