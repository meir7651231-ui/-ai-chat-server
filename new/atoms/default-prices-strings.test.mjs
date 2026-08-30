// בדיקת-צילום · default-prices-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DEFAULT_PRICES_T } from './default-prices-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DEFAULT_PRICES_T), "{\"k1\":290,\"k2\":120,\"k3\":70,\"k4\":180,\"k5\":60,\"k6\":90,\"k7\":80,\"k8\":1500,\"k9\":55000,\"k10\":9000}");
console.log('OK default-prices-strings');
