#!/usr/bin/env node
/** מחצב · search-record — רשומת-חיפוש (הדרך צעד 2 · הכרעה 23-ד "אין = לא-חיפשת" · שלב 9 · "שיפוט ⇒ ראיה").
 *  הכלי (לא הסוכן) שואל את האורקל-המאוחד — atom-index-full.json (תצוגה, 1402) + logic-census.json (לוגיקה) — ומייצר
 *  רשומה ב-machtzev/audit/search/: השאילתה · חתימת-האורקל · מועמדים+ציונים · הבחירה (`--choose <id>`) או "אין" (`--none "<למה>"`).
 *  השער search-proof דורש רשומה כזו לכל אטום חדש. הרשומה חתומה (sha256 של תוכנה) — עד לעקביות, לא חומה.
 *  שימוש: node machtzev/search-record.mjs "<מילות-חיפוש>" [--creates new/atoms/x.mjs] [--choose <id> | --none "<למה המועמדים לא מתאימים>"] [--top 15]
 *  כלל-מועמד-חזק: מועמד עם ציון ≥ 3 (התאמת-שם) חייב להופיע ב-`--none` בשמו (הסוכן חייב להתייחס אליו, לא להתעלם). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const query = argv.filter((a, i) => !a.startsWith('--') && (i === 0 || !argv[i - 1].startsWith('--'))).join(' ').trim();
if (!query) { console.error('usage: search-record "<מילות-חיפוש>" [--creates <path>] [--choose <id> | --none "<למה>"]'); process.exit(2); }
const IDX = R.MACH + 'generator/atom-index-full.json', LOG = R.MACH + 'generator/logic-census.json', OUT = R.MACH + 'audit/search/';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const display = JSON.parse(fs.readFileSync(IDX, 'utf8')), logic = JSON.parse(fs.readFileSync(LOG, 'utf8'));
const oracle = { atomIndexSha: sha(fs.readFileSync(IDX)), logicCensusSha: sha(fs.readFileSync(LOG)), display: display.length, logic: logic.length };
// ── טוקניזציה: עברית/לטינית, camelCase, מקפים; מסירים ו/ה/ל/ב/מ תחיליות עבריות בסיסיות ──
const tok = (s) => String(s || '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9א-ת]+/).filter((t) => t.length > 1).map((t) => t.replace(/^[והלבמכש](?=[א-ת]{3,})/, ''));
const q = [...new Set(tok(query))];
// התאמה: זהות, או קידומת של ≥4 תווים (age ⊄ image · pager) — לא substring חופשי
const near = (x, t) => x === t || (t.length >= 4 && x.startsWith(t)) || (x.length >= 4 && t.startsWith(x));
export function score(entry) {
  const idT = new Set(tok(entry.id || entry.name)), fileT = new Set(tok(path.basename(entry.file || ''))), purT = new Set(tok((entry.purpose || []).join(' ')));
  let s = 0; const hits = [];
  for (const t of q) {
    if ([...idT].some((x) => near(x, t))) { s += 3; hits.push(t); continue; }
    if ([...fileT].some((x) => near(x, t))) { s += 2; hits.push(t); continue; }
    if (purT.has(t)) { s += 1; hits.push(t); }
  }
  return { s, hits };
}
const seen = new Set();
const all = [...display.map((e) => ({ id: e.id, layer: e.layer || 'display', file: e.file, purpose: e.purpose })), ...logic.map((e) => ({ id: e.name, layer: 'logic', file: e.file, purpose: [e.ret, ...(e.params || [])] }))].filter((e) => { const k = e.id + '|' + e.file; if (seen.has(k)) return false; seen.add(k); return true; });
const TOP = Number(opt('--top') || 15);
const ranked = all.map((e) => ({ ...e, ...score(e) })).filter((e) => e.s > 0).sort((a, b) => b.s - a.s || a.id.localeCompare(b.id)).slice(0, TOP);
const candidates = ranked.map((e) => ({ id: e.id, layer: e.layer, file: e.file, score: e.s, hits: e.hits }));
const strong = candidates.filter((c) => c.score >= 3);   // התאמת-שם אחת לפחות = מועמד שחייבים להתייחס אליו
const choose = opt('--choose'), none = opt('--none');
const record = { v: 1, ts: new Date().toISOString(), query, tokens: q, oracle, candidates, strong: strong.map((c) => c.id), creates: opt('--creates') || null, chosen: null, why: null };
if (choose) { if (!candidates.some((c) => c.id === choose)) { console.error(`❌ --choose ${choose} אינו ברשימת-המועמדים — הבחירה חייבת לצאת מהחיפוש`); process.exit(1); } record.chosen = choose; }
else if (none !== null) {
  if ((none || '').replace(/\s+/g, '').length < 40) { console.error('❌ --none דורש הסבר ≥40 תווים: למה המועמדים לא משרתים את המטרה'); process.exit(1); }
  const ignored = strong.filter((c) => !none.includes(c.id));
  if (ignored.length) { console.error(`❌ מועמדים-חזקים (ציון ≥3) שלא נזכרו ב---none: ${ignored.map((c) => c.id).join(' · ')} — "אין" חייב להתייחס אליהם בשמם`); process.exit(1); }
  record.chosen = 'none'; record.why = none;
}
const body = JSON.stringify({ ...record, sig: undefined });
record.sig = sha('machtzev-search-v1\n' + body);
fs.mkdirSync(OUT, { recursive: true });
const slug = q.slice(0, 3).join('-').replace(/[^a-z0-9א-ת-]/g, '') || 'q';
const file = path.join(OUT, `${record.ts.slice(0, 10)}-${slug}-${record.sig.slice(0, 8)}.json`);
fs.writeFileSync(file, JSON.stringify(record, null, 1) + '\n');
console.log(`🔎 חיפוש "${query}" באורקל-המאוחד (${oracle.display} תצוגה + ${oracle.logic} לוגיקה) ⇒ ${candidates.length} מועמדים · ${strong.length} חזקים`);
candidates.slice(0, 10).forEach((c) => console.log(`  ${c.score >= 4 ? '★' : ' '} ${String(c.score).padStart(2)}  ${c.id}  (${c.layer} · ${c.file})`));
console.log(record.chosen === 'none' ? `  ⇒ אין: ${record.why.slice(0, 80)}…` : record.chosen ? `  ⇒ נבחר: ${record.chosen}` : '  ⇒ (ללא הכרעה — הוסף --choose <id> או --none "<למה>")');
console.log(`📄 ${path.relative(R.ROOT, file)}`);
