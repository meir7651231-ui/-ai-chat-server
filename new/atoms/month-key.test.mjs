import { monthKey } from './month-key.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08\""],[["\"2026-08-24T12:00:00\""],"\"2026-08\""],[["\"0501234567\""],"\"0501234\""],[["\"03-1234567\""],"\"03-1234\""],[["\"https://x.co\""],"\"https:/\""],[["\"שלום עולם\""],"\"שלום עו\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(monthKey(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ month-key: ' + CASES.length + ' הקלטות-Golden — ירוק');
