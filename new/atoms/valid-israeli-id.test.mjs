import { validIsraeliId as __pure_validIsraeliId } from './valid-israeli-id.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_valid_israeli_id_T = {
  k1: 10,
};
const validIsraeliId = (...a) => __pure_validIsraeliId(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_valid_israeli_id_T);
const CASES = [[["\"123456782\""],"true"],[["\"039217369\""],"true"],[["{\"amount\":100}"],"false"],[["{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],"false"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],"false"],[["[{\"amount\":100}]"],"false"],[["[\"2026-08-24\"]"],"false"],[["3.14"],"false"],[["1000"],"false"],[["2026"],"false"],[["\"\""],"false"],[["\"אבג\""],"false"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(validIsraeliId(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ valid-israeli-id: ' + CASES.length + ' הקלטות-Golden — ירוק');
