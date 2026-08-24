import { hokMethodLabel } from './hok-method-label.mjs';
const CASES = [[["\"\""],"\"אחר\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"שלום עולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(hokMethodLabel(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ hok-method-label: ' + CASES.length + ' הקלטות-Golden — ירוק');
