import { metaPath } from './meta-path.mjs';
const CASES = [[["\"\"","\"\""],"\"orgs//meta/org\""],[["\"\"","\"אבג\""],"\"meta/org\""],[["\"\"","\"כהן לוי\""],"\"meta/org\""],[["\"\"","\"abc\""],"\"meta/org\""],[["\"\"","\"a@b.com\""],"\"meta/org\""],[["\"\"","\"2026-08-24\""],"\"meta/org\""],[["\"\"","\"2026-08-24T12:00:00\""],"\"meta/org\""],[["\"\"","\"0501234567\""],"\"meta/org\""],[["\"\"","\"03-1234567\""],"\"meta/org\""],[["\"\"","\"https://x.co\""],"\"meta/org\""],[["\"\"","\"שלום עולם\""],"\"meta/org\""],[["\"\"","\"12\""],"\"meta/org\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(metaPath(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ meta-path: ' + CASES.length + ' הקלטות-Golden — ירוק');
