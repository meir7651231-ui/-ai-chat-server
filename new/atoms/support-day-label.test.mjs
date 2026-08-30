import { supportDayLabel as __pure_supportDayLabel } from './support-day-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_supportDayLabel_SUPPORT_DAY_LABEL_T = {
  k1: "היום",
  k2: "אתמול",
};
const supportDayLabel = (...a) => __pure_supportDayLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_supportDayLabel_SUPPORT_DAY_LABEL_T);
const CASES = [[["\"\"","\"\""],"\"היום\""],[["\"\"","\"אבג\""],"\"\""],[["\"\"","\"כהן לוי\""],"\"\""],[["\"\"","\"abc\""],"\"\""],[["\"\"","\"a@b.com\""],"\"\""],[["\"\"","\"2026-08-24\""],"\"\""],[["\"\"","\"2026-08-24T12:00:00\""],"\"\""],[["\"\"","\"0501234567\""],"\"\""],[["\"\"","\"03-1234567\""],"\"\""],[["\"\"","\"https://x.co\""],"\"\""],[["\"\"","\"שלום עולם\""],"\"\""],[["\"\"","\"12\""],"\"\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(supportDayLabel(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ support-day-label: ' + CASES.length + ' הקלטות-Golden — ירוק');
