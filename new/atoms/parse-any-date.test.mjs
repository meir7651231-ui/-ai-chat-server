import { parseAnyDate as __pure_parseAnyDate } from './parse-any-date.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_parse_any_date_T = {
  k1: 12,
  k2: 31,
  k3: 100,
  k4: 10,
  k5: 2000,
  k6: 1900,
  k7: 1899,
  k8: 11,
  k9: 30,
};
const parseAnyDate = (...a) => __pure_parseAnyDate(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_parse_any_date_T);
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"\""],[["\"כהן לוי\""],"\"\""],[["\"abc\""],"\"\""],[["\"a@b.com\""],"\"\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"\""],[["\"0501234567\""],"\"\""],[["\"03-1234567\""],"\"\""],[["\"https://x.co\""],"\"\""],[["\"שלום עולם\""],"\"\""],[["\"12\""],"\"\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(parseAnyDate(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ parse-any-date: ' + CASES.length + ' הקלטות-Golden — ירוק');
