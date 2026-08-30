// בדיקת-צילום · wa-birthday-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WA_BIRTHDAY_TEXT_T } from './wa-birthday-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WA_BIRTHDAY_TEXT_T), "{\"k1\":\"wa.birthday\"}");
console.log('OK wa-birthday-text-strings');
