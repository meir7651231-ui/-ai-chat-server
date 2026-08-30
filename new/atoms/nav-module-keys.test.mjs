// בדיקת-צילום · nav-module-keys — תשעת המודולים בסדר הקנוני, ביט-אחר-ביט.
import { NAV_MODULE_KEYS } from './nav-module-keys.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NAV_MODULE_KEYS), '["families","courses","calendar","diary","supporters","reports","tzedaka","shop","shop7"]');
console.log('OK nav-module-keys');
