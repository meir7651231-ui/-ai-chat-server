// בדיקת-צילום · site-langs-allow — ביט-אחר-ביט.
import { SITE_LANGS } from './site-langs-allow.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(SITE_LANGS, ['he', 'en', 'yi']);
console.log('OK site-langs-allow');
