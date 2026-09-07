#!/usr/bin/env node
// 🧩 particles — מפרק-החלקיקים הפתוח (GENMAX·G23 · הכרעה-27: "אין רשימה סגורה — כל חלקיק, בכל ריצה, נמצא ומורכב מחדש מכל הקטלוג").
//   קלט (צעדים 1–2, אדם): שורות `חלקיק <ישות>: <שם> = <צורה>` בספק של app-ds. הצורה = ביטוי מבני על שדות-הישות (אפס-מילון):
//     A / B (יחס) · A - B (הפרש) · A * B (מכפלה) · A מול B (השוואה) · מונה(שדה=ערך) · מונה() · סכום(שדה) · ממוצע(שדה) ·
//     שדה-enum (חלוקה-למצבים) · שדה-טקסט/תאריך (עובדה) · [טבלה] · [איתור] · [חריגה] · [ייצוא] · [פעולה] טקסט · [ריק] טקסט
//   המנוע: צורה ⇒ פעולות-הצגה (אלגברת compose-engine, אותו מקור-אמת של הזהב) ⇒ לכל פעולה חיפוש בכל ops-map (cover: פעולה+שקעים+ייעוד) ⇒
//   חיווט-שקעים מהדאטה האמיתית (רשומות appStore; שקע שאין לו דאטה ⇒ האטום נפסל, הבא בתור — §20-ג) ⇒ מסך-חלקיקים לישות.
//   פלט: plan (json/md, דטרמיניסטי) + קוד-Dart (renderParticles). שער `particles`: plan ≡ טרי · אפס חלקיק-לא-פתור בספקי specs-ds.
import fs from 'node:fs';
import path from 'node:path';
import { cover, coverLogic, OPFAM } from './cover.mjs';
import { ops as opsOfKind } from '../compose-engine.mjs';
import { buildAtlas } from './atlas.mjs';
import * as R from '../root.mjs';
import { L, T } from './chrome.mjs';

const GEN = R.GEN_DIR;
const G = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8'));   // §19-ד: דקדוק-החלקיקים מהדאטה
const alt = (a) => '(' + a.join('|') + ')';
export const PARTICLE_RE = new RegExp('^\\s*' + G.particleWord + '\\s+');
const heW = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const clean = (s) => heW(s).join(' ').trim();
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

// ── 1 · פירוק שורות-חלקיק ──
export function parseParticleLines(lines) {
  const out = [];
  for (const line of lines) {
    if (!PARTICLE_RE.test(line)) continue;
    const body = line.replace(PARTICLE_RE, '');
    const ci = body.indexOf(':'); if (ci < 0) continue;
    const entity = clean(body.slice(0, ci));
    let rest = body.slice(ci + 1).trim();
    let name = rest, expr = rest;
    const eq = rest.indexOf(' = ');
    if (eq > 0 && !/^\s*\[/.test(rest)) { name = rest.slice(0, eq).trim(); expr = rest.slice(eq + 3).trim(); }
    out.push({ entity, name: clean(name) || name, expr, line });
  }
  return out;
}

// ── 2 · צורה מבנית (אפס-מילון: אופרטורים, סוגריים, סוג-השדה מהסכמה) ──
export function shapeOf(expr, schema) {
  const F = (label) => schema.find((s) => s.label === clean(label)) || null;
  const e = expr.trim();
  let m;
  if ((m = e.match(new RegExp('^\\[' + alt(G.pTable) + '\\]')))) return { kind: 'table' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pSearch) + '\\]')))) return { kind: 'search' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pFilter) + '\\]')))) return { kind: 'filter' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pExport) + '\\]')))) return { kind: 'export' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pEmpty) + '\\]\\s*(.*)$')))) return { kind: 'empty', text: m[2] };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pAct) + '\\]\\s*(.*)$')))) return { kind: 'act', label: clean(m[2]) };
  if ((m = e.match(new RegExp('^' + alt(G.pCount) + '\\s*\\(\\s*([^)=]*?)\\s*(?:=\\s*([^)]+))?\\)$')))) return { kind: 'count', field: clean(m[2]) || null, value: m[3] ? clean(m[3]) : null };
  if ((m = e.match(new RegExp('^' + alt(G.pSum) + '\\s*\\(\\s*([^)]+)\\)$')))) return { kind: 'sum', field: clean(m[2]), f: F(m[2]) };
  if ((m = e.match(new RegExp('^' + alt(G.pAvg) + '\\s*\\(\\s*([^)]+)\\)$')))) return { kind: 'avg', field: clean(m[2]), f: F(m[2]) };
  if ((m = e.match(/^(.+?)\s*\/\s*(.+)$/))) return { kind: '/', a: clean(m[1]), b: clean(m[2]) };
  if ((m = e.match(/^(.+?)\s*[−-]\s*(.+)$/)) && F(m[1]) && F(m[2])) return { kind: '−', a: clean(m[1]), b: clean(m[2]) };
  if ((m = e.match(/^(.+?)\s*[×*]\s*(.+)$/))) return { kind: '×', a: clean(m[1]), b: clean(m[2]) };
  if ((m = e.match(new RegExp('^(.+?)\\s+' + alt(G.pVs) + '\\s+(.+)$')))) return { kind: 'vs', a: clean(m[1]), b: clean(m[3]) };
  const f = F(e);
  if (f && f.enumVals && f.enumVals.length) return { kind: 'partition', field: f.label, bands: f.enumVals };
  if (f && f.formula) return { kind: 'raw', field: f.label, computed: true };
  if (f && f.type === 'date') return { kind: 'raw', field: f.label, date: true };
  if (f && f.type === 'num') return { kind: 'raw', field: f.label, num: true };
  if (f) return { kind: 'raw', field: f.label };
  return { kind: null, why: 'לא צורה מוכרת ולא שדה בסכמה' };
}

// ── 3 · צורה ⇒ פעולות-הצגה (אלגברת הזהב) ⇒ לכל פעולה חיפוש בכל הקטלוג ──
// שקעים-נדרשים לפי פעולה — צורת-השקע (שמות-שקעים מבניים, לא מילת-דומיין)
const NEED = {
  magnitude: ['value', 'label'], headline: ['value', 'label'], hero: ['value', 'label'], diff: ['value', 'label'],
  ratio: ['value', 'fraction', 'label'], compare: ['labels', 'values'], fact: ['label'], group: ['title'], identity: ['title', 'subtitle'],
  action: ['label', 'onTap'], primary: ['label', 'onTap'], table: ['labels', 'rows'], empty: ['message'], search: ['value', 'onChanged'],
  filter: ['selected', 'onTap'], alert: ['message'], timeline: ['title', 'time'], panel: ['child'], trend: ['value', 'delta'], bars: ['labels', 'values'],
  ring: ['value'], gauge: ['value'], field: ['onChanged'], enumfield: ['onChanged'], board: ['stages', 'records'], switch: ['items', 'selected', 'onSelect'],
  expand: ['title', 'body'], avatar: ['initials', 'title'],
};
const LOGIC = new Set(['match', 'predicate', 'serialize', 'role', 'grant', 'expiry', 'capital', 'queue', 'progress', 'sheet', 'makeup', 'balance', 'paidstatus', 'hok', 'clash', 'slots', 'block', 'holiday', 'weekly', 'sessions', 'enrol', 'wait', 'byteacher', 'whoami', 'cert', 'contact', 'recipients', 'template', 'parse', 'trendengine']);
export function opsOf(shape) {
  const f = { kind: shape.kind, headline: shape.headline };
  try { return opsOfKind(f).map((o) => o.op); } catch { return null; }
}
export function searchOp(op, goal) {
  const fam = OPFAM[op] || op;
  if (LOGIC.has(op)) { const c = coverLogic({ op: fam, need: [], goal }); return { op, fam, logic: true, atoms: c.atoms || [], alts: c.alts || [] }; }
  const c = cover({ op: fam, need: NEED[op] || [], goal });
  return { op, fam, logic: false, atoms: c.atoms || [], alts: c.alts || [], missing: c.missing || [] };
}

// ── 4 · חיווט: שקעי-האטום ⇐ דאטה אמיתית. אין דאטה לשקע-חובה ⇒ null (האטום נפסל) ──
let ATLAS = null; const atlas = () => (ATLAS ||= buildAtlas());
const widgetOf = (cls) => atlas().widgets.find((w) => w.cls === cls) || null;
const SOCK = {
  value: /^(value|val|amount|total|count|num)$/, label: /^(label|title|caption|name|text)$/, sub: /^(sub|subtitle|desc|body|note)$/,
  glyph: /^(glyph|emoji|icon)$/, fraction: /^(fraction|pct|percent|progress)$/, tap: /^(onTap|onPressed)$/, tone: /^(tone|severity|level)$/,
  labels: /^(labels|cols|columns|headers)$/, rows: /^(rows|data)$/, message: /^(message)$/,
};
// ctx: { label, value:{expr,type}, sub, fraction:{expr}, labels:[expr], rows:expr, glyph, nav:expr, message }
export function wireAtom(cls, ctx) {
  const w = widgetOf(cls); if (!w) return null;
  const args = [];
  for (const [name, t0] of w.types) {
    const t = t0.replace(/\?$/, ''); const req = w.required.has(name) || w.positional.includes(name);
    let e = null;
    if (SOCK.value.test(name) && ctx.value) e = t === 'String' ? ctx.value.str : /^(double|num|int)$/.test(t) ? (t === 'int' ? `(${ctx.value.num}).round()` : ctx.value.num) : null;
    else if (SOCK.label.test(name) && ctx.label && t === 'String') e = ctx.label;
    else if (SOCK.sub.test(name) && t === 'String') e = ctx.sub || null;
    else if (SOCK.glyph.test(name) && t === 'String') e = ctx.glyph || null;
    else if (SOCK.fraction.test(name) && ctx.fraction) e = t === 'int' ? `(${ctx.fraction} * 100).round()` : ctx.fraction;
    else if (SOCK.tap.test(name) && /VoidCallback|void Function\(\)/.test(t)) e = ctx.nav || null;
    else if (SOCK.labels.test(name) && /^List<String>/.test(t) && ctx.labels) e = `[${ctx.labels.join(', ')}]`;
    else if (SOCK.rows.test(name) && /^List<List<String>>/.test(t) && ctx.rows) e = ctx.rows;
    else if (SOCK.message.test(name) && t === 'String') e = ctx.message || ctx.label || null;
    else if (SOCK.tone.test(name) && t === 'int') e = ctx.tone != null ? String(ctx.tone) : null;
    if (e == null) { if (req) return null; continue; }   // שקע-חובה בלי דאטה ⇒ האטום נפסל (§20-ג: אין ערך-מומצא)
    args.push(w.positional.includes(name) ? e : `${name}: ${e}`);
  }
  return { cls, file: w.file, call: `${cls}(${args.join(', ')})` };
}

// ── 5 · תכנון: לכל חלקיק — צורה ⇒ פעולות ⇒ אטומים (חיפוש) ⇒ חיווט; מועמד שלא מתחווט ⇒ הבא (alts) ──
export function planParticles({ particles, entities }) {
  const plan = [];
  for (const p of particles) {
    const ent = entities.find((e) => e.name === p.entity);
    if (!ent) { plan.push({ ...p, ok: false, why: `אין ישות "${p.entity}" בספק` }); continue; }
    const shape = shapeOf(p.expr, ent.schema);
    if (!shape.kind) { plan.push({ ...p, ok: false, why: shape.why }); continue; }
    const ops = opsOf(shape);
    if (!ops) { plan.push({ ...p, ok: false, shape, why: `אין אלגברת-הרכבה לצורה ${shape.kind}` }); continue; }
    const goal = `${p.name} ${p.expr} ${ent.name}`;
    const picks = ops.map((op) => searchOp(op, goal));
    plan.push({ ...p, ok: picks.every((k) => k.atoms.length || k.logic), shape, ops, picks, entSlug: ent.slug, entNames: entities.map((e) => e.name) });
  }
  return plan;
}

// ── 6 · פליטה: מסך-חלקיקים לישות (AnimatedBuilder על appStore; אגרגטים למעלה, פר-רשומה בשורות) ──
export function renderParticles({ slug, entity, plan, k }) {
  const recs = `appStore.records('${entity.slug}')`;
  const numOf = (lbl) => `(num.tryParse(r[${k(lbl)}] ?? '') ?? 0)`;
  const strOf = (lbl) => `(r[${k(lbl)}] ?? '')`;
  const imports = new Set(); const widgets = []; const notes = [];
  const wired = (cls, ctx) => { const w = wireAtom(cls, ctx); if (w) imports.add(`import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`); return w; };
  const firstWired = (pick, ctx) => { for (const cand of [...pick.atoms, ...pick.alts]) { const w = wired(cand.split('@')[0], ctx); if (w) return { ...w, cand }; } return null; };
  for (const p of plan) {
    if (!p.ok) { notes.push(`⚪ ${p.name}: ${p.why}`); continue; }
    const s = p.shape; const lbl = k(p.name);
    const agg = /^(count|sum|avg)$/.test(s.kind);
    const kd = p.ops.map((op, i) => [op, p.picks[i]]);
    if (agg) {
      const expr = s.kind === 'count' ? (s.field ? `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(s.value || '')}).length.toDouble()` : `appStore.count('${entity.slug}').toDouble()`)
        : s.kind === 'sum' ? `appStore.sum('${entity.slug}', ${k(s.field)})` : `appStore.avg('${entity.slug}', ${k(s.field)})`;
      const ctx = { label: lbl, value: { str: `${expr}.toStringAsFixed(${s.kind === 'avg' ? 1 : 0})`, num: expr }, glyph: k('🧩'), sub: k(p.expr) };
      const w = firstWired(kd[0][1], ctx);
      if (!w) { notes.push(`⚪ ${p.name}: אף אטום מ-${kd[0][1].atoms.concat(kd[0][1].alts).join('/')} לא מתחווט לשקעי ${kd[0][0]}`); continue; }
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => ${w.call})`); p.wired = [w.cand]; continue;
    }
    // פר-רשומה
    let rowOf = null; let rowSrc = recs;
    if (s.kind === '/' || s.kind === '−' || s.kind === '×' || s.kind === 'vs') {
      const a = numOf(s.a), b = numOf(s.b);
      const val = s.kind === '/' ? `(${b} == 0 ? 0.0 : ${a} / ${b})` : s.kind === '−' ? `(${a} - ${b})` : s.kind === '×' ? `(${a} * ${b})` : `(${a} - ${b})`;
      const ctx = { label: lbl, value: { str: `${val}.toStringAsFixed(s.kind === '/' ? 2 : 0)`.replace("s.kind === '/' ? 2 : 0", s.kind === '/' ? '2' : '0'), num: val }, fraction: s.kind === '/' ? `${val}.clamp(0.0, 1.0).toDouble()` : null, sub: k(p.expr), glyph: k('🧩') };
      const w = firstWired(kd[0][1], ctx); if (!w) { notes.push(`⚪ ${p.name}: אין אטום מתחווט ל-${kd[0][0]}`); continue; }
      rowOf = w; p.wired = [w.cand];
    } else if (s.kind === 'partition') {   // חלוקה-למצבים: קבוצה פר-ערך-enum (כותרת = ערך · מונה) — אטום-group מחווט-מחדש פר-קבוצה דרך שקע-הכותרת (לא regex על הקריאה — אטומים פוזיציונליים נפלו)
      const probe = firstWired(kd[0][1], { label: k(p.name), value: { str: "''", num: '0' }, sub: k(p.expr), glyph: k('🧩'), tone: 0 });
      if (!probe) { notes.push(`⚪ ${p.name}: אין אטום-קבוצה מתחווט ל-${kd[0][0]}`); continue; }
      // השדה-המתאר של הרשומה בקבוצה: שדה-טקסט חופשי (לא נוסחה/enum/מקונן/מספר/תאריך/מצביע-לישות) — הראשון בסכמה; נפילה לשדה-הראשון.
      const textish = entity.schema.filter((f) => !f.formula && !(f.enumVals && f.enumVals.length) && !(f.members && f.members.length) && !/^(num|date|bool)$/.test(f.type || '') && !(p.entNames || []).includes(f.label));
      const desc = textish.slice().sort((a, b) => (b.type === 'multiline') - (a.type === 'multiline') || b.label.split(/\s+/).length - a.label.split(/\s+/).length)[0] || entity.schema[0];   // מתאר = רב-שורתי > תווית-רב-מילים ("מה כתוב") > ראשון; מיון יציב
      const groups = s.bands.map((band) => {
        const inBand = `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(band)}).toList()`;
        const g = firstWired(kd[0][1], { label: `${k(band)} + ' · ' + ${inBand}.length.toString()`, value: { str: `${inBand}.length.toString()`, num: `${inBand}.length.toDouble()` }, sub: k(p.expr), glyph: k('🧩'), tone: 0 }) || probe;
        return `${g.call}, ...[for (final r in ${inBand}) Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Text(${strOf(desc.label)}))]`;
      });
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${groups.join(', ')}]))`); p.wired = [probe.cand]; continue;
    } else if (s.kind === 'raw') {
      const ctx = { label: strOf(s.field), value: { str: strOf(s.field), num: numOf(s.field) }, sub: lbl, glyph: k('🧩'), tone: 0, message: strOf(s.field) };
      const w = firstWired(kd[0][1], ctx); if (!w) { notes.push(`⚪ ${p.name}: אין אטום מתחווט ל-${kd[0][0]}`); continue; }
      rowOf = w; p.wired = [w.cand]; rowSrc = `${recs}.where((r) => (r[${k(s.field)}] ?? '').toString().trim().isNotEmpty)`;   // ערך-ריק ⇒ אין שבב-ריק (§20-ג)
    } else if (s.kind === 'act') {
      const nav = `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${entity.cls}()))`;
      const w = firstWired(kd[0][1], { label: k(s.label || p.name), nav, glyph: k('🧩') }); if (!w) { notes.push(`⚪ ${p.name}: אין אטום-פעולה מתחווט`); continue; }
      widgets.push(w.call); p.wired = [w.cand]; imports.add(`import 'gen_${entity.slug}.dart';`); continue;
    } else if (s.kind === 'table') {
      const labels = entity.schema.map((f) => k(f.label));
      const rows = `[for (final r in ${recs}) [${entity.schema.map((f) => strOf(f.label)).join(', ')}]]`;
      const w = firstWired(kd[0][1], { labels, rows, label: lbl }); if (!w) { notes.push(`⚪ ${p.name}: אין אטום-טבלה מתחווט`); continue; }
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => ${w.call})`); p.wired = [w.cand]; continue;
    } else if (s.kind === 'empty') {
      const w = firstWired(kd[0][1], { message: k(s.text || p.name), label: lbl, glyph: k('🧩') }); if (!w) { notes.push(`⚪ ${p.name}: אין אטום-ריק מתחווט`); continue; }
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => ${recs}.isEmpty ? ${w.call} : const SizedBox.shrink())`); p.wired = [w.cand]; continue;
    } else { notes.push(`⚪ ${p.name}: צורה ${s.kind} — פליטה טרם נבנתה (חיפוש בוצע: ${kd.map(([o, pk]) => o + '⇒' + (pk.atoms[0] || '—')).join(' · ')})`); continue; }
    widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in ${rowSrc}) Padding(padding: const EdgeInsets.only(bottom: 8), child: ${rowOf.call})]))`);
  }
  const cls = 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
  const code = `// 🧩 חולל ע"י מפרק-החלקיקים הפתוח (particles · הכרעה-27): כל חלקיק נמצא בכל הקטלוג ומורכב מחדש. אל תערוך ידנית.
${plan.filter((p) => p.ok).map((p) => `//   ${p.name} = ${p.expr} ⇒ ${p.shape.kind} ⇒ [${p.ops.join(', ')}] ⇒ ${(p.wired || ['—']).join(' + ')}`).join('\n')}
${notes.map((n) => '//   ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => DsScaffold(title: ${k(T('particlesTitle', { ent: entity.name }))}, subtitle: ${k(`${widgets.length} ${L.particlesLive} · ${notes.length} ${L.particlesUnres}`)}, icon: ${k('🧩')}, children: [
${widgets.map((w) => `    Padding(padding: const EdgeInsets.only(bottom: 10), child: ${w}),`).join('\n')}
  ]);
}
`;
  return { cls, code, notes, count: widgets.length };
}

export function planReport(plan) {
  let md = `# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)\n\n| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |\n|---|---|---|---|---|\n`;
  for (const p of plan) md += `| ${p.name} | ${p.entity} | ${p.shape ? p.shape.kind : '—'} | ${p.ok ? p.ops.map((o, i) => `${o}⇒${(p.picks[i].atoms[0] || '—').split('@')[0]}${p.picks[i].alts.length ? ` (${p.picks[i].alts.slice(0, 2).map((x) => x.split('@')[0]).join('/')})` : ''}`).join(' · ') : p.why} | ${(p.wired || []).join(' + ') || '—'} |\n`;
  return md;
}

// ── main · --gate: לכל ספק ב-specs-ds — התכנית ≡ particle-plan-<ns>.json (דטרמיניזם) · אפס חלקיק לא-פתור/לא-מחווט ──
import { fileURLToPath } from 'node:url';
export function planFor(specPath, ns) {
  const lines = fs.readFileSync(specPath, 'utf8').split('\n');
  const ents = lines.filter((l) => /^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/.test(l));
  return { lines, ents, particles: parseParticleLines(lines), ns };
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv.includes('--gate')) {
  const dir = path.join(GEN, 'specs-ds'); let bad = 0, n = 0, tot = 0;
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.txt')).sort() : []) {
    const ns = f.replace(/\.txt$/, ''); const planPath = path.join(GEN, `particle-plan-${ns}.json`);
    if (!fs.existsSync(planPath)) { console.log(`🔴 particles: אין particle-plan-${ns}.json — הרץ app-ds`); bad++; continue; }
    const stored = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    tot += stored.length; n++;
    const unres = stored.filter((p) => !p.ok || !(p.wired && p.wired.length));
    if (unres.length) { console.log(`🔴 particles (${ns}): ${unres.length} חלקיקים לא-פתורים/לא-מחווטים: ${unres.map((p) => p.name + (p.why ? ' (' + p.why + ')' : '')).join(' · ')}`); bad++; }
  }
  if (bad) process.exit(1);
  console.log(`✓ particles: ${tot} חלקיקים ב-${n} ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים (הכרעה-27)`); process.exit(0);
}
