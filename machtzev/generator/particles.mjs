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
export const CONTENT_RE = new RegExp('^\\s*' + G.contentWord + '\\s+');   // G24 · אטומי-תוכן: `תוכן <קבוצה> [תג]: טקסט`
export const REPORT_RE = new RegExp('^\\s*' + G.reportWord + '\\s+');     // G24 · חלקיק-דוח: `דוח <ישות>: <חלק> = ref, ref…`
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

// ── 1ב · אטומי-תוכן (G24): טקסט מילה-במילה מהמסמך של האדם — דאטה, לא קוד. `תוכן <קבוצה> [תג]: <טקסט>` ──
export function parseContentLines(lines) {
  const out = [];
  for (const line of lines) {
    if (!CONTENT_RE.test(line)) continue;
    const m = line.replace(CONTENT_RE, '').match(/^([^\[:]+?)\s*(?:\[([^\]]+)\])?\s*:\s*(.+)$/);
    if (!m) continue;
    out.push({ group: clean(m[1]), tag: m[2] ? clean(m[2]) : null, text: m[3].trim(), line });
  }
  return out;
}
// ── 1ג · חלקיק-דוח (G24): מסך-אחד-לרשומה במבנה-קבוע. `דוח <ישות>: <חלק> = ref, ref…`; ref = שדה/חלקיק של השורש · ישות.שדה/חלקיק · [תוכן קבוצה] ──
const CONTENT_REF = new RegExp('^\\[\\s*' + alt(G.pContent) + '\\s+([^\\]]+)\\]\\s*$');
export function parseReportLines(lines) {
  const out = [];
  for (const line of lines) {
    if (!REPORT_RE.test(line)) continue;
    const body = line.replace(REPORT_RE, '');
    const ci = body.indexOf(':'); if (ci < 0) continue;
    const entity = clean(body.slice(0, ci));
    const rest = body.slice(ci + 1).trim(); const eq = rest.indexOf(' = '); if (eq < 0) continue;
    const section = clean(rest.slice(0, eq)) || rest.slice(0, eq).trim();
    const refs = rest.slice(eq + 3).split(',').map((x) => x.trim()).filter(Boolean).map((raw) => {
      let m;
      if ((m = raw.match(CONTENT_REF))) return { raw, kind: 'content', group: clean(m[2]) };
      const di = raw.indexOf('.');
      if (di > 0) return { raw, kind: 'child', entity: clean(raw.slice(0, di)), name: clean(raw.slice(di + 1)) };
      return { raw, kind: 'own', name: clean(raw) };
    });
    out.push({ entity, section, refs, line });
  }
  return out;
}

// ── 2 · צורה מבנית (אפס-מילון: אופרטורים, סוגריים, סוג-השדה מהסכמה) ──
export function shapeOf(expr, schema, content = [], opts = {}) {
  const F = (label) => schema.find((s) => s.label === clean(label)) || null;
  const e = expr.trim();
  let m;
  if ((m = e.match(CONTENT_REF))) {   // G24 · [תוכן קבוצה] ⇒ צורה=רשימת-טקסטים (מתויגים או לא) מאטומי-התוכן של הספק
    const group = clean(m[2]); const items = content.filter((c) => c.group === group);
    if (!items.length) return { kind: null, why: `אין אטומי-תוכן לקבוצה "${group}"` };
    return { kind: 'content', group, items, tagged: items.some((c) => c.tag) };
  }
  if ((m = e.match(new RegExp('^\\[' + alt(G.pTable) + '\\]')))) return { kind: 'table' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pSearch) + '\\]')))) return { kind: 'search' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pFilter) + '\\]')))) return { kind: 'filter' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pExport) + '\\]')))) return { kind: 'export' };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pEmpty) + '\\]\\s*(.*)$')))) return { kind: 'empty', text: m[2] };
  if ((m = e.match(new RegExp('^\\[' + alt(G.pAct) + '\\]\\s*(.*)$')))) return { kind: 'act', label: clean(m[2]) };
  if ((m = e.match(new RegExp('^' + alt(G.pCount) + '\\s*\\(\\s*([^)=]*?)\\s*(?:=\\s*([^)]+))?\\)$')))) return { kind: 'count', field: clean(m[2]) || null, value: m[3] ? clean(m[3]) : null };
  if ((m = e.match(new RegExp('^' + alt(G.pSum) + '\\s*\\(\\s*([^)]+)\\)$')))) return { kind: 'sum', field: clean(m[2]), f: F(m[2]) };
  if ((m = e.match(new RegExp('^' + alt(G.pAvg) + '\\s*\\(\\s*([^)]+)\\)$')))) return { kind: 'avg', field: clean(m[2]), f: F(m[2]) };
  const f0 = F(e);   // G24 · שדה-מדויק קודם לאופרטורים: תווית כמו "חורג מול חודשים" היא שדה, לא השוואה (L98)
  if (f0 && f0.enumVals && f0.enumVals.length && !opts.single) return { kind: 'partition', field: f0.label, bands: f0.enumVals };
  if (f0) return { kind: 'raw', field: f0.label, computed: !!f0.formula, date: f0.type === 'date', num: f0.type === 'num', enumv: !!(f0.enumVals && f0.enumVals.length) };
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
  if (shape.kind === 'content') return shape.tagged ? ['group', 'alert'] : ['alert'];   // רשימת-טקסטים: קבוצה-פר-תג (אם יש) + הודעה-פר-שורה
  if (shape.kind === 'partition') return ['group', 'alert'];   // חלוקה-למצבים: קבוצה-פר-ערך + שורה-פר-רשומה (G24: השורה דרך אטום, לא Text חשוף)
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
  items: /^(items|options)$/, selected: /^(selected|activeIndex|index)$/, onSelect: /^(onSelect|onChanged)$/, children: /^(children)$/,   // G24: בורר/מיכל
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
    else if (SOCK.items.test(name) && /^List<String>/.test(t) && ctx.items) e = ctx.items;
    else if (SOCK.selected.test(name) && t === 'int' && ctx.selected != null) e = ctx.selected;
    else if (SOCK.onSelect.test(name) && /ValueChanged<int>|void Function\(int\)/.test(t) && ctx.onSelect) e = ctx.onSelect;
    else if (SOCK.children.test(name) && /^List<Widget>/.test(t) && ctx.children) e = `[${ctx.children.join(', ')}]`;
    if (e == null) { if (req) return null; continue; }   // שקע-חובה בלי דאטה ⇒ האטום נפסל (§20-ג: אין ערך-מומצא)
    args.push(w.positional.includes(name) ? e : `${name}: ${e}`);
  }
  return { cls, file: w.file, call: `${cls}(${args.join(', ')})` };
}

// ── 5 · תכנון: לכל חלקיק — צורה ⇒ פעולות ⇒ אטומים (חיפוש) ⇒ חיווט; מועמד שלא מתחווט ⇒ הבא (alts) ──
export function planParticles({ particles, entities, content = [], single = false }) {
  const plan = [];
  for (const p of particles) {
    const ent = entities.find((e) => e.name === p.entity);
    if (!ent) { plan.push({ ...p, ok: false, why: `אין ישות "${p.entity}" בספק` }); continue; }
    const shape = shapeOf(p.expr, ent.schema, content, { single });
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
export function particleWidgets({ entity, plan, k, recs: recsOverride = null }) {
  const scoped = !!recsOverride;   // G24 · דוח: הרשומות מוגבלות לרשומת-השורש ⇒ אגרגטים inline על הרשימה (לא על appStore כולו)
  const recs = recsOverride || `appStore.records('${entity.slug}')`;
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
      const foldSum = `${recs}.fold(0.0, (a, r) => a + (num.tryParse(r[${k(s.field)}] ?? '') ?? 0))`;
      const expr = s.kind === 'count' ? (s.field ? `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(s.value || '')}).length.toDouble()` : scoped ? `${recs}.length.toDouble()` : `appStore.count('${entity.slug}').toDouble()`)
        : s.kind === 'sum' ? (scoped ? foldSum : `appStore.sum('${entity.slug}', ${k(s.field)})`) : (scoped ? `(${recs}.isEmpty ? 0.0 : ${foldSum} / ${recs}.length)` : `appStore.avg('${entity.slug}', ${k(s.field)})`);
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
    } else if (s.kind === 'partition') {   // חלוקה-למצבים: קבוצה פר-ערך-enum (כותרת = ערך · מונה, children = שורות-רשומה דרך אטום-הודעה) — הכול בחיפוש
      // השדה-המתאר של הרשומה בקבוצה: שדה-טקסט חופשי (לא נוסחה/enum/מקונן/מספר/תאריך/מצביע-לישות); רב-שורתי > תווית-רב-מילים > ראשון; מיון יציב
      const textish = entity.schema.filter((f) => !f.formula && !(f.enumVals && f.enumVals.length) && !(f.members && f.members.length) && !/^(num|date|bool)$/.test(f.type || '') && !(p.entNames || []).includes(f.label));
      const desc = textish.slice().sort((a, b) => (b.type === 'multiline') - (a.type === 'multiline') || b.label.split(/\s+/).length - a.label.split(/\s+/).length)[0] || entity.schema[0];
      const row = firstWired(kd[1][1], { message: strOf(desc.label), label: strOf(desc.label), sub: k(p.expr), tone: 0 });
      if (!row) { notes.push(`⚪ ${p.name}: אין אטום-שורה מתחווט ל-${kd[1][0]}`); continue; }
      const groups = s.bands.map((band) => {
        const inBand = `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(band)}).toList()`;
        const rowsExpr = `for (final r in ${inBand}) ${row.call}`;
        const g = firstWired(kd[0][1], { label: `${k(band)} + ' · ' + ${inBand}.length.toString()`, children: [rowsExpr], value: { str: `${inBand}.length.toString()`, num: `${inBand}.length.toDouble()` }, sub: k(p.expr), glyph: k('🧩'), tone: 0 });
        if (!g) return null;
        return /children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${rowsExpr}])`;
      });
      if (groups.some((g) => !g)) { notes.push(`⚪ ${p.name}: אין אטום-קבוצה מתחווט ל-${kd[0][0]}`); continue; }
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${groups.join(', ')}]))`); p.wired = [groups[0].match(/^([A-Za-z0-9_]+)\(/)[1], row.cand]; continue;
    } else if (s.kind === 'raw') {
      const shown = p.labelled ? `${k(s.field)} + ': ' + ${strOf(s.field)}` : strOf(s.field);   // G24 · בדוח: "שדה: ערך" (עובדה בכרטיס); במסך-חלקיקים: הערך לבדו
      const ctx = { label: shown, value: { str: strOf(s.field), num: numOf(s.field) }, sub: lbl, glyph: k('🧩'), tone: 0, message: shown };
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
    } else if (s.kind === 'content') {   // G24 · אטומי-תוכן: קבוצה-פר-תג (group עם children ⇒ מיכל; בלעדיו כותרת+שורות) + הודעה-פר-שורה (alert)
      const linePick = s.tagged ? kd[1][1] : kd[0][1];
      const lineOf = (it) => firstWired(linePick, { message: k(it.text), label: k(it.text), sub: k(it.tag || ''), tone: 0 });
      const rows = s.items.map(lineOf);
      if (rows.some((w) => !w)) { notes.push(`⚪ ${p.name}: אין אטום-הודעה מתחווט ל-${s.tagged ? kd[1][0] : kd[0][0]}`); continue; }
      let out;
      if (s.tagged) {
        const tags = [...new Set(s.items.map((it) => it.tag || ''))];
        const groups = tags.map((tag) => {
          const mine = s.items.map((it, i) => [it, rows[i]]).filter(([it]) => (it.tag || '') === tag).map(([, w]) => w.call);
          const g = firstWired(kd[0][1], { label: k(`${tag} · ${mine.length}`), children: mine, sub: k(p.expr), glyph: k('🧩'), tone: 0 });
          if (!g) return null;
          return /children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${mine.join(', ')}])`;
        });
        if (groups.some((g) => !g)) { notes.push(`⚪ ${p.name}: אין אטום-קבוצה מתחווט ל-${kd[0][0]}`); continue; }
        out = `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${groups.join(', ')}])`;
      } else out = `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${rows.map((w) => w.call).join(', ')}])`;
      widgets.push(out); p.wired = [rows[0].cand]; continue;
    } else { notes.push(`⚪ ${p.name}: צורה ${s.kind} — פליטה טרם נבנתה (חיפוש בוצע: ${kd.map(([o, pk]) => o + '⇒' + (pk.atoms[0] || '—')).join(' · ')})`); continue; }
    widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in ${rowSrc}) Padding(padding: const EdgeInsets.only(bottom: 8), child: ${rowOf.call})]))`);
  }
  return { imports, widgets, notes, firstWired };
}
const clsOf = (slug) => 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
export function renderParticles({ slug, entity, plan, k }) {
  const { imports, widgets, notes } = particleWidgets({ entity, plan, k });
  const cls = clsOf(slug);
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

// ── 7 · חלקיק-דוח (G24): מבנה-קבוע-לרשומה — כל חלק = רשימת-refs; כל ref נפתר לחלקיק-קיים / שדה (חלקיק-סינתטי) / אטומי-תוכן, ומורכב באותו חיפוש-פתוח ──
export function planReports({ reports, plan, entities, content = [] }) {
  const byEnt = new Map();
  for (const r of reports) {
    const root = entities.find((e) => e.name === r.entity);
    if (!root) { (byEnt.get(r.entity) || byEnt.set(r.entity, { entity: r.entity, root: null, sections: [], unresolved: [`אין ישות "${r.entity}" בספק`] }).get(r.entity)).sections.push({ name: r.section, refs: [] }); continue; }
    const rep = byEnt.get(r.entity) || byEnt.set(r.entity, { entity: r.entity, root, sections: [], unresolved: [] }).get(r.entity);
    const refs = r.refs.map((ref) => {
      if (ref.kind === 'content') {
        const [pp] = planParticles({ particles: [{ entity: root.name, name: ref.group, expr: `[${G.pContent[0]} ${ref.group}]` }], entities, content });
        return pp.ok ? { ...ref, mode: 'content', p: pp } : { ...ref, why: pp.why };
      }
      const ent = ref.kind === 'child' ? entities.find((e) => e.name === ref.entity) : root;
      if (!ent) return { ...ref, why: `אין ישות "${ref.entity}"` };
      const link = ref.kind === 'child' ? (ent.schema.find((f) => f.label === root.name) || null) : null;
      if (ref.kind === 'child' && !link) return { ...ref, why: `ל-"${ent.name}" אין שדה-קשר אל "${root.name}"` };
      const existing = plan.find((p) => p.ok && p.entSlug === ent.slug && p.name === ref.name && !(ref.kind === 'own' && p.shape.kind === 'partition'));   // רשומה-אחת ⇒ ערך, לא חלוקה
      if (existing) return { ...ref, mode: ref.kind === 'child' ? 'childParticle' : 'particle', p: existing, ent, link: link ? link.label : null };
      const field = ent.schema.find((f) => f.label === ref.name);
      if (!field) return { ...ref, why: `"${ref.name}" אינו חלקיק ולא שדה של "${ent.name}"` };
      const [pp] = planParticles({ particles: [{ entity: ent.name, name: field.label, expr: field.label, labelled: true }], entities, content, single: ref.kind !== 'child' });   // שדה-השורש = רשומה-אחת ⇒ enum כערך, לא חלוקה
      return pp.ok ? { ...ref, mode: ref.kind === 'child' ? 'childParticle' : 'particle', p: pp, ent, link: link ? link.label : null, synthetic: true } : { ...ref, why: pp.why };
    });
    rep.sections.push({ name: r.section, refs });
    for (const x of refs) if (x.why) rep.unresolved.push(`${r.section} › ${x.raw}: ${x.why}`);
  }
  return [...byEnt.values()].map((r) => ({ ...r, ok: !!r.root && r.unresolved.length === 0 }));
}

export function renderReport({ slug, report, k }) {
  const root = report.root; const rootSlug = root.slug;
  const imports = new Set(); const notes = [...report.unresolved]; const sections = [];
  const wired = (cls, ctx) => { const w = wireAtom(cls, ctx); if (w) imports.add(`import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`); return w; };
  const firstWired = (pick, ctx) => { for (const cand of [...pick.atoms, ...pick.alts]) { const w = wired(cand.split('@')[0], ctx); if (w) return { ...w, cand }; } return null; };
  const goal = `${G.reportWord} ${root.name}`;
  const picker = firstWired(searchOp('switch', goal), { items: `[for (final o in appStore.options('${rootSlug}')) o.value]`, selected: '_i', onSelect: '(i) => setState(() => _i = i)', label: k(root.name), glyph: k('🧩') });
  const empty = firstWired(searchOp('empty', goal), { message: k(T('reportEmpty', { ent: root.name })), label: k(root.name), glyph: k('🧩') });
  const used = [];
  for (const sec of report.sections) {
    const children = [];
    for (const ref of sec.refs) {
      if (ref.why) continue;
      const recs = ref.mode === 'childParticle' ? `appStore.referencing('${ref.ent.slug}', ${k(ref.link)}, id0)` : ref.mode === 'content' ? `[r0]` : `[r0]`;
      const ent = ref.mode === 'content' ? root : ref.ent;
      const w = particleWidgets({ entity: ent, plan: [ref.mode === 'particle' && ref.p.shape.kind === 'raw' && !ref.p.labelled ? { ...ref.p, labelled: true } : ref.p], k, recs });   // עובדה-של-השורש בדוח = "שדה: ערך" גם כשהחלקיק קיים (עותק; ה-wired כבר על המקור)
      for (const i of w.imports) imports.add(i);
      for (const n of w.notes) notes.push(`${sec.name} › ${ref.raw}: ${n}`);
      children.push(...w.widgets); if (ref.p.wired) used.push(`${ref.raw}⇒${ref.p.wired.join('+')}`);
    }
    if (!children.length) continue;
    const g = firstWired(searchOp('group', goal), { label: k(sec.name), children, sub: k(sec.name), glyph: k('🧩'), tone: 0 });
    sections.push(g ? (/children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${children.join(', ')}])`) : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${children.join(', ')}])`);
  }
  const cls = clsOf(slug);
  const title = k(T('reportTitle', { ent: root.name })); const sub = k(T('reportSub', { n: sections.length }));
  const code = `// 📄 חולל ע"י חלקיק-הדוח (particles · G24 · הכרעה-27): מבנה-קבוע-לרשומה; כל חלק מורכב מחלקיקים שנמצאו בחיפוש-פתוח. אל תערוך ידנית.
${report.sections.map((s) => `//   ${s.name} = ${s.refs.map((r) => r.raw + (r.why ? ' ⚪' : '')).join(', ')}`).join('\n')}
${used.map((u) => '//   ' + u).join('\n')}
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  int _i = 0;
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, __) {
    final rs = appStore.records('${rootSlug}');
    if (rs.isEmpty) return DsScaffold(title: ${title}, subtitle: ${sub}, icon: ${k('📄')}, children: [${empty ? empty.call : 'const SizedBox.shrink()'}]);
    final r0 = rs[_i.clamp(0, rs.length - 1)];
    final id0 = r0[AppStore.idKey] ?? '';
    return DsScaffold(title: ${title}, subtitle: ${sub}, icon: ${k('📄')}, children: [
      ${picker ? `Padding(padding: const EdgeInsets.only(bottom: 12), child: ${picker.call}),` : ''}
${sections.map((w) => `      Padding(padding: const EdgeInsets.only(bottom: 12), child: ${w}),`).join('\n')}
    ]);
  });
}
`;
  return { cls, code, notes, count: sections.length, picker: picker ? picker.cand : null };
}

export function reportsMd(reports) {
  let md = `\n# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)\n\n| דוח | חלק | ref | פתרון | אטומים |\n|---|---|---|---|---|\n`;
  for (const r of reports) for (const s of r.sections) for (const x of s.refs) md += `| ${r.entity} | ${s.name} | ${x.raw} | ${x.why ? '⚪ ' + x.why : x.mode + (x.synthetic ? ' (שדה)' : '')} | ${x.p && x.p.wired ? x.p.wired.join(' + ') : x.p && x.p.picks ? x.p.picks.map((pk) => (pk.atoms[0] || '—').split('@')[0]).join(' · ') : '—'} |\n`;
  return md;
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
    const rpPath = path.join(GEN, `report-plan-${ns}.json`);   // G24 · דוחות: כל ref פתור
    const spec = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    if (parseReportLines(spec).length) {
      if (!fs.existsSync(rpPath)) { console.log(`🔴 particles: אין report-plan-${ns}.json — הרץ app-ds`); bad++; continue; }
      const rp = JSON.parse(fs.readFileSync(rpPath, 'utf8')); const badR = rp.filter((r) => !r.ok);
      if (badR.length) { console.log(`🔴 particles (${ns}): דוחות לא-פתורים: ${badR.flatMap((r) => r.unresolved).join(' · ')}`); bad++; }
      tot += rp.reduce((a, r) => a + r.sections.reduce((b, s) => b + s.refs.length, 0), 0);
    }
  }
  if (bad) process.exit(1);
  console.log(`✓ particles: ${tot} חלקיקים ב-${n} ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים (הכרעה-27)`); process.exit(0);
}
