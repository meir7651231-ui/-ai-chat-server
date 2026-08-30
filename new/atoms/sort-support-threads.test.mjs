import { sortSupportThreads as __pure_sortSupportThreads } from './sort-support-threads.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_sortSupportThreads_SORT_SUPPORT_THREADS_T = {
  k1: "admin",
  k2: "number",
};
const sortSupportThreads = (...a) => __pure_sortSupportThreads(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_sortSupportThreads_SORT_SUPPORT_THREADS_T);
const CASES = [[["[{\"amount\":100}]"],"[{\"amount\":100}]"],[["[\"2026-08-24\"]"],"[\"2026-08-24\"]"],[["\"\""],"[]"],[["[]"],"[]"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(sortSupportThreads(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ sort-support-threads: ' + CASES.length + ' הקלטות-Golden — ירוק');
