// בדיקת-צילום · unit-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { UNIT_LABEL_T } from './unit-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(UNIT_LABEL_T), "{\"k1\":\"entity.ayinUnit\",\"k2\":\"כמות\"}");
console.log('OK unit-label-strings');
