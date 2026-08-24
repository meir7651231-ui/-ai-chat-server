import { isValidPin } from './is-valid-pin.mjs';
const CASES = [[["\"123456782\""],"false"],[["\"039217369\""],"false"],[["{\"amount\":100}"],"false"],[["{\"payments\":[{\"amount\":100},{\"amount\":50}]}"],"false"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],"false"],[["[{\"amount\":100}]"],"false"],[["[\"2026-08-24\"]"],"false"],[["3.14"],"false"],[["1000"],"true"],[["2026"],"true"],[["\"\""],"false"],[["\"אבג\""],"false"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(isValidPin(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ is-valid-pin: ' + CASES.length + ' הקלטות-Golden — ירוק');
