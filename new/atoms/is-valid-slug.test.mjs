import { isValidSlug } from './is-valid-slug.mjs';
const CASES = [[["\"\""],"false"],[["\"אבג\""],"false"],[["\"כהן לוי\""],"false"],[["\"abc\""],"true"],[["\"a@b.com\""],"false"],[["\"2026-08-24\""],"true"],[["\"2026-08-24T12:00:00\""],"false"],[["\"0501234567\""],"true"],[["\"03-1234567\""],"true"],[["\"https://x.co\""],"false"],[["\"שלום עולם\""],"false"],[["\"12\""],"true"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(isValidSlug(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ is-valid-slug: ' + CASES.length + ' הקלטות-Golden — ירוק');
