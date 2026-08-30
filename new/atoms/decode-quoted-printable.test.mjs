import { decodeQuotedPrintable as __pure_decodeQuotedPrintable } from './decode-quoted-printable.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_decodeQuotedPrintable_DECODE_QUOTED_PRINTABLE_T = {
  k1: "QUOTED-PRINTABLE",
  k2: "נייד",
  k3: "בית",
  k4: "עבודה",
  k5: "פקס",
  k6: "ראשי",
  k7: "X-CUSTOM",
  k8: "utf-8",
};
const decodeQuotedPrintable = (...a) => __pure_decodeQuotedPrintable(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_decodeQuotedPrintable_DECODE_QUOTED_PRINTABLE_T);
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"???\""],[["\"כהן לוי\""],"\"??? ???\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"???? ????\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(decodeQuotedPrintable(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ decode-quoted-printable: ' + CASES.length + ' הקלטות-Golden — ירוק');
