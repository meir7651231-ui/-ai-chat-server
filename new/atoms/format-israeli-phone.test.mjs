import { formatIsraeliPhone as __pure_formatIsraeliPhone } from './format-israeli-phone.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_format_israeli_phone_T = {
  k1: 10,
};
const formatIsraeliPhone = (...a) => __pure_formatIsraeliPhone(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_format_israeli_phone_T);
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"02-0260824\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\""],"\"050-1234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"שלום עולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(formatIsraeliPhone(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ format-israeli-phone: ' + CASES.length + ' הקלטות-Golden — ירוק');
