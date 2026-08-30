// בדיקת-צילום · site-langs-data — ביט-אחר-ביט.
import { SITE_LANGS } from './site-langs-data.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(SITE_LANGS, ['he', 'en', 'yi']);
console.log('OK site-langs-data');
