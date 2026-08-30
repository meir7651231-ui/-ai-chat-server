// בדיקת-צילום · public-site-on-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PUBLIC_SITE_ON_T } from './public-site-on-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUBLIC_SITE_ON_T), "{\"k1\":\"shell.publicsite\"}");
console.log('OK public-site-on-strings');
