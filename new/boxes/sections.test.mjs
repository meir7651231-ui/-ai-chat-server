import * as m from './sections.mjs';
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
const FN = {"featureModuleKey":[[["\"123456782\""],"\"123456782\""],[["{\"amount\":100}"],"{\"amount\":100}"],[["{\"payments\":[{\"amount\":100}]}"],"{\"payments\":[{\"amount\":100}]}"],[["{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],"{\"name\":\"כהן\",\"phone\":\"0501234567\"}"],[["[\"2026-08-24\"]"],"[\"2026-08-24\"]"],[["3.14"],"3.14"],[["1000"],"1000"],[["2026"],"2026"],[["\"\""],"\"\""],[["\"אבג\""],"\"אבג\""]]};
let f = 0;
for (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ sections: ' + Object.values(FN).flat().length + ' golden — ירוק');
