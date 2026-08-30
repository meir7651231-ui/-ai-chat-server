import { hokMethodLabel as __pure_hokMethodLabel } from './hok-method-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_hokMethodLabel_HOK_METHOD_LABEL_T = {
  k1: "bank",
  k2: "הו\"ק בנקאית",
  k3: "card",
  k4: "אשראי בסליקה",
  k5: "cash",
  k6: "מזומן חודשי",
  k7: "אחר",
};
const hokMethodLabel = (...a) => __pure_hokMethodLabel(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hokMethodLabel_HOK_METHOD_LABEL_T);
const CASES = [[["\"\""],"\"אחר\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"שלום עולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(hokMethodLabel(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ hok-method-label: ' + CASES.length + ' הקלטות-Golden — ירוק');
