// בדיקת-צילום · schedule-clash-text-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SCHEDULE_CLASH_TEXT_T } from './schedule-clash-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SCHEDULE_CLASH_TEXT_T), "{\"k1\":\"ended\",\"k2\":\"⚠ התנגשות לו\\\"ז: כבר משובצ/ת ל\\\"\",\"k3\":\"\\\" — יום \"}");
console.log('OK schedule-clash-text-strings');
