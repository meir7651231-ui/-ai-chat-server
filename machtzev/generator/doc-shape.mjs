// 📐 doc-shape — קריאת מסמך **לפי צורה, לא לפי תבנית** (הכרעת-בעלים 24.9 «תתחיל לתקן … תשפר ותשדרג»).
//   נמדד: מירון/72 (אפיון טכני, 21 ישויות בטבלה «ישות | שדות | מצבים») ⇒ peruk קרא 0 שדות (הוא מכיר רק את שלד-הפירוק שלו)
//   ⇒ נבנתה אפליקציה כללית «תיק» מהדאטה של peruk. כאן: כל טבלה במסמך (Markdown או HTML) נבדקת לפי הצורה שלה —
//   עמודה שרוב התאים בה הם **רשימה** (· או ,) = שדות · רשימה נוספת אחריה = מצבים · העמודה הראשונה = שם.
//   שם עם מילה לועזית ומילה עברית («Zone אזור») = מילון שהמסמך עצמו נותן ⇒ שדה «from_zone» מקושר ל«אזור» (בלי מילון שלי).
//   זרימות «ישות.שדה > מספר → פעולה» ⇒ תנאים (נאספים ומוחזרים; מי שקורא מחליט מה לבנות מהם).
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
const HE = /[֐-׿]/;
/** HTML ⇒ Markdown מינימלי (כותרות · רשימות · טבלאות) — כדי שקבצי-הבעלים (html) ייקראו ישירות */
export function htmlToMd(h) {
  if (!/<(table|h[1-4]|p|div|li)\b/i.test(h)) return h;
  let s = h.replace(/<(style|script|head)[^>]*>[\s\S]*?<\/\1>/gi, '');
  for (let i = 1; i <= 4; i++) s = s.replace(new RegExp(`<h${i}[^>]*>`, 'gi'), '\n' + '#'.repeat(i) + ' ');
  s = s.replace(/<li[^>]*>/gi, '\n- ').replace(/<tr[^>]*>/gi, '\n| ').replace(/<\/t[dh]>/gi, ' | ').replace(/<(p|div|br|pre)[^>]*>/gi, '\n').replace(/<[^>]+>/g, '');
  s = s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  return s.split('\n').map((l) => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n');
}
const listOf = (cell) => { const sep = cell.includes('·') ? '·' : cell.includes(',') ? ',' : null; return sep ? cell.split(sep).map((x) => x.trim()).filter(Boolean) : null; };
const cleanField = (f) => ({ raw: f, name: f.replace(/\(.*?\)|\{.*?\}|→.*$/g, '').replace(/\[\]$/, '').trim(), multi: /\[\]|\{.*\}\]?$|_ids$|s$/.test(f.replace(/\(.*?\)/g, '').trim()) });
/** הטבלאות שבמסמך: רצף שורות «| … |» ⇒ מערך שורות-תאים */
function tablesOf(md) {
  const out = []; let cur = null;
  for (const l of md.split('\n')) { const t = l.trim(); if (t.startsWith('|')) { const cells = t.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()); if (cells.every((c) => /^:?-+:?$/.test(c) || !c)) continue; (cur ??= []).push(cells); } else if (t && cur) { out.push(cur); cur = null; } }
  if (cur) out.push(cur); return out;
}
/** טבלת-ישויות לפי צורה: עמודת-שדות = העמודה שב-≥60% מהשורות היא רשימה של ≥2; מצבים = עמודת-רשימה אחריה */
export function entityTables(md) {
  const ents = [];
  for (const rows of tablesOf(md)) { if (rows.length < 2) continue; const w = Math.max(...rows.map((r) => r.length));
    const isList = (ci, min) => rows.filter((r) => { const l = listOf(r[ci] || ''); return l && l.length >= min; }).length;
    let fc = -1; for (let ci = 1; ci < w; ci++) if (isList(ci, 2) >= Math.ceil(rows.length * 0.6)) { fc = ci; break; } if (fc < 0) continue;
    const sc = fc + 1 < w && isList(fc + 1, 2) >= Math.ceil(rows.length * 0.3) ? fc + 1 : -1;
    const body = rows.filter((r) => { const l = listOf(r[fc] || ''); return l && l.length >= 2; });   // שורת-כותרת (לא רשימה) נופלת לבד
    for (const r of body) { const nameCell = r[0] || ''; const he = nameCell.split(/\s+/).filter((x) => HE.test(x)).join(' ').replace(/[+/]/g, ' ').trim(); if (!he) continue;
      const alias = nameCell.split(/\s+/).filter((x) => /^[A-Za-z]+$/.test(x));
      const fields = listOf(r[fc]).map(cleanField).filter((f) => f.name);
      const states = sc >= 0 ? (listOf(r[sc] || '') || []).map((x) => x.replace(/\(.*?\)/g, '').trim()).filter((x) => x && x !== '—') : [];
      ents.push({ name: he, alias, fields, states }); } }
  return ents;
}
/** זרימות «ישות.שדה יחס מספר → …» (שורות במסמך) */
export function flowsOf(md) {
  return [...md.matchAll(/^\s*([A-Za-z]+)\.([A-Za-z_]+)\s*([<>])\s*([\d.]+)\s*([a-zא-ת]*)\s*→\s*(.+)$/gm)].map((m) => ({ ent: m[1], field: m[2], op: m[3], n: +m[4], unit: m[5] || '', then: m[6].trim() }));
}
/** המסמך ⇒ ספק app-ds: ישות לכל שורה · שדה שמכיל שם-לועזי של ישות אחרת ⇒ «<שדה> <שם-עברי>» (relOf מקשר לפי המילה העברית) */
export function docToSpec(md0, { title = null } = {}) {
  const md = htmlToMd(md0); const ents = entityTables(md); if (!ents.length) return { spec: null, ents: [], flows: [], links: [] };
  const byAlias = new Map(); for (const e of ents) for (const a of e.alias) byAlias.set(a.toLowerCase(), e.name);
  const links = [];
  const lines = [`אפליקציה: ${title || (md.match(/^#\s+(.+)$/m) || [])[1] || 'מסמך'}`];
  for (const e of ents) {
    const fl = e.fields.map((f) => { const toks = f.name.toLowerCase().split(/[_\s]+/).map((t) => t.replace(/s$/, '').replace(/^id$/, '')); const hit = toks.map((t) => byAlias.get(t)).find((x) => x && x !== e.name);
      if (hit) { links.push({ ent: e.name, field: f.name, to: hit, multi: f.multi }); return `${f.name} ${hit}`; } return f.name; });
    lines.push(`ישות ${e.name} עם ${[...new Set(fl)].join(', ')}${e.states.length ? ` | שלבים ${e.states.join(', ')}` : ''}`); }
  return { spec: lines.join('\n') + '\n', ents, flows: flowsOf(md), links };
}
/** 🔁 המסמך ⇒ **משפט** בשפת-המחולל («לכל X יש …; שלבים: …» · זרימה ⇒ «התראה כש<שדה> מעל N») — כדי שהמסמך יעבור באותו צינור
 *  כמו משפט (לולאת ein · קושיות · חיפוש-צורה · התראות), ולא בדלת נפרדת שנתקעת ועוצרת (הכרעת-בעלים 24.9 «תחבר»).
 *  זרימה על שדה שאינו בשום טבלה (flow_ratio) נכנסת גם היא — הצינור שואל עליה (הגדרה/חיפוש), לא הדלת מוותרת. */
export function docToSentence(md0, { title = null, enums = {}, rows = {}, defs = {}, extra = {}, newEnts = [], clauses = [] } = {}) {   /* newEnts = [{name, fields}] — טבלה שהבעלים אישר מהכיוון-ההפוך */   /* defs = {שם-בזרימה: ביטוי} · extra = {ישות: [שדות]} — תשובות-הבעלים (לא ניחוש) */   /* enums = {ישות: {שדה: [ערכים]}} — מהכורה, אחרי שהבעלים אמר לאיזה שדה */
  const md = htmlToMd(md0); const r = docToSpec(md0, { title }); if (!r.spec) return null;
  const head = (title || (md.match(/^#\s+(.+)$/m) || [])[1] || 'מסמך').replace(/[:.;]/g, ' ').split(/\s+[—–-]\s+/)[0].trim();
  const link = (e, f) => { const l = r.links.find((x) => x.ent === e.name && x.field === f.name); const ev = (enums[e.name] || {})[f.name]; return l ? `${f.name} ${l.to}` : ev && ev.length ? `${f.name} ${ev.map((v) => v.replace(/\s+/g, '_')).join('/')}` : f.name; };   /* «kind איסוף/מפגש» = שדה-בחירה בשפת-המשפט */
  const parts = r.ents.map((e) => `לכל ${e.name} יש ${[...new Set([...e.fields.map((f) => link(e, f)), ...(extra[e.name] || [])])].join(', ')}${(rows[e.name] || []).length ? `; למשל: ${rows[e.name].map((x) => x.join(', ')).join('; ')}` : ''}${e.states.length ? `; שלבים: ${e.states.join(', ')}` : ''}`);   /* שורות מהכורה (תאים ריקים נשמרים) */
  for (const n of newEnts) parts.push(`לכל ${n.name} יש ${n.fields.join(', ')}${(n.stages || []).length ? `; שלבים: ${n.stages.join(', ')}` : ''}`);
  const aliasHe = new Map(); for (const e of r.ents) for (const a of e.alias) aliasHe.set(a.toLowerCase(), e.name);
  const LU = (() => { try { return JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')).latinUnits || {}; } catch { return {}; } })();
  const flows = r.flows.map((f) => ({ ...f, he: aliasHe.get(f.ent.toLowerCase()) || null, clause: `התראה כש${defs[f.field.replace(/_/g, ' ')] || f.field.replace(/_/g, ' ')} ${f.op === '>' ? 'מעל' : 'מתחת ל-'}${f.op === '>' ? ' ' : ''}${f.n}${f.unit && LU[f.unit] ? ' ' + LU[f.unit] : ''}` }));   /* «5h» ⇒ «5 שעות» (latinUnits בדאטה) — היחידה לא נבלעת */   /* שם-השדה כמו שהצינור קורא אותו (_ ⇒ רווח) */
  return { ...r, sentence: `${head}: ${parts.join('. ')}${flows.length ? '. ' + flows.map((f) => f.clause).join('. ') : ''}${clauses.length ? '. ' + clauses.join('. ') : ''}`, flows };   /* clauses = כללי-התרחישים שתורגמו (koreh.ruleClauses) */
}
