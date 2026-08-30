import { waDigits as __pure_waDigits } from './wa-digits.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_wa_digits_T = {
  k1: 10,
  k2: 15,
};
const waDigits = (...a) => __pure_waDigits(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_wa_digits_T);
const CASES = [[["\"\""],"null"],[["\"אבג\""],"null"],[["\"כהן לוי\""],"null"],[["\"abc\""],"null"],[["\"a@b.com\""],"null"],[["\"2026-08-24\""],"\"97220260824\""],[["\"2026-08-24T12:00:00\""],"\"20260824120000\""],[["\"0501234567\""],"\"972501234567\""],[["\"03-1234567\""],"\"97231234567\""],[["\"https://x.co\""],"null"],[["\"שלום עולם\""],"null"],[["\"12\""],"null"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(waDigits(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ wa-digits: ' + CASES.length + ' הקלטות-Golden — ירוק');
