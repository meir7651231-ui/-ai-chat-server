// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/koreh.mjs — ⛏️ **כורה-הדוגמאות.** בדפוס yeshiva-engine/yeshiva/mine.py («כורה המהלכים»), הכרעת-בעלים 24.9 «תחבר אותו».
//  ────────────────────────────────────────────────────────────────────────
//  הממצא: המחולל בודק כל צירוף מול דוגמאות, ולוקח דוגמאות רק מ«למשל:» במשפט. במסמך-הבונים של מירון (72) אין אף שורה;
//  בתרחישים (01–67 …) יש מאות — כתובות כסיפור. הישיבה למדה לקרוא טקסט חופשי כך: צורה שחוזרת אצל **הרבה מקורות שונים**
//  היא שיטה, צורה שחוזרת אצל מקור אחד היא תוכן ⇒ דירוג לפי **פיזור**, לא כמות ⇒ מועמד + 3 דוגמאות ⇒ קורא מאשר פעם אחת ⇒ פנקס.
//  כאן, אותו דבר על הקורפוס של הבעלים, מול שמות-הישויות שהמסמך נתן (doc-shape):
//   (א) מופע-ישות: «<שם-ישות> <שם/מספר>» (מצלמה 17 · שער דרום · אזור המתנה H) ⇒ מפתח-רשומה מועמד.
//   (ב) כמות: «<מספר> <יחידה>» באותו משפט של מופע ⇒ ערך מועמד לרשומה (300 איש · 5 אוטובוסים).
//  אפס מילון: שמות-הישויות מהמסמך, היחידה = המילה שאחרי המספר, הסינון = פיזור (מופע שמופיע במקור אחד בלבד לא עולה).
//  הפלט: מועמדים ממוינים + פנקס (.maimatai/koreh.json). ההכרעה אם זו דוגמה — אצל הבעלים (כמו «הקריאה נשארת למודל» ב-mine.py).
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
const PFX = ['ו', 'ה', 'ב', 'ל', 'מ', 'ש', 'כ', 'ד'];
const NUMRE = /^\d{1,3}(?:,\d{3})*(?:\.\d+)?$|^\d+(?:\.\d+)?$/;
const toks = (s) => String(s).replace(/[«»"“”()[\]]/g, ' ').split(/\s+/).filter(Boolean);
const bare = (w) => w.replace(/[.,:;!?·—–]+$/g, '');
/** מילה ⇒ האם היא שם-הישות (עם אות-שימוש אחת לכל היותר, ורבים -ים/-ות) */
function entOf(w, names) {
  const cands = [w, ...(PFX.includes(w[0]) ? [w.slice(1)] : []), ...(w.startsWith('וה') || w.startsWith('בה') || w.startsWith('לה') || w.startsWith('מה') ? [w.slice(2)] : [])];
  for (const c of cands) for (const n of names) { if (n.includes(' ')) continue; if (c === n || c === n + 'ים' || c === n + 'ות' || (n.endsWith('ה') && c === n.slice(0, -1) + 'ות')) return n; }
  return null;
}
/** מסמך ⇒ משפטים (טקסט נקי) */
const sentencesOf = (txt) => txt.split(/(?<=[.!?:])\s+|\n+|\s·\s/).map((s) => s.trim()).filter((s) => s.length > 3);
/** הכרייה: corpus = [{src, text}] · names = שמות-הישויות (עברית) */
export function mine(corpus, names, { minSources = 2 } = {}) {
  // שכיחות-מסמכית של כל מילה (בכמה מקורות היא מופיעה) — מילת-קישור מופיעה כמעט בכל מקור; שם-מופע/יחידה — לא (פיזור, לא מילון)
  const df = new Map(); for (const { text } of corpus) for (const w of new Set(toks(text).map(bare))) df.set(w, (df.get(w) || 0) + 1);
  const common = (w) => (df.get(w) || 0) > corpus.length * 0.25;
  const sentRows = new Map();   // ישות ⇒ משפטים עם כמויות
  const inst = new Map();   // key "ent|name" ⇒ {ent, name, srcs:Set, n, ex:[], qty: Map(unit ⇒ {vals:[], srcs:Set})}
  const units = new Map();  // unit ⇒ srcs
  for (const { src, text } of corpus) for (const s of sentencesOf(text)) { const t = toks(s);
    const qs = []; for (let i = 0; i < t.length - 1; i++) { const v = bare(t[i]); if (NUMRE.test(v)) { const u = bare(t[i + 1]); if (/^[֐-׿][֐-׿'"׳]*$/.test(u) && !common(u)) { qs.push({ v: +v.replace(/,/g, ''), u }); (units.get(u) || units.set(u, new Set()).get(u)).add(src); } } }
    { const es = new Set(t.map((w) => entOf(bare(w), names)).filter(Boolean)); if (qs.length && es.size === 1) { const e = [...es][0]; (sentRows.get(e) || sentRows.set(e, []).get(e)).push({ src, qs, s: s.slice(0, 120) }); } }   /* משפט שמזכיר ישות אחת בלבד + כמויות ⇒ שורה אפשרית (גם בלי שם-מופע) */
    for (let i = 0; i < t.length - 1; i++) { const e = entOf(bare(t[i]), names); if (!e) continue;
      const nx = bare(t[i + 1]); if (!nx) continue;
      // שם-המופע: מספר · אות-לועזית · מילה עם גרש (ב׳) · מילה עברית אחת (+ אחת אם השנייה אות/מספר: «המתנה H»)
      let name = null; if (/^[A-Za-z]{1,3}\d*$/.test(nx) || /['׳]$/.test(nx)) name = nx; else if (/^[֐-׿]{2,}$/.test(nx)) { const n2 = bare(t[i + 2] || ''); name = /^[A-Za-z]{1,2}\d*$/.test(n2) || /^\d{1,3}$/.test(n2) ? `${nx} ${n2}` : nx; }
      if (!name || names.includes(name) || common(name.split(' ')[0]) || (/^[ובלכמ]/.test(name) && (df.get(name.slice(1)) || 0) >= (df.get(name) || 0))) continue;
      if (/^ה/.test(name) && (df.get(name.slice(1)) || 0) > 0) name = name.slice(1);   /* «האיסוף» = «איסוף» (יידוע) */   /* מספר לבד = לרוב הפניה לנושא («ארגון 27») · מילת-קישור נפוצה · «ו»+מילה */
      const k = `${e}|${name}`; const r = inst.get(k) || inst.set(k, { ent: e, name, srcs: new Set(), n: 0, ex: [], qty: new Map() }).get(k);
      r.srcs.add(src); r.n++; if (r.ex.length < 3 && !r.ex.some((x) => x.src === src)) r.ex.push({ src, s: s.slice(0, 160) });
      for (const q of qs) { const Q = r.qty.get(q.u) || r.qty.set(q.u, { vals: [], srcs: new Set() }).get(q.u); Q.vals.push(q.v); Q.srcs.add(src); } } }
  // מילה שבאה אחרי **הרבה** ישויות שונות היא לא שם-מופע אלא מילת-קישור («אזור של», «שער אחד») ⇒ נופלת לפי פיזור-הישויות
  const entsPerName = new Map(); for (const r of inst.values()) (entsPerName.get(r.name) || entsPerName.set(r.name, new Set()).get(r.name)).add(r.ent);
  const cands = [...inst.values()].filter((r) => r.srcs.size >= minSources && entsPerName.get(r.name).size <= 2)
    .map((r) => ({ ent: r.ent, name: r.name, sources: r.srcs.size, n: r.n, ex: r.ex, qty: [...r.qty.entries()].filter(([, Q]) => Q.srcs.size >= 1).map(([u, Q]) => ({ unit: u, vals: [...new Set(Q.vals)].slice(0, 5), sources: Q.srcs.size })).sort((a, b) => b.sources - a.sources).slice(0, 4) }))
    .sort((a, b) => b.sources - a.sources || b.n - a.n);
  // יחידה ⇒ ליד אילו ישויות היא באה (אותו משפט כמו מופע) — כדי לשאול «איזה שדה» רק בין השדות של הישויות האלה
  const unitEnts = new Map(); for (const r of inst.values()) for (const [u, Q] of r.qty) { const m = unitEnts.get(u) || unitEnts.set(u, new Map()).get(u); m.set(r.ent, new Set([...(m.get(r.ent) || []), ...Q.srcs])); }
  const unitList = [...units.entries()].map(([u, s]) => ({ unit: u, sources: s.size })).filter((x) => x.sources >= minSources).sort((a, b) => b.sources - a.sources);
  for (const u of unitList) { const m = unitEnts.get(u.unit); u.ents = m ? [...m.entries()].map(([e, s]) => ({ ent: e, sources: s.size })).sort((a, b) => b.sources - a.sources) : []; u.sample = null; }
  for (const c of cands) for (const q of c.qty) { const u = unitList.find((x) => x.unit === q.unit); if (u && !u.sample) u.sample = `${q.vals[0]} ${q.unit}`; }
  return { candidates: cands, units: unitList, corpus: corpus.length, sentRows: Object.fromEntries(sentRows) };
}
/** ⛏️⚖️ כללים מהסיפור («אין לי אלא» ⇒ חיפוש, הכרעת-בעלים 25.9 «צא»): משפט-כלל = «<תנאי> → <פעולה>» (חץ, כמו שורת-זרימה במסמך 72),
 *  כשבצד-התנאי יש מספר+מילה (או ישות) ובצד-הפעולה יש מילה (לא רק מעבר-מספרים «3.5 → 3.1»). קיבוץ לפי נושא: ישות מהמסמך, אחרת המילה שאחרי המספר.
 *  אפס מילון · אפס מודל: הצורה בלבד + פיזור (בכמה מקורות). מה שלא מתחבר לטבלה ⇒ נשאר כלל-שנמצא עם המקור, לא נזרק ולא מומצא. */
export function rulesOf(corpus, names, { subjects = [], skip = [], instances = {}, when = [] } = {}) {   /* when = מילות-תנאי (knowledge/conditions.json) ⇒ «כש<תנאי> — <פעולה>» הוא אותו כלל בלי חץ */
  const WH = when.length ? new RegExp('^(?:.{0,40}?\\s)?(?:' + when.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?=[֐-׿A-Za-z])(.{3,120}?)\\s+[—–-]{1,2}\\s+(.{3,140})$') : null;   /* instances = {שם-מופע: ישות} מהכורה («צפון» ⇒ אזור) */
  // נושא = שם-ישות (עם ים/ות/אות-שימוש ⇒ entOf) · אחרת המילה אחרי המספר — בלי מילות-זמן/יחידות-משך (skip מהדאטה) ובלי מילה נפוצה (פיזור > 25% מהמקורות)
  const df = new Map(); for (const { text } of corpus) for (const w of new Set(toks(text).map(bare))) df.set(w, (df.get(w) || 0) + 1);
  const common = (w) => corpus.length >= 8 && (df.get(w) || 0) > corpus.length * 0.25;   /* פיזור נמדד רק בקורפוס שיש בו מה למדוד */
  const out = new Map();   // נושא ⇒ Map(כלל-מנורמל ⇒ {cond, act, srcs:Set, ex})
  const HEW = /[֐-׿][֐-׿'"׳]*/g;
  const norm = (x) => x.replace(/\d[\d,.:]*/g, '#').replace(/\s+/g, ' ').trim();
  const subjOf = (cond) => { const t = toks(cond).map(bare);
    const inst = (w) => instances[w] || instances[w.replace(/^[ובלמה]/, '')] || null;
    const ents = [...new Set(t.map((w) => entOf(w, names) || inst(w)).filter(Boolean))];
    const sub = []; for (let i = 0; i < t.length - 1; i++) if (/^\d[\d,.]*\+?$/.test(t[i]) && /^[֐-׿]/.test(t[i + 1] || '')) { const w = t[i + 1]; const e = entOf(w, names); if (e) { sub.push(e); continue; } const w1 = w.replace(/^[ובלמה](?=[֐-׿]{3})/, ''); if (!skip.includes(w) && !skip.includes(w1) && !common(w1) && !/['׳]$/.test(w1)) sub.push(w1); }
    for (const w of t) { if (entOf(w, names) || inst(w)) continue; const w0 = w.replace(/^[ובלמהש]/, ''); if (subjects.includes(w) || subjects.includes(w0)) sub.push(subjects.includes(w) ? w : w0); }
    return [...new Set([...ents, ...sub])]; };
  for (const { src, text } of corpus) for (const line of text.split(/\n+/)) for (const s0 of line.split(/\s·\s|(?<=[.!?])\s+/)) {
    if (/\|/.test(s0)) continue;   /* שורת-טבלה (מחזור-חיים «הקמה → פירוק») — לא כלל */
    const s = s0.replace(/[«»"“”]/g, '').trim(); let m = s.match(/^(.{3,140}?)\s*[→⇒]\s*(.{2,140})$/); let prose = false;
    if (!m && WH) { const w = s.match(WH); if (w) { m = [w[0], w[1], w[2]]; prose = true; } }   /* «כשמקור נופל — הביטחון יורד» */
    if (!m) continue;
    let cond = m[1].trim(); const act = m[2].split(/\s*[→⇒]\s*/)[0].trim(); let label = null;
    { const lm = cond.match(/^([֐-׿][֐-׿'"׳\- ]{1,24}):\s*(.+)$/); if (lm && !/\d/.test(lm[1])) { label = lm[1].trim(); cond = lm[2].trim(); } }   /* «מתרחבות: אדם → קוד אישי» — תווית (סוג-הכלל), לא נושא */
    if (!prose && !/\d/.test(cond) && !names.some((n) => cond.includes(n))) continue;          // תנאי-חץ = כמות או ישות (תנאי-כש נושא את עצמו)
    if (!(act.match(HEW) || []).some((w) => w.length > 1) || /^[\d.:,\s/+\-–]+$/.test(act)) continue;   // פעולה = מילה, לא רק מספר
    const subs = subjOf(cond); if (label) for (const w of toks(label).map(bare)) { const e = entOf(w, names); if (e && !subs.includes(e)) subs.push(e); }   /* «נקודות איסוף: …» ⇒ גם נקודה */
    for (const sub of subs) { const g = out.get(sub) || out.set(sub, new Map()).get(sub); const k = norm(cond) + ' → ' + norm(act);
      const r = g.get(k) || g.set(k, { cond, act, label, srcs: new Set(), ex: `${src}: ${s.slice(0, 160)}` }).get(k); r.srcs.add(src); } }
  // יחיד/רבים של אותה מילה (ילד/ילדים · נקודה/נקודות) ⇒ נושא אחד (הצורה הנפוצה); נושא שאינו ישות ושכל כלליו ממקור אחד ⇒ תוכן של תרחיש, לא שיטה (פיזור)
  const keyOf = (w) => w.replace(/(ים|ות)$/, '').replace(/ה$/, ''); const groups = new Map();
  for (const sub of out.keys()) { const k = names.includes(sub) ? sub : keyOf(sub); (groups.get(k) || groups.set(k, []).get(k)).push(sub); }
  const res = {};
  for (const subs of groups.values()) { const main = subs.find((x) => names.includes(x)) || subs.sort((a, b) => out.get(b).size - out.get(a).size)[0]; const m = new Map();
    for (const x of subs) for (const [k, r] of out.get(x)) { const r0 = m.get(k); if (r0) for (const s2 of r.srcs) r0.srcs.add(s2); else m.set(k, { ...r, srcs: new Set(r.srcs) }); }
    const rows = [...m.values()]; const srcs = new Set(rows.flatMap((r) => [...r.srcs])); if (!names.includes(main) && srcs.size < 2) continue;
    res[main] = rows.map((r) => ({ cond: r.cond, act: r.act, ...(r.label ? { label: r.label } : {}), sources: r.srcs.size, ex: r.ex })).sort((a, b) => b.sources - a.sources); }
  return res;
}
/** זיכרון-המיפוי (יחידה ⇒ ישות.שדה) — מקומי, כמו שאר תשובות-הבעלים (הכרעה-35: הדלת לא כותבת ל-new/) */
const MAP_FILE = () => process.env.MAVIN_KOREH_MAP || '.maimatai/koreh-map.jsonl';
export function unitMap() { try { const m = {}; for (const l of fs.readFileSync(MAP_FILE(), 'utf8').split('\n').filter(Boolean)) { const e = JSON.parse(l); m[e.unit] = e.to; } return m; } catch { return {}; } }
export function rememberUnit(unit, to) { fs.mkdirSync(path.dirname(MAP_FILE()), { recursive: true }); fs.appendFileSync(MAP_FILE(), JSON.stringify({ at: new Date().toISOString(), unit, to }) + '\n'); }
/** שורות-דוגמה: לכל מופע של ישות — שמו בשדה-הבחירה שלו (אם נבחר) + הערכים של היחידות שמופו לשדות של אותה ישות */
export function rowsOf(res, ent, fields, { enumField = null, map = {} } = {}) {
  const rows = [];
  for (const c of res.candidates.filter((x) => x.ent === ent.name)) { const row = fields.map(() => ''); let n = 0;
    if (enumField) { const i = fields.indexOf(enumField); if (i >= 0) row[i] = c.name; }
    for (const q of c.qty) { const to = map[q.unit]; if (!to || to === 'לא') continue; const [e, f] = to.split('.'); if (e !== ent.name) continue; const i = fields.indexOf(f); if (i >= 0 && !row[i]) { row[i] = String(q.vals[0]); n++; } }
    if (n) rows.push(row); }
  for (const sr of (res.sentRows || {})[ent.name] || []) { const row = fields.map(() => ''); let n = 0;   /* משפט בלי שם-מופע: רק הערכים שמופו */
    for (const q of sr.qs) { const to = map[q.u]; if (!to || to === 'לא') continue; const [e, f] = to.split('.'); if (e !== ent.name) continue; const i = fields.indexOf(f); if (i >= 0 && !row[i]) { row[i] = String(q.v); n++; } }
    if (n && !rows.some((r) => r.join('|') === row.join('|'))) rows.push(row); }
  return rows.slice(0, 12);
}
/** קורפוס מתיקייה (html/md) */
export async function corpusOf(dir) {
  const DS = await import('../machtzev/generator/doc-shape.mjs');
  return fs.readdirSync(dir).filter((f) => /\.(html?|md|txt)$/.test(f)).map((f) => ({ src: f.replace(/\.[^.]+$/, ''), text: DS.htmlToMd(fs.readFileSync(path.join(dir, f), 'utf8')).replace(/^[#|\-\s]+/gm, ' ') }));
}
/** פנקס (כמו daf/*_ledger.json בישיבה) */
export function ledger(res, file = process.env.MAVIN_KOREH || '.maimatai/koreh.json') { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...res }, null, 1)); return file; }

if (import.meta.url === `file://${process.argv[1]}`) {
  const [dir, docFile] = process.argv.slice(2);
  const DS = await import('../machtzev/generator/doc-shape.mjs');
  const names = DS.entityTables(DS.htmlToMd(fs.readFileSync(docFile, 'utf8'))).map((e) => e.name);
  const res = mine(await corpusOf(dir), names);
  console.log(`⛏️ כורה: ${res.corpus} מקורות · ${names.length} ישויות · ${res.candidates.length} מופעים (≥2 מקורות)`);
  for (const c of res.candidates.slice(0, +(process.env.N || 40))) console.log(`  ${c.ent} «${c.name}» · ${c.sources} מקורות${c.qty.length ? ' · ' + c.qty.map((q) => `${q.unit} ${q.vals.join('/')}`).join(' · ') : ''}`);
  console.log('יחידות (פיזור):', res.units.slice(0, 25).map((u) => `${u.unit}×${u.sources}`).join(' · '));
}
