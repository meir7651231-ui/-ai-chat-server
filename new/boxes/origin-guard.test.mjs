import * as m from './origin-guard.mjs';
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
const FN = {"foreignHost":[[["\"123456782\"","[\"2026-08-24\"]"],"true"],[["\"123456782\"","\"\""],"false"],[["{\"amount\":100}","\"\""],"false"],[["{\"payments\":[{\"amount\":100}]}","\"\""],"false"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}","\"\""],"false"],[["[\"2026-08-24\"]","\"\""],"false"],[["3.14","\"\""],"false"],[["1000","\"\""],"false"],[["2026","\"\""],"false"],[["\"\"","\"123456782\""],"false"]]};
let f = 0;
for (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ origin-guard: ' + Object.values(FN).flat().length + ' golden — ירוק');
