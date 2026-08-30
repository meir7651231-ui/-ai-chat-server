import { taskIdentity as __pure_taskIdentity } from './task-identity.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_taskIdentity_TASK_IDENTITY_T = {
  k1: "מקומי",
};
const taskIdentity = (...a) => __pure_taskIdentity(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_taskIdentity_TASK_IDENTITY_T);
const CASES = [[["\"\""],"\"מקומי\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24t12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"שלום עולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(taskIdentity(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ task-identity: ' + CASES.length + ' הקלטות-Golden — ירוק');
