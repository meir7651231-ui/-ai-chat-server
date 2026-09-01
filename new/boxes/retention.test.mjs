import * as m from './retention.mjs';
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
const FN = {"acquisitionCohorts":[[["[{\"id\":\"solhgn\",\"name\":\"תורם\",\"phone\":\"\",\"email\":\"\",\"address\":\"\",\"idNum\":\"\",\"cat\":\"\",\"forWho\":\"\",\"notes\":\"\",\"count\":0,\"ils\":0,\"usd\":0,\"first\":\"\",\"last\":\"\",\"nextDate\":\"\",\"donations\":[]}]","\"2026-08-20\""],"{\"cohorts\":[],\"overallRetention\":0}"]]};
let f = 0;
for (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ retention: ' + Object.values(FN).flat().length + ' golden — ירוק');
