// בדיקת-צילום · coral-palette-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CORAL_PALETTE_T } from './coral-palette-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CORAL_PALETTE_T), "{\"k1\":\"#FFFCFA\",\"k2\":\"#FBF1EF\",\"k3\":\"#FFF3F0\",\"k4\":255,\"k5\":60,\"k6\":360,\"k7\":120,\"k8\":180,\"k9\":240,\"k10\":300}");
console.log('OK coral-palette-strings');
