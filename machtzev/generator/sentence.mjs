#!/usr/bin/env node
// 🗣️ sentence — משפט-בעברית ⇒ ישות ⇒ מודול-זהב ⇒ retarget ⇒ מסך (GENMAX · G5f · §22 צפון-המחולל · הכרעה-24): צינור-אחד, אפס-LLM, אפס-מילון-במנוע.
//   1. מילים-בעברית מהמשפט ⇒ התאמה לצורות-המונחים מ-`entity-terms.data.json` (אטום-דאטה חצוב מ-TERM_DEFS + נרדפות-ורטיקל):
//      מילה≡צורה · מילה בלי אות-שימוש אחת (ה/ו/ל/ב/מ/ש/כ)≡צורה · צורה(≥3) מוכלת במילה (רבים/נטייה) — ניקוד: 3/2/1.
//   2. הישות המנצחת (תיקו ⇒ סדר-המונחים) ⇒ `pickModule` (G5e) ⇒ `retarget` (G5c/d) ⇒ new/dart-gen-bs/gen_retarget_<e>_from_<tag>.dart.
//   3. אין מונח ⇒ **מקום-שמור**: מדווח "אין ישות בסכמה למשפט" — לא ממציא (§20-ג). (השלמה עתידית: התאמת-צורה של השדות שבמשפט מול פרופילי-הישויות.)
//   --gate: sentence-golden.json (משפטים ⇒ ישות צפויה, fixture) — הפותר מחזיר בדיוק אותן; דטרמיניזם.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { pickModule, retarget } from './retarget.mjs';

const ROOT = R.ROOT, GEN = path.join(ROOT, 'machtzev/generator'), DIR = path.join(ROOT, 'new/dart-gen-bs');
const TERMS = JSON.parse(fs.readFileSync(path.join(GEN, 'entity-terms.data.json'), 'utf8')).terms.filter((t) => t.entity);
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳\-\/]*/g)].map((m) => m[0]);
const PREFIX = /^[הולבמשכ]/;
// מורפולוגיה מינימלית (כלל-שפה, לא דומיין): ריבוי ־ים · ריבוי ־ה⇒־ות · ־ות — צורות-נגזרות מצורת-המונח (כמו match.stem)
const variants = (fw) => new Set([fw, fw + 'ים', fw.endsWith('ה') ? fw.slice(0, -1) + 'ות' : fw + 'ות']);
const strip = (w) => PREFIX.test(w) ? w.slice(1) : w;
export function resolve(text) {
  const words = heWords(text);
  const votes = new Map();
  // ניקוד פר-צורה: הטוב-ביותר לכל מילת-הצורה, משוקלל בשלמות-הצורה (צורה דו-מילתית 'בן/בת משפחה' שרק חציה תאם ≠ 'משפחה' שלמה); לישות — המקסימום על צורותיה
  for (const t of TERMS) for (const form of t.forms) {
    const fws = heWords(form); if (!fws.length) continue;
    let sum = 0, hit = 0;
    for (const fw of fws) {
      const vs = variants(fw); let best = 0;
      for (const w of words) { let s = 0; if (w === fw) s = 3; else if (vs.has(w) || vs.has(strip(w))) s = 2; else if (fw.length >= 3 && w.includes(fw)) s = 1; if (s > best) best = s; }
      if (best) { sum += best; hit++; }
    }
    if (hit) { const score = +(sum / fws.length).toFixed(2); if (score > (votes.get(t.entity) || 0)) votes.set(t.entity, score); }
  }
  const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1] || TERMS.findIndex((t) => t.entity === a[0]) - TERMS.findIndex((t) => t.entity === b[0]));
  return { text, words, entity: ranked.length ? ranked[0][0] : null, score: ranked.length ? ranked[0][1] : 0, ranked: ranked.slice(0, 4) };
}
export function fromSentence(text) {
  const r = resolve(text);
  if (!r.entity) return { ...r, module: null, out: null, reason: 'אין מונח-ישות במשפט — מקום-שמור (אין המצאה)' };
  const p = pickModule(r.entity);
  const g = retarget({ module: p.module, entity: r.entity });
  const out = path.join(DIR, `gen_retarget_${r.entity.toLowerCase()}_from_${{ 'schoolos.dart': 'inv', schoolos_students: 'stu', schoolos_attendance: 'att', schoolos_courses: 'crs', schoolos_teachers: 'tch', schoolos_rooms: 'rm', schoolos_fees: 'fee', schoolos_parents: 'par', schoolos_dashboard: 'dash' }[p.module.replace(/\.dart$/, '')] || 'x'}.dart`);
  return { ...r, pick: p, module: p.module, out, code: g.code, counts: g.counts };
}
// G8d · שדות-המשפט ⇒ פעולות-יסוד: "עם טלפון, אזור, תאריך הצטרפות" ⇒ interpret(text).schema (טיפוס מרמזי-השפה + rule מהמדף) ⇒ fieldOps (G2) ⇒ ops מבוקשים ⇒ זריעה ממוקדת (assembleByOps)
const T2 = { date: 'IsoDate', num: 'number', bool: 'boolean', text: 'string', multiline: 'string' };
export async function fieldOpsOfSentence(text) {
  const { interpret } = await import('./entity.mjs'); const { fieldOps } = await import('./shape-ops.mjs');
  const schema = interpret(text).schema || []; const ops = new Set(); const fields = [];
  for (const f of schema) { const n = /phone|tel|טלפון/i.test(f.rule || '') || /טלפון|נייד/.test(f.label) ? 'phone' : /mail|מייל|אימייל/i.test((f.rule || '') + f.label) ? 'email' : 'f'; const fo = fieldOps({ n, t: T2[f.type] || 'string', o: false }); fo.forEach((o) => ops.add(o)); fields.push({ label: f.label, type: f.type, ops: fo }); }
  return { fields, ops: [...ops] };
}
export async function subsetFromSentence(text) {
  const r = resolve(text); if (!r.entity) return { ...r, reason: 'אין מונח-ישות במשפט' };
  const p = pickModule(r.entity); const fo = await fieldOpsOfSentence(text);
  const { assembleByOps } = await import('./render-module.mjs');
  const minOverlap = Math.max(1, Math.min(3, fo.ops.length - 1));
  const res = await assembleByOps({ module: p.module, entity: r.entity, minOverlap, opsOverride: new Set(fo.ops) });
  return { ...r, pick: p, module: p.module, fields: fo.fields, ops: fo.ops, minOverlap, fragments: res.fragments, of: res.of, code: res.code, sites: Object.values(res.plans).reduce((a, x) => a + x.sites.length, 0) };
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const GOLDEN = path.join(GEN, 'sentence-golden.json');
if (isMain && process.argv.includes('--gate')) {
  const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
  const bad = gold.filter((g) => resolve(g.text).entity !== g.entity).map((g) => `"${g.text}" ⇒ ${resolve(g.text).entity} ≠ ${g.entity}`);
  if (bad.length) { console.log('🔴 sentence: ' + bad.join(' · ')); process.exit(1); }
  console.log(`✓ sentence: ${gold.length}/${gold.length} משפטי-זהב נפתרים לישות הצפויה (${TERMS.length} מונחי-ישות · אפס-LLM)`); process.exit(0);
}
if (isMain && arg('--text') && process.argv.includes('--subset')) {           // G8d: מודול-משנה סביב שדות-המשפט
  const r = await subsetFromSentence(arg('--text'));
  if (!r.entity) { console.log(`⚪ "${r.text}" ⇒ ${r.reason}`); process.exit(0); }
  const out = arg('--out') || path.join(DIR, `gen_opsseed_${r.entity.toLowerCase()}_from_${{ 'schoolos.dart': 'inv', schoolos_students: 'stu', schoolos_attendance: 'att', schoolos_courses: 'crs', schoolos_teachers: 'tch', schoolos_rooms: 'rm', schoolos_fees: 'fee', schoolos_parents: 'par', schoolos_dashboard: 'dash' }[r.module.replace(/\.dart$/, '')] || 'x'}_sub.dart`);
  if (!process.argv.includes('--dry')) fs.writeFileSync(out, r.code);
  console.log(`🗣️ "${r.text}" ⇒ ${r.entity} ⇒ ${r.module} · שדות-המשפט: ${r.fields.map((f) => `${f.label}(${f.type}:${f.ops.join('/')})`).join(' · ')} ⇒ ops ${r.ops.join(',')} · minOverlap ${r.minOverlap} ⇒ ${path.basename(out)} · שברים ${r.fragments}/${r.of} · בונים מחווטים ${r.sites}`);
} else if (isMain && arg('--text')) {
  const r = fromSentence(arg('--text'));
  if (!r.entity) { console.log(`⚪ "${r.text}" ⇒ ${r.reason}`); process.exit(0); }
  if (!process.argv.includes('--dry')) fs.writeFileSync(r.out, r.code);
  console.log(`🗣️ "${r.text}" ⇒ ${r.entity} (ניקוד ${r.score} · חלופות ${r.ranked.slice(1).map((x) => x[0] + ':' + x[1]).join(',') || '—'}) ⇒ ${r.module} (${r.pick.strength} · שמות ${r.pick.names}/${r.pick.fields}) ⇒ ${path.basename(r.out)} · שם ${r.counts.name} · ערוץ ${r.counts.chan} · טיפוס-יחיד ${r.counts.unique} · מקום-שמור ${r.counts.reserved}`);
}
