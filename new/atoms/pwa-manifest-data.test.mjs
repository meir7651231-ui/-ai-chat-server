// בדיקת-צילום · pwa-manifest-data — ביט-אחר-ביט.
import * as M from './pwa-manifest-data.mjs';
import assert from 'node:assert';
assert.strictEqual(M.PWA_FLAG, 'shell.pwa');
assert.strictEqual(M.SW_FILE, 'sw.js');
assert.strictEqual(M.SHORT_NAME_MAX, 12);
assert.strictEqual(M.MANIFEST_TYPE, 'application/manifest+json');
assert.strictEqual(M.MANIFEST_LANG, 'he');
assert.strictEqual(M.MANIFEST_DIR, 'rtl');
assert.strictEqual(M.MANIFEST_DISPLAY, 'standalone');
assert.strictEqual(M.MANIFEST_ORIENTATION, 'portrait-primary');
assert.strictEqual(M.MANIFEST_THEME, '#211d17');
assert.strictEqual(M.MANIFEST_BG, '#faf7f2');
assert.strictEqual(M.ICON_TYPE, 'image/png');
assert.strictEqual(M.MANIFEST_ICONS.length, 3);
assert.strictEqual(M.MANIFEST_ICONS[2].purpose, 'maskable');
assert.strictEqual(M.MANIFEST_ICONS[0].src, 'icons/icon-192.png');
console.log('OK pwa-manifest-data');
