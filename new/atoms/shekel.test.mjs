import { shekel } from './shekel.mjs';
const CASES = [[["\"\""],"\"₪0\""],[["\"אבג\""],"\"₪NaN\""],[["\"כהן לוי\""],"\"₪NaN\""],[["\"abc\""],"\"₪NaN\""],[["\"a@b.com\""],"\"₪NaN\""],[["\"2026-08-24\""],"\"₪NaN\""],[["\"2026-08-24T12:00:00\""],"\"₪NaN\""],[["\"0501234567\""],"\"₪501,234,567\""],[["\"03-1234567\""],"\"₪NaN\""],[["\"https://x.co\""],"\"₪NaN\""],[["\"שלום עולם\""],"\"₪NaN\""],[["\"12\""],"\"₪12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(shekel(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ shekel: ' + CASES.length + ' הקלטות-Golden — ירוק');
