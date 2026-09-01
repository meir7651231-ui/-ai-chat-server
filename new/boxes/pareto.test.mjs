import * as m from './pareto.mjs';
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
const FN = {"paretoReport":[[["[{\"id\":\"x\",\"name\":\"x\",\"phone\":\"\",\"email\":\"\",\"address\":\"\",\"idNum\":\"\",\"cat\":\"\",\"forWho\":\"\",\"notes\":\"\",\"count\":0,\"ils\":0,\"usd\":0,\"first\":\"\",\"last\":\"\",\"nextDate\":\"\",\"donations\":[]}]","\"2026-08-20\""],"{\"curve\":[{\"donorPct\":0,\"moneyPct\":0},{\"donorPct\":100,\"moneyPct\":100}],\"top20Share\":0,\"halfDonorPct\":0,\"eightyDonorPct\":0,\"gini\":0,\"donors\":0}"]]};
let f = 0;
for (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ pareto: ' + Object.values(FN).flat().length + ' golden — ירוק');
