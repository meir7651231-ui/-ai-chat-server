import { toTenantId as __pure_toTenantId } from './to-tenant-id.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_toTenantId_TO_TENANT_ID_T = {
  k1: "default",
  k2: "org",
};
const toTenantId = (...a) => __pure_toTenantId(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_toTenantId_TO_TENANT_ID_T);
const CASES = [[["\"\"","\"\""],"\"org\""],[["\"\"","\"אבג\""],"\"x--org\""],[["\"\"","\"כהן לוי\""],"\"x--org\""],[["\"\"","\"abc\""],"\"abc\""],[["\"\"","\"a@b.com\""],"\"a-b-com\""],[["\"\"","\"2026-08-24\""],"\"2026-08-24\""],[["\"\"","\"2026-08-24T12:00:00\""],"\"2026-08-24t12-00-00\""],[["\"\"","\"0501234567\""],"\"0501234567\""],[["\"\"","\"03-1234567\""],"\"03-1234567\""],[["\"\"","\"https://x.co\""],"\"https-x-co\""],[["\"\"","\"שלום עולם\""],"\"x--org\""],[["\"\"","\"12\""],"\"12-org\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(toTenantId(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ to-tenant-id: ' + CASES.length + ' הקלטות-Golden — ירוק');
