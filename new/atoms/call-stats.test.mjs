import { callStats as __pure_callStats } from './call-stats.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_callStats_CALL_STATS_T = {
  k1: "noanswer",
};
const callStats = (...a) => __pure_callStats(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_callStats_CALL_STATS_T);
const CASES = [[["\"\""],"{\"total\":0,\"last\":\"\",\"noanswer\":0}"],[["\"אבג\""],"{\"total\":3,\"noanswer\":0}"],[["\"כהן לוי\""],"{\"total\":7,\"noanswer\":0}"],[["\"abc\""],"{\"total\":3,\"noanswer\":0}"],[["\"a@b.com\""],"{\"total\":7,\"noanswer\":0}"],[["\"2026-08-24\""],"{\"total\":10,\"noanswer\":0}"],[["\"2026-08-24T12:00:00\""],"{\"total\":19,\"noanswer\":0}"],[["\"0501234567\""],"{\"total\":10,\"noanswer\":0}"],[["\"03-1234567\""],"{\"total\":10,\"noanswer\":0}"],[["\"https://x.co\""],"{\"total\":12,\"noanswer\":0}"],[["\"שלום עולם\""],"{\"total\":9,\"noanswer\":0}"],[["\"12\""],"{\"total\":2,\"noanswer\":0}"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(callStats(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ call-stats: ' + CASES.length + ' הקלטות-Golden — ירוק');
