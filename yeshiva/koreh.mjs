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
