// בדיקת-צילום · site-palette-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SITE_PALETTE_T } from './site-palette-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SITE_PALETTE_T), "{\"k1\":255,\"k2\":60,\"k3\":360,\"k4\":120,\"k5\":180,\"k6\":240,\"k7\":300}");
console.log('OK site-palette-strings');
