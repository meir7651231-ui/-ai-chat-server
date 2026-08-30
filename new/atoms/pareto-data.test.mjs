// בדיקת-צילום · pareto-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/pareto-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"EMPTY\":{\"curve\":[{\"donorPct\":0,\"moneyPct\":0},{\"donorPct\":100,\"moneyPct\":100}],\"top20Share\":0,\"halfDonorPct\":0,\"eightyDonorPct\":0,\"gini\":0,\"donors\":0}}");
console.log('OK pareto-data');
