import { ayinActive as __pure_ayinActive } from './ayin-active.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_ayinActive_AYIN_ACTIVE_T = {
  k1: "new",
};
const ayinActive = (...a) => __pure_ayinActive(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayinActive_AYIN_ACTIVE_T);
const CASES = [[["\"\""],"false"],[["\"אבג\""],"true"],[["\"כהן לוי\""],"true"],[["\"abc\""],"true"],[["\"a@b.com\""],"true"],[["\"2026-08-24\""],"true"],[["\"2026-08-24T12:00:00\""],"true"],[["\"0501234567\""],"true"],[["\"03-1234567\""],"true"],[["\"https://x.co\""],"true"],[["\"שלום עולם\""],"true"],[["\"12\""],"true"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(ayinActive(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ ayin-active: ' + CASES.length + ' הקלטות-Golden — ירוק');
