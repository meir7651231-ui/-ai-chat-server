#!/usr/bin/env node
// aggregate.mjs — scoreboard from bench/results/<arm>/<id>/final.json
import fs from 'node:fs'; import path from 'node:path';
const B = path.dirname(new URL(import.meta.url).pathname); const tasks = JSON.parse(fs.readFileSync(path.join(B, 'tasks.json'), 'utf8'));
const arms = ['h0', 'hf', 'f0']; const rows = [];
for (const t of tasks) { const r = { id: t.id, tier: t.tier, ns: t.ns }; for (const a of arms) { const f = path.join(B, 'results', a, t.id, 'final.json'); if (fs.existsSync(f)) { const d = JSON.parse(fs.readFileSync(f, 'utf8')); r[a] = { done: d.verdict === 'DONE', missing: d.missing, false_claims: d.false_claims, cost: d.cost_usd || 0, wall: d.wall_s || 0, tokens: d.tokens || 0, generic_fail: d.missing.filter((m) => ['regen_ok','no_hand_edit','byte_identical_others','gates_pass','no_hebrew_in_engine','dart_math_sane'].includes(m)) }; } } rows.push(r); }
const sum = {}; for (const a of arms) { const rs = rows.filter((r) => r[a]); sum[a] = { n: rs.length, done: rs.filter((r) => r[a].done).length, byTier: {}, false_claims: rs.reduce((s, r) => s + r[a].false_claims, 0), broke_others: rs.filter((r) => r[a].generic_fail.length).length, cost: rs.reduce((s, r) => s + r[a].cost, 0), wall_min: rs.reduce((s, r) => s + r[a].wall, 0) / 60, tokens: rs.reduce((s, r) => s + r[a].tokens, 0) }; for (const tier of ['E', 'M', 'H']) { const tr = rs.filter((r) => r.tier === tier); sum[a].byTier[tier] = `${tr.filter((r) => r[a].done).length}/${tr.length}`; } }
let md = `# scoreboard · ${new Date().toISOString().slice(0, 16)}\n\n| arm | n | DONE | E | M | H | false claims | broke others | cost $ | wall min | tokens |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
const label = { h0: 'Haiku bare', hf: 'Haiku + full stack', f0: 'Fable bare' };
for (const a of arms) { const s = sum[a]; if (!s.n) continue; md += `| ${label[a]} | ${s.n} | ${s.done} | ${s.byTier.E} | ${s.byTier.M} | ${s.byTier.H} | ${s.false_claims} | ${s.broke_others} | ${s.cost.toFixed(2)} | ${s.wall_min.toFixed(0)} | ${(s.tokens / 1e6).toFixed(2)}M |\n`; }
md += `\n| task | tier | ${arms.map((a) => label[a]).join(' | ')} |\n|---|---|${arms.map(() => '---').join('|')}|\n`;
for (const r of rows) { if (!arms.some((a) => r[a])) continue; md += `| ${r.id} | ${r.tier} | ${arms.map((a) => r[a] ? `${r[a].done ? '✅' : '❌ ' + r[a].missing.join(',')}${r[a].false_claims ? ' 🤥' + r[a].false_claims : ''} $${r[a].cost.toFixed(2)} ${Math.round(r[a].wall / 60)}m` : '·').join(' | ')} |\n`; }
fs.writeFileSync(path.join(B, 'scoreboard.md'), md); console.log(md);
