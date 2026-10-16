// prior for the G1 pass: the learned G0 prior (fg/prior/upto5.json) unchanged, plus the zero-count cost of each G1 production
// (fitCosts on the same history with G1 in the grammar: an unused production costs what any unused production of its type costs).
import fs from 'fs';
import { P } from '../fg/grammar.mjs';
import { learnPrior } from '../fg/prior.mjs';
const [inF, outF, ...hist] = process.argv.slice(2);
const base = JSON.parse(fs.readFileSync(inF, 'utf8'));
const sols = hist.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map((x) => JSON.parse(x))).filter((r) => r.ok && r.ast);
const pr = learnPrior(sols, 16);
const g1 = P.filter((p) => p.tag === 'g1').map((p) => p.name);
let diff = 0; for (const [k, v] of Object.entries(base.costs)) if (pr.costs[k] !== undefined && pr.costs[k] !== v) diff++;
const out = JSON.parse(JSON.stringify(base));
for (const n of g1) out.costs[n] = pr.costs[n];
for (const c of Object.keys(out.byClass || {})) for (const n of g1) out.byClass[c][n] = pr.byClass[c][n];
out.g1 = { from: hist.map((f) => f.split('/').pop()), costs: Object.fromEntries(g1.map((n) => [n, pr.costs[n]])) };
fs.writeFileSync(outF, JSON.stringify(out));
console.log('solutions', sols.length, 'G0 costs that would shift if refit:', diff, '(kept as learned)'); console.log(JSON.stringify(out.g1.costs));
