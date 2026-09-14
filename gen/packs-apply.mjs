#!/usr/bin/env node
// gen/packs-apply.mjs — מצמיד חבילות-ידע (packs/*.json) לישויות ב-mosad.data.json לפי match, מוסיף רק מה שחסר, ורושם מוצא.
//   node gen/packs-apply.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'mosad.data.json'), 'utf8'));
const packs = fs.readdirSync(path.join(HERE, 'packs')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(HERE, 'packs', f), 'utf8')));
const log = [];
for (const P of packs) {
  for (const d of DATA.departments) for (const e of d.entities) {
    if (!P.match.entity.includes(e.name)) continue;
    const added = { fields: [], stages: 0, guards: 0, forbidden: 0, moment: false, screens: 0, automations: 0 };
    for (const f of P.fields || []) if (!e.fields.some((g) => g.name === f.name)) { e.fields.push({ required: false, ...f }); added.fields.push(f.name); }
    if (P.stages && P.stages.length > (e.stages || []).length) { added.stages = P.stages.length - (e.stages || []).length; e.stages = P.stages.slice(); }
    e.guards = e.guards || []; for (const g of P.guards || []) if (e.stages.includes(g.stage) && e.fields.some((f) => f.name === g.cond.split(/\s*[><=]/)[0].trim()) && !e.guards.some((x) => x.stage === g.stage)) { e.guards.push(g); added.guards++; }
    e.forbidden = e.forbidden || []; for (const x of P.forbidden || []) if (!e.forbidden.includes(x)) { e.forbidden.push(x); added.forbidden++; }
    if (P.moment && !e.moment) { e.moment = P.moment; added.moment = true; }
    e.screens = e.screens || []; for (const x of P.screens || []) if (!e.screens.includes(x)) { e.screens.push(x); added.screens++; }
    for (const a of P.automations || []) if (!DATA.automations.includes(a)) { DATA.automations.push(a); added.automations++; }
    e.packs = [...new Set([...(e.packs || []), P.id])];
    log.push({ pack: P.id, entity: e.name, dept: d.name, added, sources: P.sources });
  }
}
DATA.packsApplied = log;
if (!DRY) fs.writeFileSync(path.join(HERE, 'mosad.data.json'), JSON.stringify(DATA, null, 1));
for (const l of log) console.log(`${DRY ? '(dry) ' : ''}${l.pack} ⇒ ${l.entity} (${l.dept}): שדות +${l.added.fields.length} · שלבים +${l.added.stages} · מעברים +${l.added.guards} · אסור +${l.added.forbidden} · הרגע ${l.added.moment ? '✓' : '—'} · מסך +${l.added.screens} · אוטומציות +${l.added.automations}`);
console.log(`${log.length} הצמדות מ-${packs.length} חבילות`);
