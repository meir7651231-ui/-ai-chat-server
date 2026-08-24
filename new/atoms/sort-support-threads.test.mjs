import { sortSupportThreads } from './sort-support-threads.mjs';
const CASES = [[["[{\"amount\":100}]"],"[{\"amount\":100}]"],[["[\"2026-08-24\"]"],"[\"2026-08-24\"]"],[["\"\""],"[]"],[["[]"],"[]"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(sortSupportThreads(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ sort-support-threads: ' + CASES.length + ' הקלטות-Golden — ירוק');
