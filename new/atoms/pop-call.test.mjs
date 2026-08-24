import { popCall } from './pop-call.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"אב\""],[["\"כהן לוי\""],"\"כהן לו\""],[["\"abc\""],"\"ab\""],[["\"a@b.com\""],"\"a@b.co\""],[["\"2026-08-24\""],"\"2026-08-2\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:0\""],[["\"0501234567\""],"\"050123456\""],[["\"03-1234567\""],"\"03-123456\""],[["\"https://x.co\""],"\"https://x.c\""],[["\"שלום עולם\""],"\"שלום עול\""],[["\"12\""],"\"1\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(popCall(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ pop-call: ' + CASES.length + ' הקלטות-Golden — ירוק');
