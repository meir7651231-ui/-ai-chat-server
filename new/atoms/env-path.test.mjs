import { envPath as __pure_envPath } from './env-path.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_envPath_ENV_PATH_T = {
  k1: "_enc/envelope",
  k2: "orgs/",
  k3: "/_enc/envelope",
};
const envPath = (...a) => __pure_envPath(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_envPath_ENV_PATH_T);
const CASES = [[["\"\"","\"\""],"\"orgs//_enc/envelope\""],[["\"\"","\"אבג\""],"\"_enc/envelope\""],[["\"\"","\"כהן לוי\""],"\"_enc/envelope\""],[["\"\"","\"abc\""],"\"_enc/envelope\""],[["\"\"","\"a@b.com\""],"\"_enc/envelope\""],[["\"\"","\"2026-08-24\""],"\"_enc/envelope\""],[["\"\"","\"2026-08-24T12:00:00\""],"\"_enc/envelope\""],[["\"\"","\"0501234567\""],"\"_enc/envelope\""],[["\"\"","\"03-1234567\""],"\"_enc/envelope\""],[["\"\"","\"https://x.co\""],"\"_enc/envelope\""],[["\"\"","\"שלום עולם\""],"\"_enc/envelope\""],[["\"\"","\"12\""],"\"_enc/envelope\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(envPath(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ env-path: ' + CASES.length + ' הקלטות-Golden — ירוק');
