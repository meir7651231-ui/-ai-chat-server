import { supportMsgTime } from './support-msg-time.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"\""],[["\"כהן לוי\""],"\"\""],[["\"abc\""],"\"\""],[["\"a@b.com\""],"\"\""],[["\"2026-08-24\""],"\"12:00\""],[["\"2026-08-24T12:00:00\""],"\"12:00\""],[["\"0501234567\""],"\"\""],[["\"03-1234567\""],"\"\""],[["\"https://x.co\""],"\"\""],[["\"שלום עולם\""],"\"\""],[["\"12\""],"\"\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(supportMsgTime(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ support-msg-time: ' + CASES.length + ' הקלטות-Golden — ירוק');
