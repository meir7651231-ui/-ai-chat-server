import { monthLabel } from './month-label.mjs';
const CASES = [[["\"\""],"\"undefined/\""],[["\"אבג\""],"\"undefined/אבג\""],[["\"כהן לוי\""],"\"undefined/כהן לוי\""],[["\"abc\""],"\"undefined/abc\""],[["\"a@b.com\""],"\"undefined/a@b.com\""],[["\"2026-08-24\""],"\"08/2026\""],[["\"2026-08-24T12:00:00\""],"\"08/2026\""],[["\"0501234567\""],"\"undefined/0501234567\""],[["\"03-1234567\""],"\"1234567/03\""],[["\"https://x.co\""],"\"undefined/https://x.co\""],[["\"שלום עולם\""],"\"undefined/שלום עולם\""],[["\"12\""],"\"undefined/12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(monthLabel(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ month-label: ' + CASES.length + ' הקלטות-Golden — ירוק');
