import { normId } from './norm-id.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"\""],[["\"כהן לוי\""],"\"\""],[["\"abc\""],"\"\""],[["\"a@b.com\""],"\"\""],[["\"2026-08-24\""],"\"20260824\""],[["\"2026-08-24T12:00:00\""],"\"20260824120000\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"031234567\""],[["\"https://x.co\""],"\"\""],[["\"שלום עולם\""],"\"\""],[["\"12\""],"\"\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(normId(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ norm-id: ' + CASES.length + ' הקלטות-Golden — ירוק');
