#!/usr/bin/env node
// gen/mosad-build.mjs — בונה את mosad.data.json מחדש, תמיד מאותם שלושה מקורות, בסדר קבוע:
//   1. mosad.sentences.txt  — המשפטים (מילות הבעלים)  ⇒ שכבת-המשפט
//   2. mosad.enrich.json    — העשרות-יד כדאטה (מזהים · מעברים · נוסחאות · תפקידים · הקשר · פנים · חיבורים)
//   3. packs/*.json         — חבילות-ידע חצובות ממקורות, עם מוצא
// הפיכות: מחיקת חבילה / העשרה ⇒ הרצה ⇒ הדאטה חוזר בדיוק למה שנשאר. mosad.data.json לעולם לא נערך ביד.
//   node gen/mosad-build.mjs [--no-packs] [--no-enrich]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLang } from './lang.mjs';
import { sentenceToSpec } from './sentence.mjs';
import { parseSpec } from './spec.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LANG = loadLang();
const args = process.argv.slice(2);
const sentences = fs.readFileSync(path.join(HERE, 'mosad.sentences.txt'), 'utf8').split('\n\n').map((b) => b.trim()).filter(Boolean);
const E = !args.includes('--no-enrich') && fs.existsSync(path.join(HERE, 'mosad.enrich.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'mosad.enrich.json'), 'utf8')) : null;
const packs = args.includes('--no-packs') ? [] : fs.readdirSync(path.join(HERE, 'packs')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(HERE, 'packs', f), 'utf8')));

// 1 · משפטים ⇒ אגפים
const departments = sentences.map((text) => {
  const r = sentenceToSpec(text, LANG); const spec = parseSpec(r.specText);
  return { name: r.app, app: spec.app, entities: spec.entities.map((e) => ({ name: e.name, stages: e.stages || [], guards: e.guards || [], forbidden: e.forbidden || [], moment: e.moment || '', screens: e.screens || [], fix: e.fix || null, fields: e.fields.map((f) => ({ name: f.name, shape: f.shape, required: !!f.required, values: f.values || null, min: f.min, max: f.max, ref: f.ref || null, formula: f.formula || null })) })) };
});
const byName = {}; for (const d of departments) for (const e of d.entities) byName[e.name] = e;
const stat = { ids: 0, guards: 0, formulas: 0, packEnts: 0 };
// 2 · העשרות
let automations = [], faces = [], integrations = [], context = [], roles = [];
if (E) {
  for (const key of E.ids || []) { const [en, fn] = key.split('.'); const f = byName[en]?.fields.find((x) => x.name === fn); if (f) { f.shape = 'id'; delete f.min; delete f.max; stat.ids++; } }
  for (const [en, gs] of Object.entries(E.guards || {})) { const e = byName[en]; if (!e) continue; for (const g of gs) if (e.stages.includes(g.stage) && !e.guards.some((x) => x.stage === g.stage)) { e.guards.push(g); stat.guards++; } }
  for (const [en, fs_] of Object.entries(E.formulas || {})) { const e = byName[en]; if (!e) continue; for (const f of fs_) if (!e.fields.some((x) => x.name === f.name)) { e.fields.push({ name: f.name, shape: 'formula', required: false, formula: f.formula }); stat.formulas++; } }
  roles = (E.roles || []).map((r) => ({ ...r, ents: (r.ents || []).filter((n) => byName[n]) })); faces = E.faces || []; integrations = E.integrations || []; context = E.context || []; automations = [...(E.automationsExtra || [])];
}
// 3 · חבילות
const packsApplied = [];
for (const P of packs) for (const d of departments) for (const e of d.entities) {
  if (!P.match.entity.includes(e.name)) continue;
  const added = { fields: [], stages: 0, guards: 0, forbidden: 0, moment: false, screens: 0, automations: 0 };
  for (const f of P.fields || []) if (!e.fields.some((g) => g.name === f.name)) { e.fields.push({ required: false, ...f }); added.fields.push(f.name); }
  if (P.stages && P.stages.length > e.stages.length) {
    // איחוד, לא דריסה: שלבי-החבילה בסדרם + שלבי-הישות שלא בחבילה (נשמרים בסוף, כדי שמעברים קיימים לא יצביעו לריק)
    const merged = [...P.stages, ...e.stages.filter((s) => !P.stages.includes(s))];
    added.stages = merged.length - e.stages.length; e.stages = merged;
  }
  for (const g of P.guards || []) if (e.stages.includes(g.stage) && e.fields.some((f) => f.name === g.cond.split(/\s*[><=]/)[0].trim()) && !e.guards.some((x) => x.stage === g.stage)) { e.guards.push(g); added.guards++; }
  for (const x of P.forbidden || []) if (!e.forbidden.includes(x)) { e.forbidden.push(x); added.forbidden++; }
  if (P.moment && !e.moment) { e.moment = P.moment; added.moment = true; }
  if (P.fix && !e.fix) { e.fix = P.fix; added.fix = true; }
  for (const x of P.screens || []) if (!e.screens.includes(x)) { e.screens.push(x); added.screens++; }
  for (const a of P.automations || []) if (!automations.includes(a)) { automations.push(a); added.automations++; }
  const badG = e.guards.filter((g) => !e.stages.includes(g.stage)); if (badG.length) { e.guards = e.guards.filter((g) => e.stages.includes(g.stage)); added.droppedGuards = badG.map((g) => g.stage); }
  e.packs = [...new Set([...(e.packs || []), P.id])]; stat.packEnts++;
  packsApplied.push({ pack: P.id, entity: e.name, dept: d.name, added, sources: P.sources });
}
const D = { _: 'נגזר על ידי mosad-build.mjs מ-mosad.sentences.txt + mosad.enrich.json + packs/*.json — לא לערוך ביד. מחיקת מקור + הרצה = חזרה לקדמות.', built: new Date().toISOString(), context, departments, automations, faces, integrations, roles, packsApplied };
fs.writeFileSync(path.join(HERE, 'mosad.data.json'), JSON.stringify(D, null, 1));
const ents = departments.reduce((a, d) => a + d.entities.length, 0), fields = departments.reduce((a, d) => a + d.entities.reduce((b, e) => b + e.fields.length, 0), 0);
console.log(`✓ mosad.data.json: ${departments.length} אגפים · ${ents} ישויות · ${fields} שדות · העשרות: ${stat.ids} מזהים, ${stat.guards} מעברים, ${stat.formulas} נוסחאות, ${roles.length} תפקידים · חבילות: ${packs.length} על ${stat.packEnts} ישויות · אוטומציות ${automations.length}`);
