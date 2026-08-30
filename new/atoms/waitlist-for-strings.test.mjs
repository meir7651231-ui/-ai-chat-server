// בדיקת-צילום · waitlist-for-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { WAITLIST_FOR_T } from './waitlist-for-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WAITLIST_FOR_T), "{\"k1\":\"wait\"}");
console.log('OK waitlist-for-strings');
