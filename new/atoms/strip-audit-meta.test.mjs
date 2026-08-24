import { stripAuditMeta } from './strip-audit-meta.mjs';
const CASES = [[["{\"amount\":100}"],"{\"amount\":100}"],[["{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],"{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],"{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],[["[{\"amount\":100}]"],"[{\"amount\":100}]"],[["[\"2026-08-24\"]"],"[\"2026-08-24\"]"],[["[]"],"[]"],[["[\"א\",\"ב\"]"],"[\"א\",\"ב\"]"],[["{}"],"{}"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(stripAuditMeta(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ strip-audit-meta: ' + CASES.length + ' הקלטות-Golden — ירוק');
