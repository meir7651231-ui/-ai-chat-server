import { wheelIndexUnderPointer as __pure_wheelIndexUnderPointer } from './wheel-index-under-pointer.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_wheel_index_under_pointer_T = {
  k1: 360,
};
const wheelIndexUnderPointer = (...a) => __pure_wheelIndexUnderPointer(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_wheel_index_under_pointer_T);
const CASES = [[["\"\"","\"\""],"0"],[["\"\"","\"אבג\""],"null"],[["\"\"","\"כהן לוי\""],"null"],[["\"\"","\"abc\""],"null"],[["\"\"","\"a@b.com\""],"null"],[["\"\"","\"2026-08-24\""],"null"],[["\"\"","\"2026-08-24T12:00:00\""],"null"],[["\"\"","\"0501234567\""],"0"],[["\"\"","\"03-1234567\""],"null"],[["\"\"","\"https://x.co\""],"null"],[["\"\"","\"שלום עולם\""],"null"],[["\"\"","\"12\""],"0"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(wheelIndexUnderPointer(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ wheel-index-under-pointer: ' + CASES.length + ' הקלטות-Golden — ירוק');
