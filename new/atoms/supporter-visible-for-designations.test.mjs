import { supporterVisibleForDesignations } from './supporter-visible-for-designations.mjs';
const CASES = [[["\"\"","\"\""],"true"],[["\"\"","\"אבג\""],"false"],[["\"\"","\"כהן לוי\""],"false"],[["\"\"","\"abc\""],"false"],[["\"\"","\"a@b.com\""],"false"],[["\"\"","\"2026-08-24\""],"false"],[["\"\"","\"2026-08-24T12:00:00\""],"false"],[["\"\"","\"0501234567\""],"false"],[["\"\"","\"03-1234567\""],"false"],[["\"\"","\"https://x.co\""],"false"],[["\"\"","\"שלום עולם\""],"false"],[["\"\"","\"12\""],"false"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(supporterVisibleForDesignations(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ supporter-visible-for-designations: ' + CASES.length + ' הקלטות-Golden — ירוק');
