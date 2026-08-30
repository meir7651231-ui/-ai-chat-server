import { excelSerialToIso as __pure_excelSerialToIso } from './excel-serial-to-iso.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_excel_serial_to_iso_T = {
  k1: 25569,
  k2: 86400000,
};
const excelSerialToIso = (...a) => __pure_excelSerialToIso(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_excel_serial_to_iso_T);
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"\""],[["\"כהן לוי\""],"\"\""],[["\"abc\""],"\"\""],[["\"a@b.com\""],"\"\""],[["\"2026-08-24\""],"\"\""],[["\"2026-08-24T12:00:00\""],"\"\""],[["\"0501234567\""],"\"\""],[["\"03-1234567\""],"\"\""],[["\"https://x.co\""],"\"\""],[["\"שלום עולם\""],"\"\""],[["\"12\""],"\"1900-01-11\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(excelSerialToIso(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ excel-serial-to-iso: ' + CASES.length + ' הקלטות-Golden — ירוק');
