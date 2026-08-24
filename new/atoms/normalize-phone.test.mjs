import { normalizePhone } from './normalize-phone.mjs';
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהןלוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@bcom\""],[["\"2026-08-24\""],"\"20260824\""],[["\"2026-08-24T12:00:00\""],"\"20260824T12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"031234567\""],[["\"https://x.co\""],"\"https://xco\""],[["\"שלום עולם\""],"\"שלוםעולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(normalizePhone(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ normalize-phone: ' + CASES.length + ' הקלטות-Golden — ירוק');
