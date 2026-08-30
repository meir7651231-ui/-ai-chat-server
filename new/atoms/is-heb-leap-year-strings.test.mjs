// בדיקת-צילום · is-heb-leap-year-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { IS_HEB_LEAP_YEAR_T } from './is-heb-leap-year-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(IS_HEB_LEAP_YEAR_T), "{\"k1\":\"Adar I\"}");
console.log('OK is-heb-leap-year-strings');
