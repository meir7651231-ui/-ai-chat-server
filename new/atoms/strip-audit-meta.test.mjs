import { stripAuditMeta as __pure_stripAuditMeta } from './strip-audit-meta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_stripAuditMeta_STRIP_AUDIT_META_T = {
  k1: "audit",
};
const stripAuditMeta = (...a) => __pure_stripAuditMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripAuditMeta_STRIP_AUDIT_META_T);
const CASES = [[["{\"amount\":100}"],"{\"amount\":100}"],[["{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],"{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],"{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],[["[{\"amount\":100}]"],"[{\"amount\":100}]"],[["[\"2026-08-24\"]"],"[\"2026-08-24\"]"],[["[]"],"[]"],[["[\"א\",\"ב\"]"],"[\"א\",\"ב\"]"],[["{}"],"{}"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(stripAuditMeta(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ strip-audit-meta: ' + CASES.length + ' הקלטות-Golden — ירוק');
