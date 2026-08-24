import { gem } from './gem.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"\""],[["\"כהן לוי\""],"\"\""],[["\"abc\""],"\"\""],[["\"a@b.com\""],"\"\""],[["\"2026-08-24\""],"\"\""],[["\"2026-08-24T12:00:00\""],"\"\""],[["\"0501234567\""],"\"ס״ז\""],[["\"03-1234567\""],"\"\""],[["\"https://x.co\""],"\"\""],[["\"שלום עולם\""],"\"\""],[["\"12\""],"\"י״ב\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(gem(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ gem: ' + CASES.length + ' הקלטות-Golden — ירוק');
