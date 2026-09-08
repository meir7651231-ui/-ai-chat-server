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
import { isPaper, skinWired } from './look.mjs';   // G28 · נייר: אטום שלא לובש עור נפסל

const GEN = R.GEN_DIR;
const G = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8'));   // §19-ד: דקדוק-החלקיקים מהדאטה
const alt = (a) => '(' + a.join('|') + ')';
export const PARTICLE_RE = new RegExp('^\\s*' + G.particleWord + '\\s+');
export const CONTENT_RE = new RegExp('^\\s*' + G.contentWord + '\\s+');   // G24 · אטומי-תוכן: `תוכן <קבוצה> [תג]: טקסט`
export const REPORT_RE = new RegExp('^\\s*' + G.reportWord + '\\s+');     // G24 · חלקיק-דוח: `דוח <ישות>: <חלק> = ref, ref…`
const heW = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const clean = (s) => heW(s).join(' ').trim();
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";   // G25: גם שורה-חדשה (טקסט-תוכן רב-שורתי)

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
const EXPORT_HEAD = new RegExp('^\\[\\s*' + alt(G.pExport) + '\\s*\\]\\s*(.*)$');   // G25 · `דוח <ישות>: [ייצוא] <תווית> = <שדה-יעד>, <מילות-מטרה>`
export function parseReportLines(lines) {
  const out = [];
  for (const line of lines) {
    if (!REPORT_RE.test(line)) continue;
    const body = line.replace(REPORT_RE, '');
    const ci = body.indexOf(':'); if (ci < 0) continue;
    const entity = clean(body.slice(0, ci));
    const rest = body.slice(ci + 1).trim();
    let xm;
    if ((xm = rest.match(EXPORT_HEAD))) {   // G25 · ייצוא-הדוח: תווית + מטרה (שדה-יעד + מילים בעברית שמנחות את חיפוש-מנוע-הקישור)
      const eqx = xm[2].indexOf(' = ');
      const label = (eqx > 0 ? xm[2].slice(0, eqx) : xm[2]).trim(); const goal = eqx > 0 ? xm[2].slice(eqx + 3).trim() : '';
      out.push({ entity, export: { label, goal }, line }); continue;
    }
    const eq = rest.indexOf(' = '); if (eq < 0) continue;
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
  // G29 · צורות-הפלט של «מה חוזר» (הכרעה-28): דיף · מספר-אחד · הודעה×נוסחים · לוח-תאריכים — הכל מהסכמה ומאטומי-התוכן, אפס-פרוזה
  if ((m = e.match(new RegExp('^\\[' + alt(G.pDiff) + '\\]\\s*(.+)$')))) {
    const pairs = []; const arrow = new RegExp('\\s*(?:' + G.pairArrow.map((a) => a.replace(/[-]/g, '\\-')).join('|') + ')\\s*');
    for (const seg of m[2].split(/[;؛]/).map((x) => x.trim()).filter(Boolean)) {
      const fm = seg.match(/^(.+?)\s*[×*]\s*(\d+)\s*$/); const body = fm ? fm[1] : seg; const factor = fm ? +fm[2] : 0;
      const ab = body.split(arrow).map((x) => clean(x)); if (ab.length !== 2) return { kind: null, why: `דיף: צפוי «ישן ← חדש»: ${seg}` };
      if (!F(ab[0]) || !F(ab[1])) return { kind: null, why: `דיף: שדה לא בסכמה: ${!F(ab[0]) ? ab[0] : ab[1]}` };
      pairs.push({ a: ab[0], b: ab[1], factor });
    }
    if (!pairs.length) return { kind: null, why: 'דיף בלי זוגות' };
    return { kind: 'diff', pairs };
  }
  if ((m = e.match(new RegExp('^\\[' + alt(G.pNumber) + '\\]\\s*([^:：]+?)\\s*(?:[:：]\\s*(.+))?$')))) { const f = F(m[2]); if (!f) return { kind: null, why: `מספר: שדה לא בסכמה: ${m[2]}` }; return { kind: 'number', field: f.label, note: m[3] ? m[3].trim() : '' }; }
  if ((m = e.match(new RegExp('^\\[' + alt(G.pMessage) + '\\]\\s*(.+?)\\s*=\\s*(.+)$')))) {
    const f = F(m[2]); if (!f || !(f.enumVals && f.enumVals.length)) return { kind: null, why: `הודעה: «${m[2]}» אינו שדה-בחירה` };
    const cm = m[3].trim().match(CONTENT_REF); if (!cm) return { kind: null, why: 'הודעה: צפוי [תוכן קבוצה]' };
    const group = clean(cm[2]); const items = content.filter((c) => c.group === group); if (!items.length) return { kind: null, why: `הודעה: אין תוכן לקבוצה "${group}"` };
    return { kind: 'message', field: f.label, values: f.enumVals, items, group };
  }
  if ((m = e.match(new RegExp('^\\[' + alt(G.pDates) + '\\]\\s*(.*)$')))) {
    const listed = m[2].split(/[,،]/).map((x) => clean(x)).filter(Boolean);
    const fields = listed.length ? listed.map((l) => F(l)).filter((f) => f && f.type === 'date') : schema.filter((f) => f.type === 'date');
    if (!fields.length) return { kind: null, why: 'לוח: אין שדות-תאריך' };
    return { kind: 'dates', fields: fields.map((f) => f.label) };
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
  if (shape.kind === 'diff') return ['trend', 'magnitude'];      // G29 · שורה-פר-שינוי (ערך+Δ) + שורת-סיכום (משמעות-כסף בשנה)
  if (shape.kind === 'number') return ['hero'];                 // G29 · המספר-שלך: ערך גדול + תווית + הערה
  if (shape.kind === 'message') return ['switch', 'alert'];     // G29 · נוסחים (בורר) + טקסט-ההודעה (הודעה)
  if (shape.kind === 'dates') return ['magnitude'];             // G29 · לוח: שורת תווית+ערך (כמו עובדות-השורש), ממוינת
  if (shape.kind === 'partition') return ['group', 'alert'];   // חלוקה-למצבים: קבוצה-פר-ערך + שורה-פר-רשומה (G24: השורה דרך אטום, לא Text חשוף)
  const f = { kind: shape.kind, headline: shape.headline };
  try { return opsOfKind(f).map((o) => o.op); } catch { return null; }
}
export function searchOp(op, goal, need = null, k = 3) {   // need: דריסת-צורך (G26: fact עם label+value ⇒ שורת מפתח-ערך)
  if (isPaper()) k = Math.max(k, 12);   // G28 · נייר: אטומים בצבע-קשיח נפסלים ⇒ צוללים עמוק יותר עד הלובש-עור
  const fam = OPFAM[op] || op;
  if (LOGIC.has(op)) { const c = coverLogic({ op: fam, need: [], goal }); return { op, fam, logic: true, atoms: c.atoms || [], alts: c.alts || [] }; }
  const c = cover({ op: fam, need: need || NEED[op] || [], goal, k });
  return { op, fam, logic: false, atoms: c.atoms || [], alts: c.alts || [], missing: c.missing || [] };
}

// ── 4 · חיווט: שקעי-האטום ⇐ דאטה אמיתית. אין דאטה לשקע-חובה ⇒ null (האטום נפסל) ──
let ATLAS = null; const atlas = () => (ATLAS ||= buildAtlas({ forge: isPaper() }));   // G28 · נייר: גם אטומי-forge (לובשי-עור) ברי-חיווט ישיר; כהה = אטלס ביט-זהה
const widgetOf = (cls) => atlas().widgets.find((w) => w.cls === cls) || null;
const SOCK = {
  value: /^(value|val|amount|total|count|num)$/, label: /^(label|title|caption|name|text)$/, sub: /^(sub|subtitle|desc|body|note)$/,
  glyph: /^(glyph|emoji|icon)$/, fraction: /^(fraction|pct|percent|progress)$/, tap: /^(onTap|onPressed)$/, tone: /^(tone|severity|level)$/,
  labels: /^(labels|cols|columns|headers)$/, rows: /^(rows|data)$/, message: /^(message)$/,
  items: /^(items|options)$/, selected: /^(selected|activeIndex|index)$/, onSelect: /^(onSelect|onChanged)$/, children: /^(children)$/,   // G24: בורר/מיכל
  delta: /^(delta|change|diff)$/,   // G29: שינוי (דיף)
};
// ctx: { label, value:{expr,type}, sub, fraction:{expr}, labels:[expr], rows:expr, glyph, nav:expr, message }
export function wireAtom(cls, ctx) {
  const w = widgetOf(cls); if (!w) return null;
  if (isPaper() && ctx.bare && !w.types.has('bare')) return null;   // G28 · נייר: הקורא ביקש בקרה חשופה (סרגל/בורר בתוך מסך) — אטום שאינו יודע להיות חשוף מצייר כרטיס/כותרת מיותרים ⇒ לא-מתאים
  if (isPaper() && !skinWired(w.file)) return null;   // G28 · הכי-טוב-לייעוד (§20-א): באפליקציית-נייר אטום עם צבע-קשיח אינו מועמד — הבא בתור (forge/DS) לובש את העור
  const args = []; const filled = [];
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
    else if (SOCK.items.test(name) && /^List<List<String>>/.test(t) && ctx.items) e = `[for (final s in ${ctx.items}) [s]]`;   // G28 · forge: פריט = תא-שדות ⇒ [תווית]
    else if (SOCK.selected.test(name) && t === 'int' && ctx.selected != null) e = ctx.selected;
    else if (SOCK.selected.test(name) && /^Set<int>/.test(t) && ctx.selected != null) e = `{${ctx.selected}}`;   // G28 · forge: בחירה = קבוצה
    else if (name === 'bare' && t === 'bool' && ctx.bare) e = 'true';   // G28 · forge: bare = בלי כרטיס-העטיפה (סרגל-ניווט/בורר בתוך מסך)
    else if (SOCK.onSelect.test(name) && /ValueChanged<int>|void Function\(int\)/.test(t) && ctx.onSelect) e = ctx.onSelect;
    else if (SOCK.children.test(name) && /^List<Widget>/.test(t) && ctx.children) e = `[${ctx.children.join(', ')}]`;
    else if (SOCK.delta.test(name) && t === 'String' && ctx.delta) e = ctx.delta;   // G29
    if (e == null) { if (req) return null; continue; }   // שקע-חובה בלי דאטה ⇒ האטום נפסל (§20-ג: אין ערך-מומצא)
    args.push(w.positional.includes(name) ? e : `${name}: ${e}`); filled.push(name);
  }
  for (const m of ctx.must || []) if (!filled.some((n) => SOCK[m] && SOCK[m].test(n))) return null;   // G26 · שקע-נדרש-מהקורא (עובדה ⇒ value) לא קיים באטום ⇒ נפסל
  const sockets = [...w.types.keys()].filter((n) => !/^(key|child|children|bare)$/.test(n)).length;
  return { cls, file: w.file, call: `${cls}(${args.join(', ')})`, filled, sockets };
}

// G28 · בחירה בין מועמדים שמתחווטים: כהה = הראשון (ביט-זהה) · נייר = הכי-טוב-לייעוד (§20-א): מלוא-השקעים המולא הגבוה ביותר
//   (אטום עם שקע-טקסט ריק מצייר placeholder — לא "הכי-טוב"); שוויון ⇒ הקודם בדירוג. wire = (cls) ⇒ תוצאת-wireAtom|null.
export function pickWired(cands, wire) {
  if (!isPaper()) { for (const cand of cands) { const w = wire(cand.split('@')[0]); if (w) return { ...w, cand }; } return null; }
  let best = null, bestScore = -1;
  for (const cand of cands) { const w = wire(cand.split('@')[0]); if (!w) continue; const score = w.sockets ? w.filled.length / w.sockets : 0; if (score > bestScore) { best = { ...w, cand }; bestScore = score; } }
  return best;
}

// ── 4ב · חיווט-מנוע (G25): פרמטרים לפי שם-השקע (טלפון/טקסט) · פרמטר-בשם-מנוע-אח = שקע-פונקציה (ho) ⇒ ייבוא המנוע-האח. שקע בלי ערך ⇒ null ──
const LSOCK = { phone: /phone|tel|mobile|number/i, text: /^(text|msg|message|body|content|note)$/i };
export function wireLogic(name, ctx) {
  const fn = atlas().functions.find((f) => f.name === name); if (!fn) return null;
  const args = []; const deps = [fn];
  for (const prm of fn.params || []) {
    let e = null;
    if (LSOCK.phone.test(prm.name) && ctx.phone) e = ctx.phone;
    else if (LSOCK.text.test(prm.name) && ctx.text) e = ctx.text;
    else { const dep = atlas().functions.find((f) => f.name === prm.name); if (dep) { deps.push(dep); e = prm.name; } }
    if (e == null) return null;
    args.push(e);
  }
  const fileOf = (d) => `${String(d.shelf || 'new/dart-maor').replace(/^new\//, '')}/${d.file}`;
  return { name, call: `${name}(${args.join(', ')})`, files: [...new Set(deps.map(fileOf))], ret: fn.ret };
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
    const NEED_BY_KIND = { dates: ['label', 'value'], number: ['value', 'label', 'sub'], diff: ['value', 'delta', 'label'] };   // G29 · הצורך המפורש של הצורה (כמו עובדות-השורש ב-G26) — הדירוג לפי כיסוי-השקעים
    const picks = ops.map((op, i) => searchOp(op, goal, i === 0 && NEED_BY_KIND[shape.kind] ? NEED_BY_KIND[shape.kind] : null, NEED_BY_KIND[shape.kind] ? 12 : 3));
    const children = entities.filter((e) => e !== ent && e.schema.some((f) => f.label === ent.name)).map((e) => ({ name: e.name, slug: e.slug, link: ent.name, schema: e.schema }));   // G29 · בנות (מצביעות לישות) — למקומות-שמורים {ישות.שדה}
    plan.push({ ...p, ok: picks.every((k) => k.atoms.length || k.logic), shape, ops, picks, entSlug: ent.slug, entNames: entities.map((e) => e.name), children });
  }
  return plan;
}

// G29 · הודעה: תבנית-תוכן ⇒ ביטוי-Dart של טקסט; {ערך}=ערך-הבחירה · {שדה}=שדה-הרשומה · {ישות.שדה}=שדות-הבנות מצורפים ב-", "
//   נוסח = פריט-תוכן שתגו = ערך-הבחירה; בלי תג = ברירת-מחדל לכל הערכים. אפס-פרוזה: הטקסט מהספק, הערכים מהרשומה.
function messageExpr(s, p, k, entity, rid) {
  const strOf = (lbl) => `(r[${k(lbl)}] ?? '')`;
  const tpl = (text) => {
    const parts = []; let last = 0;
    for (const m of text.matchAll(/\{([^}]+)\}/g)) {
      if (m.index > last) parts.push(k(text.slice(last, m.index)));
      const ph = m[1].trim();
      if (ph === G.pValueWord) parts.push(strOf(s.field));
      else if (ph.includes('.')) { const [en, fl] = ph.split('.').map((x) => x.trim()); const c = (p.children || []).find((x) => x.name === en); parts.push(c ? `appStore.referencing('${c.slug}', ${k(c.link)}, ${rid}).map((c) => c[${k(fl)}] ?? '').where((x) => x.trim().isNotEmpty).join(', ')` : k('')); }
      else if (entity.schema.some((f) => f.label === clean(ph))) parts.push(strOf(clean(ph)));   // clean: אותו נרמול-תווית כמו בסכמה (ספרות/סימנים)
      else parts.push(k(''));
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(k(text.slice(last)));
    return parts.length ? parts.join(' + ') : k('');
  };
  const def = s.items.find((it) => !it.tag); let expr = def ? tpl(def.text) : k('');
  for (const v of s.values) { const it = s.items.find((x) => x.tag === v); if (it) expr = `(${strOf(s.field)} == ${k(v)} ? (${tpl(it.text)}) : (${expr}))`; }
  return expr;
}
const numFmt = (e) => `${e}.toStringAsFixed(0)`;
const diffRows = (s, k, numOf) => s.pairs.map((pr) => { const a = numOf(pr.a), b = numOf(pr.b); return { fa: pr.a, fb: pr.b, factor: pr.factor, a, b, d: `(${b} - ${a})`, pct: `(${a} == 0 ? 0.0 : (${b} - ${a}) / ${a} * 100)`, yr: pr.factor ? `((${b} - ${a}) * ${pr.factor})` : null }; });
// ערך-הדיף: «חדש (היה ישן)» — בלי גליף-חץ (Heebo בלי חיצים ⇒ tofu)
const diffVal = (r0, k) => `${numFmt(r0.b)} + ' ' + ${k(T('diffWas', { old: '' }).replace('()', '('))} + ${numFmt(r0.a)} + ')'`;

// ── 6 · פליטה: מסך-חלקיקים לישות (AnimatedBuilder על appStore; אגרגטים למעלה, פר-רשומה בשורות) ──
export function particleWidgets({ entity, plan, k, recs: recsOverride = null }) {
  const scoped = !!recsOverride;   // G24 · דוח: הרשומות מוגבלות לרשומת-השורש ⇒ אגרגטים inline על הרשימה (לא על appStore כולו)
  const recs = recsOverride || `appStore.records('${entity.slug}')`;
  const numOf = (lbl) => `(num.tryParse(r[${k(lbl)}] ?? '') ?? 0)`;
  const strOf = (lbl) => `(r[${k(lbl)}] ?? '')`;
  const imports = new Set(); const widgets = []; const notes = [];
  const wired = (cls, ctx) => { const w = wireAtom(cls, ctx); if (w) imports.add(`import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`); return w; };
  const firstWired = (pick, ctx) => pickWired([...pick.atoms, ...pick.alts], (c) => wired(c, ctx));
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
    } else if (s.kind === 'diff') {   // G29 · רק מה-שהשתנה: שורה-פר-זוג עם Δ ו-% (+לשנה כשיש מכפיל) · שורת-סיכום = סך-לשנה
      const rows = diffRows(s, k, numOf);
      const rowW = firstWired(kd[0][1], { label: k(rows[0].fb), value: { str: diffVal(rows[0], k), num: rows[0].d }, delta: `(${rows[0].d} >= 0 ? '+' : '') + ${numFmt(rows[0].d)} + ' · ' + (${rows[0].pct} >= 0 ? '+' : '') + ${rows[0].pct}.toStringAsFixed(0) + '%'`, sub: rows[0].yr ? `${k(L.diffPerYear)} + ': ' + ${numFmt(rows[0].yr)}` : k(''), tone: 0, must: ['value', 'delta'] });
      if (!rowW) { notes.push(`⚪ ${p.name}: אין אטום-דיף מתחווט ל-${kd[0][0]}`); continue; }
      const rowCalls = rows.map((r0) => { const w = firstWired(kd[0][1], { label: k(r0.fb), value: { str: diffVal(r0, k), num: r0.d }, delta: `(${r0.d} >= 0 ? '+' : '') + ${numFmt(r0.d)} + ' · ' + (${r0.pct} >= 0 ? '+' : '') + ${r0.pct}.toStringAsFixed(0) + '%'`, sub: r0.yr ? `${k(L.diffPerYear)} + ': ' + ${numFmt(r0.yr)}` : k(''), tone: 0, must: ['value', 'delta'] }); return w ? `if (${r0.d} != 0) ${w.call}` : null; }).filter(Boolean);
      const yrs = rows.filter((r0) => r0.yr).map((r0) => r0.yr);
      const sumW = yrs.length ? firstWired(kd[1][1], { label: k(L.diffSum), value: { str: numFmt(`(${yrs.join(' + ')})`), num: `(${yrs.join(' + ')})` }, sub: k(''), tone: 0, must: ['value'] }) : null;
      widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in ${recs}) ...[${rowCalls.join(', ')}${sumW ? `, ${sumW.call}` : ''}]]))`);
      p.wired = [rowW.cand, ...(sumW ? [sumW.cand] : [])]; continue;
    } else if (s.kind === 'number') {   // G29 · המספר-שלך: ערך-גדול + תווית + הערת-התנאים
      const w = firstWired(kd[0][1], { label: lbl, value: { str: numFmt(numOf(s.field)), num: numOf(s.field) }, sub: k(s.note || ''), glyph: k(''), tone: 0, must: ['value'] });
      if (!w) { notes.push(`⚪ ${p.name}: אין אטום-מספר מתחווט ל-${kd[0][0]}`); continue; }
      rowOf = w; p.wired = [w.cand];
    } else if (s.kind === 'message') {   // G29 · נוסחים: בורר ערכי-הבחירה (כותב לרשומה — הקשה אחת) + טקסט-ההודעה המורכב מהרשומה
      const rid = `(r[AppStore.idKey] ?? '')`;
      const sel = `${s.values.map((v, i) => `(r[${k(s.field)}] ?? '') == ${k(v)} ? ${i} : `).join('')}0`;
      const sw = firstWired(kd[0][1], { items: `[${s.values.map((v) => k(v)).join(', ')}]`, selected: `(${sel})`, onSelect: `(i) => appStore.update('${entity.slug}', ${rid}, {${k(s.field)}: [${s.values.map((v) => k(v)).join(', ')}][i]})`, label: lbl, bare: true, must: ['items', 'selected', 'onSelect'] });
      const txt = messageExpr(s, p, k, entity, rid);
      const note = firstWired(kd[1][1], { message: txt, label: k(''), sub: k(''), tone: 0, must: ['message'] });
      if (!note) { notes.push(`⚪ ${p.name}: אין אטום-הודעה מתחווט ל-${kd[1][0]}`); continue; }
      if (!sw) notes.push(`⚪ ${p.name}: אין בורר-נוסחים מתחווט ל-${kd[0][0]} (הטקסט מוצג בלי בורר)`);
      rowOf = { call: `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${sw ? `Padding(padding: const EdgeInsets.only(bottom: 8), child: ${sw.call}), ` : ''}${note.call}])`, cand: note.cand };
      p.wired = [...(sw ? [sw.cand] : []), note.cand];
    } else if (s.kind === 'dates') {   // G29 · לוח: תווית+תאריך לכל שדה-תאריך מלא, ממוין
      const w = firstWired(kd[0][1], { label: 'e[0]', value: { str: 'e[1]', num: '0' }, sub: k(''), tone: 0, must: ['label', 'value'] });
      if (!w) { notes.push(`⚪ ${p.name}: אין אטום-לוח מתחווט ל-${kd[0][0]}`); continue; }
      const list = `(<List<String>>[${s.fields.map((f) => `[${k(f)}, ${strOf(f)}]`).join(', ')}].where((e) => e[1].trim().isNotEmpty).toList()..sort((a, b) => a[1].compareTo(b[1])))`;
      rowOf = { call: `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final e in ${list}) ${w.call}])`, cand: w.cand }; p.wired = [w.cand];
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
      const lineOf = (it) => firstWired(linePick, { message: k(it.text), label: isPaper() ? k('') : k(it.text), sub: k(it.tag || ''), tone: 0 });   // G29 · נייר: פסקה = הטקסט פעם אחת (הכותרת = הקבוצה/התג)
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
// ── 6ב · סריאליזציה (G25): לכל חלקיק ביטוי-Dart שמחזיר טקסט (וואטסאפ: *כותרת* · "- שורה" · "שדה: ערך"); צורות-פעולה/טבלה/ריק אינן טקסט ──
const descFieldOf = (entity, p) => {
  const textish = entity.schema.filter((f) => !f.formula && !(f.enumVals && f.enumVals.length) && !(f.members && f.members.length) && !/^(num|date|bool)$/.test(f.type || '') && !(p.entNames || []).includes(f.label));
  return textish.slice().sort((a, b) => (b.type === 'multiline') - (a.type === 'multiline') || b.label.split(/\s+/).length - a.label.split(/\s+/).length)[0] || entity.schema[0];
};
export function particleText({ entity, plan, k, recs: recsOverride = null }) {
  const scoped = !!recsOverride;
  const recs = recsOverride || `appStore.records('${entity.slug}')`;
  const numOf = (lbl) => `(num.tryParse(r[${k(lbl)}] ?? '') ?? 0)`;
  const strOf = (lbl) => `(r[${k(lbl)}] ?? '')`;
  const exprs = [];
  for (const p of plan) {
    if (!p.ok) continue;
    const s = p.shape; const lbl = k(p.name);
    if (/^(count|sum|avg)$/.test(s.kind)) {
      const foldSum = `${recs}.fold(0.0, (a, r) => a + (num.tryParse(r[${k(s.field)}] ?? '') ?? 0))`;
      const expr = s.kind === 'count' ? (s.field ? `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(s.value || '')}).length.toDouble()` : scoped ? `${recs}.length.toDouble()` : `appStore.count('${entity.slug}').toDouble()`)
        : s.kind === 'sum' ? (scoped ? foldSum : `appStore.sum('${entity.slug}', ${k(s.field)})`) : (scoped ? `(${recs}.isEmpty ? 0.0 : ${foldSum} / ${recs}.length)` : `appStore.avg('${entity.slug}', ${k(s.field)})`);
      exprs.push(`${lbl} + ': ' + ${expr}.toStringAsFixed(${s.kind === 'avg' ? 1 : 0})`); continue;
    }
    if (s.kind === '/' || s.kind === '−' || s.kind === '×' || s.kind === 'vs') {
      const a = numOf(s.a), b = numOf(s.b);
      const val = s.kind === '/' ? `(${b} == 0 ? 0.0 : ${a} / ${b})` : `(${a} - ${b})`.replace(' - ', s.kind === '×' ? ' * ' : ' - ');
      exprs.push(`[for (final r in ${recs}) ${lbl} + ': ' + ${val}.toStringAsFixed(${s.kind === '/' ? 2 : 0})].join('\\n')`); continue;
    }
    if (s.kind === 'diff') {   // G29 · טקסט: "שדה: ישן ← חדש (+Δ · +x%)" רק כשהשתנה + סיכום-לשנה
      const rows = diffRows(s, k, numOf);
      const lines = rows.map((r0) => `if (${r0.d} != 0) ${k(r0.fb)} + ': ' + ${diffVal(r0, k)} + ' (' + (${r0.d} >= 0 ? '+' : '') + ${numFmt(r0.d)} + ' · ' + ${r0.pct}.toStringAsFixed(0) + '%)'${r0.yr ? ` + ' · ' + ${k(L.diffPerYear)} + ' ' + ${numFmt(r0.yr)}` : ''}`);
      const yrs = rows.filter((r0) => r0.yr).map((r0) => r0.yr);
      exprs.push(`[for (final r in ${recs}) ...[${lines.join(', ')}${yrs.length ? `, ${k(L.diffSum)} + ': ' + ${numFmt(`(${yrs.join(' + ')})`)}` : ''}]].join('\\n')`); continue;
    }
    if (s.kind === 'number') { exprs.push(`[for (final r in ${recs}) ${lbl} + ': ' + ${numFmt(numOf(s.field))}${s.note ? ` + ' — ' + ${k(s.note)}` : ''}].join('\\n')`); continue; }
    if (s.kind === 'message') { exprs.push(`[for (final r in ${recs}) ${messageExpr(s, p, k, entity, `(r[AppStore.idKey] ?? '')`)}].join('\\n')`); continue; }
    if (s.kind === 'dates') { exprs.push(`[for (final r in ${recs}) ...[${s.fields.map((f) => `if (${strOf(f)}.trim().isNotEmpty) ${k(f)} + ': ' + ${strOf(f)}`).join(', ')}]].join('\\n')`); continue; }
    if (s.kind === 'partition') {
      const desc = descFieldOf(entity, p);
      const bands = s.bands.map((band) => { const inBand = `${recs}.where((r) => (r[${k(s.field)}] ?? '') == ${k(band)}).toList()`; return `'*' + ${k(band)} + ' · ' + ${inBand}.length.toString() + '*' + [for (final r in ${inBand}) '\\n- ' + ${strOf(desc.label)}].join()`; });
      exprs.push(`[${bands.join(', ')}].join('\\n')`); continue;
    }
    if (s.kind === 'raw') {
      const shown = p.labelled ? `${k(s.field)} + ': ' + ${strOf(s.field)}` : strOf(s.field);
      exprs.push(`[for (final r in ${recs}.where((r) => (r[${k(s.field)}] ?? '').toString().trim().isNotEmpty)) ${shown}].join('\\n')`); continue;
    }
    if (s.kind === 'content') {
      if (s.tagged) { const tags = [...new Set(s.items.map((it) => it.tag || ''))]; exprs.push(k(tags.map((tag) => `*${tag}*\n` + s.items.filter((it) => (it.tag || '') === tag).map((it) => '- ' + it.text).join('\n')).join('\n'))); }
      else exprs.push(k(s.items.map((it) => '- ' + it.text).join('\n')));
      continue;
    }
  }
  return exprs;
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
    if (root && r.export) {   // G25 · ייצוא-הדוח: אטום-פעולה (חיפוש) + מנוע-קישור (חיפוש-לוגיקה לפי מילות-המטרה של האדם) + שדה-היעד (טלפון)
      const rep = byEnt.get(r.entity) || byEnt.set(r.entity, { entity: r.entity, root, sections: [], unresolved: [] }).get(r.entity);
      const toks = r.export.goal.split(',').map((x) => x.trim()).filter(Boolean);
      const toField = toks.map((t) => root.schema.find((f) => f.label === clean(t))).find(Boolean) || null;
      const goalWords = toks.filter((t) => !root.schema.some((f) => f.label === clean(t))).join(' ');
      const action = searchOp('action', `${r.export.label} ${root.name}`);
      const link = searchOp('serialize', `${r.export.label} ${goalWords} ${root.name}`);
      const cands = [...link.atoms, ...link.alts].map((x) => x.split('@')[0]);
      let wiredLink = null;
      for (const cnd of cands) { const w = wireLogic(cnd, { phone: toField ? `(r0[__K(${JSON.stringify(toField.label)})] ?? '')` : null, text: 'text' }); if (w) { wiredLink = w; break; } }
      rep.export = { label: r.export.label, goal: r.export.goal, toField: toField ? toField.label : null, action, link: wiredLink, linkCands: cands.slice(0, 4), ok: !!wiredLink };
      if (!wiredLink) rep.unresolved.push(`${r.export.label}: ${L.exportNoLink} (${cands.slice(0, 3).join('/')})`);
      continue;
    }
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

export function renderReport({ slug, report, k, question = null, visible = 3 }) {   // G28 · question = השאלה שהמסך עונה עליה · visible = חלקים גלויים (השאר ב-DsFold «פרטים (n)», PLAN §3.2)
  const root = report.root; const rootSlug = root.slug;
  const imports = new Set(); const notes = [...report.unresolved]; const sections = [];
  const wired = (cls, ctx) => { const w = wireAtom(cls, ctx); if (w) imports.add(`import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`); return w; };
  const firstWired = (pick, ctx) => pickWired([...pick.atoms, ...pick.alts], (c) => wired(c, ctx));
  const goal = `${G.reportWord} ${root.name}`;
  const picker = firstWired(searchOp('switch', goal), { items: `[for (final o in appStore.options('${rootSlug}')) o.value]`, selected: 'i', onSelect: '(v) => setState(() => _sel = v)', label: k(root.name), glyph: k('🧩'), bare: true });
  const empty = firstWired(searchOp('empty', goal), { message: k(T('reportEmpty', { ent: root.name })), label: k(root.name), glyph: k('🧩') });
  const used = []; const texts = [];
  for (const sec of report.sections) {
    const children = [];
    texts.push(k('*' + sec.name + '*'));
    for (const ref of sec.refs) {
      if (ref.why) continue;
      const recs = ref.mode === 'childParticle' ? `appStore.referencing('${ref.ent.slug}', ${k(ref.link)}, id0)` : ref.mode === 'content' ? `[r0]` : `[r0]`;
      const ent = ref.mode === 'content' ? root : ref.ent;
      const w = particleWidgets({ entity: ent, plan: [ref.mode === 'particle' && ref.p.shape.kind === 'raw' && !ref.p.labelled ? { ...ref.p, labelled: true } : ref.p], k, recs });   // עובדה-של-השורש בדוח = "שדה: ערך" גם כשהחלקיק קיים (עותק; ה-wired כבר על המקור)
      for (const i of w.imports) imports.add(i);
      for (const n of w.notes) notes.push(`${sec.name} › ${ref.raw}: ${n}`);
      children.push(...w.widgets); if (ref.p.wired) used.push(`${ref.raw}⇒${ref.p.wired.join('+')}`);
      texts.push(...particleText({ entity: ent, plan: [ref.mode === 'particle' && ref.p.shape.kind === 'raw' ? { ...ref.p, labelled: true } : ref.p], k, recs }));
    }
    if (!children.length) continue;
    const g = firstWired(searchOp('group', goal), { label: k(sec.name), children, sub: k(sec.name), glyph: k('🧩'), tone: 0 });
    sections.push(g ? (/children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${children.join(', ')}])`) : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${children.join(', ')}])`);
  }
  const cls = clsOf(slug);
  // G25 · ייצוא: הטקסט = סריאליזציית-הדוח (פונקציה-עליונה, נבדקת); הקישור = המנוע שנמצא (waLink וכד׳) עם שדה-היעד; נפילה = שיתוף-מערכת
  const ex = report.export && report.export.ok ? report.export : null;
  let exportBtn = '', exportFns = '';
  if (ex) {
    const btn = firstWired(ex.action, { label: k(ex.label), nav: '() => _send(context, r0, id0)', glyph: k('📤') });
    if (!btn) notes.push(`${ex.label}: ${L.exportNoAction}`);
    else {
      for (const f of ex.link.files) imports.add(`import '../${f}';`);
      imports.add(`import 'package:share_plus/share_plus.dart';`); imports.add(`import 'package:url_launcher/url_launcher.dart';`);
      const linkCall = ex.link.call.replace(/__K\(("[^"]*")\)/g, (_, j) => k(JSON.parse(j)));
      exportBtn = `      Padding(padding: const EdgeInsets.only(top: 4, bottom: 12), child: ${btn.call}),`;
      exportFns = `
  Future<void> _send(BuildContext context, Map<String, String> r0, String id0) async {
    final text = reportText${cls}(r0, id0);
    final dynamic url = ${linkCall};
    if (url is String && url.isNotEmpty) { await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication); return; }
    await Share.share(text);
  }`;
      used.push(`${ex.label}⇒${btn.cand}+${ex.link.name}`);
    }
  }
  const textFn = `
/// 📤 סריאליזציית-הדוח לטקסט (G25): *חלק* · שורות; נבדקת ב-test/genesis_gen_app_<ns>_report_test.dart
String reportText${cls}(Map<String, String> r0, String id0) {
  final b = <String>[
${texts.map((t) => `    ${t},`).join('\n')}
  ];
  return b.where((s) => s.trim().isNotEmpty).join('\\n');
}
`;
  const title = k(question || T('reportTitle', { ent: root.name })); const sub = k(question ? T('reportTitle', { ent: root.name }) : T('reportSub', { n: sections.length }));
  // G28 · 3-למעלה, השאר מקופל: מעבר ל-visible ⇒ DsFold (כרום-DS, op expand) — דטרמיניסטי, בלי מצב-קודם לשבור
  const shown = sections.slice(0, visible), folded = sections.slice(visible);
  const foldW = folded.length ? `DsFold(title: ${k(T('foldLabel', { n: folded.length }))}, details: [${folded.map((w) => `Padding(padding: const EdgeInsets.only(bottom: 12), child: ${w})`).join(', ')}])` : null;
  const bodyRows = [...shown, ...(foldW ? [foldW] : [])];
  const code = `// 📄 חולל ע"י חלקיק-הדוח (particles · G24 · הכרעה-27): מבנה-קבוע-לרשומה; כל חלק מורכב מחלקיקים שנמצאו בחיפוש-פתוח. אל תערוך ידנית.
${report.sections.map((s) => `//   ${s.name} = ${s.refs.map((r) => r.raw + (r.why ? ' ⚪' : '')).join(', ')}`).join('\n')}
${used.map((u) => '//   ' + u).join('\n')}
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';
${textFn}
class ${cls} extends StatefulWidget {
  const ${cls}({this.initialId, super.key});
  final String? initialId;   // G26 · פתיחה מעמוד-השורש: הדוח של הרשומה הזו
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  int? _sel;${exportFns}
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, __) {
    final rs = appStore.records('${rootSlug}');
    if (rs.isEmpty) return DsScaffold(title: ${title}, subtitle: ${sub}, icon: ${k('📄')}, children: [${empty ? empty.call : 'const SizedBox.shrink()'}]);
    final i0 = _sel ?? (widget.initialId != null ? rs.indexWhere((r) => r[AppStore.idKey] == widget.initialId) : 0);
    final i = (i0 < 0 ? 0 : i0).clamp(0, rs.length - 1);
    final r0 = rs[i];
    final id0 = r0[AppStore.idKey] ?? '';
    return DsScaffold(title: ${title}, subtitle: ${sub}, icon: ${k('📄')}, children: [
      ${picker ? `Padding(padding: const EdgeInsets.only(bottom: 12), child: ${picker.call}),` : ''}
${bodyRows.map((w) => `      Padding(padding: const EdgeInsets.only(bottom: 12), child: ${w}),`).join('\n')}
${exportBtn}
    ]);
  });
}
`;
  return { cls, code, notes, count: sections.length, picker: picker ? picker.cand : null, exported: !!exportBtn, textFn: `reportText${cls}` };
}

export function reportsMd(reports) {
  let md = `\n# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)\n\n| דוח | חלק | ref | פתרון | אטומים |\n|---|---|---|---|---|\n`;
  for (const r of reports) if (r.export) md += `| ${r.entity} | [ייצוא] ${r.export.label} | ${r.export.goal} | ${r.export.ok ? 'action+link' : '⚪'} | ${(r.export.action.atoms[0] || '—').split('@')[0]} + ${r.export.link ? r.export.link.name : r.export.linkCands.join('/')} |\n`;
  for (const r of reports) for (const s of r.sections) for (const x of s.refs) md += `| ${r.entity} | ${s.name} | ${x.raw} | ${x.why ? '⚪ ' + x.why : x.mode + (x.synthetic ? ' (שדה)' : '')} | ${x.p && x.p.wired ? x.p.wired.join(' + ') : x.p && x.p.picks ? x.p.picks.map((pk) => (pk.atoms[0] || '—').split('@')[0]).join(' · ') : '—'} |\n`;
  return md;
}

// ── 8 · בדיקה מחוללת לסריאליזציה (G25): זורעת רשומה-לפי-הסכמה (ערכי-צורה, לא דומיין) ומוכיחה שהטקסט מכיל כל *חלק* וכל "שדה: " של השורש ──
export function renderReportTest({ ns, slug, report, textFn }) {
  const root = report.root;
  const val = (f, i) => f.enumVals && f.enumVals.length ? f.enumVals[0] : f.type === 'num' ? String(i + 1) : f.type === 'date' ? '2026-01-01' : f.type === 'bool' ? 'כן' : `${f.label}-${i + 1}`;
  const rootRec = root.schema.filter((f) => !(f.members && f.members.length)).map((f, i) => `${q(f.label)}: ${q(val(f, i))}`).join(', ');   // גם שדות-נוסחה: הטופס מתמיד אותם מחושבים ⇒ בזריעה ערך-צורה
  const children = [...new Set(report.sections.flatMap((s) => s.refs.filter((x) => x.mode === 'childParticle' && x.ent).map((x) => JSON.stringify([x.ent.slug, x.link]))))].map((j) => JSON.parse(j));
  const childEnt = (slugC) => report.sections.flatMap((s) => s.refs).find((x) => x.ent && x.ent.slug === slugC).ent;
  const seeds = children.map(([cs, link]) => { const e = childEnt(cs); const rec = e.schema.filter((f) => !(f.members && f.members.length)).map((f, i) => `${q(f.label)}: ${f.label === link ? 'id0' : q(val(f, i))}`).join(', '); return `  appStore.add('${cs}', {${rec}});`; }).join('\n');
  const expectSections = report.sections.map((s) => `  expect(t, contains('*${s.name.replace(/'/g, "\\'")}*'));`).join('\n');
  const labelled = [...new Set(report.sections.flatMap((s) => s.refs.filter((x) => x.mode === 'particle' && x.p && x.p.shape && x.p.shape.kind === 'raw').map((x) => x.p.shape.field)))];
  const expectFields = labelled.map((f) => `  expect(t, contains(${q(f + ': ')}));`).join('\n');
  return `// 🧪 ${T('exportTest')} · ${ns} — הטקסט של הדוח (G25) מכיל כל *חלק* וכל "שדה: ערך" של השורש; הרשומות נזרעות מהסכמה (ערכי-צורה).
import 'package:flutter_test/flutter_test.dart';
import 'package:buildsmart/genesis/dart-ui-bs/ds/ds_store.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_${slug}.dart';

void main() {
  test('${textFn}: *חלקים* + עובדות-השורש', () {
  final id0 = appStore.add('${root.slug}', {${rootRec}});
${seeds}
  final r0 = appStore.byId('${root.slug}', id0)!;
  final t = ${textFn}(r0, id0);
${expectSections}
${expectFields}
  });
}
`;
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
