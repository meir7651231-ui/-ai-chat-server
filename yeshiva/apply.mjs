#!/usr/bin/env node
// 🕯️ yeshiva-apply — הפוסק הישיבתי (שכבה 2: מייעץ · לא דורס · נתיק).
//   הקורא (read.mjs) מעלה קושיות. כאן המנוע **פוסק בעצמו** על כל אחת, לפי המהלך שהולידו,
//   ומחיל את מה שהכריע על עותק של הספק. אין כאן תשובות-אדם: מי שמכריע הוא המהלך, והראיה מצוטטת.
//   קלט: machtzev/generator/peruks/peruk-NN.md + machtzev/generator/specs-ds/perukNN.txt (שניהם לקריאה בלבד).
//   פלט: yeshiva/psak/perukNN.spec.txt (ספק מתוקן — **לצד** המקורי, אפס דריסה) · peruk-NN.psak.md (פנקס-פסק) · summary.json.
//   מה שאחרי כל המהלכים נשאר בלי עדות מכריעה — ורק הוא — נפלט כ**מתג**, ושתי האפשרויות בנויות בו.
//   שימוש: node yeshiva/apply.mjs [--all | peruk-04 …] [--json]     ניתוק: ראה DETACH.md (git rm -r yeshiva).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, parseSpec, parsePeruk } from './read.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = (process.env.MACHTZEV_ROOT ? path.resolve(process.env.MACHTZEV_ROOT) : path.resolve(HERE, '..')) + '/';
const PERUKS = path.join(ROOT, 'machtzev/generator/peruks');
const SPECS = path.join(ROOT, 'machtzev/generator/specs-ds');
const OUT = path.join(HERE, 'psak');
const ORDER = ['איכא דאמרי', 'שיעור', 'ורמינהו', 'ייתור', 'מאי X', 'אין מערבין', 'ממה נפשך'];

// ── התאמת-מילים (אותה צורה של read.mjs: תחילית אחת מותרת, ולא חיתוך שרירותי) ──
const STOP = new Set(['את', 'של', 'על', 'עם', 'או', 'אם', 'כי', 'לא', 'כן', 'זה', 'זו', 'יש', 'אין', 'מה', 'מי', 'גם', 'רק', 'כל', 'עוד', 'כבר', 'בלי', 'עד', 'מול', 'ועד', 'ולא', 'הוא', 'היא', 'הם', 'לפי', 'בין', 'אחרי', 'לפני', 'מתי', 'איך', 'למה', 'אז', 'אבל']);
const PREFIX = /^[ובלכמשה]/;
const words = (s) => [...String(s).matchAll(/[א-ת״׳"']{2,}/g)].map((m) => m[0]).filter((w) => !STOP.has(w));
const sameWord = (a, b) => a === b || (PREFIX.test(a) && a.slice(1) === b) || (PREFIX.test(b) && b.slice(1) === a);
const namedIn = (name, pool) => { const ws = words(name); return ws.length > 0 && ws.every((w) => pool.some((v) => sameWord(w, v))); };
const norm = (s) => String(s).replace(/[״"'׳]/g, '').replace(/\s+/g, ' ').trim();

// ── איתור מקטע-שדה בשורת-ישות גולמית. norm מסיר גרשיים («שכ״ד» ⇒ «שכד»), ולכן חיפוש
//   המחרוזת המנורמלת בשורה הגולמית נכשל בשקט. מפרקים את השורה כמו parseSpec ומשווים מנורמל למנורמל.
function fieldSeg(line, name) {
  const m = line.match(/^ישות (.+?) עם (.*?)(?: \| |$)/);
  if (!m) return null;
  let off = `ישות ${m[1]} עם `.length;
  for (const raw of m[2].split(',')) {
    if (norm(raw.trim().replace(/[*{(].*$/, '')) === name) return { start: off, end: off + raw.length, raw };
    off += raw.length + 1;
  }
  return null;
}
const starAt = (seg) => { const i = seg.search(/[*{(]/); return i >= 0 && seg[i] === '*' ? i : -1; };
const addStar = (seg) => { if (starAt(seg) >= 0) return seg; const i = seg.search(/[*{(]/); const at = i < 0 ? seg.replace(/\s+$/, '').length : i; return seg.slice(0, at) + '*' + seg.slice(at); };
const dropStar = (seg) => { const i = starAt(seg); return i < 0 ? seg : seg.slice(0, i) + seg.slice(i + 1); };
const entLine = (lines, at, name) => lines.findIndex((l, i) => /^ישות /.test(at(i)) && fieldSeg(at(i), name));

// ── המהלך שהוליד את הממצא (9 מהלכים תחת 7 שמות; ממה נפשך אינו שאלה כלל) ──
function moveOf(f) {
  const t = f.apply && f.apply.type;
  if (f.kind === 'ורמינהו') return t === 'dropField' ? 'ורמינהו · שדות תאומים' : t === 'require' ? 'ורמינהו · חובה בפירוק' : 'ורמינהו · רשות בפירוק';
  if (f.kind === 'ייתור') return t === 'field' ? 'ייתור · חובה בלי שדה' : 'ייתור · ציטוט';
  return f.kind;
}

// ── הפסק: לכל מהלך, מה מכריע אותו ועל סמך מה. בלי מהלך — אין פסק. ──
//   המקור הקובע: הספק נגזר מהמסמך (read.mjs שורה 3: «מה שהבעלים כתב» מול «מה ש-peruk.mjs גזר»),
//   ולכן בסתירה בין השניים — המסמך גובר. זו העדות, לא סברא.
export function pasak(f, doc, spec) {
  const move = moveOf(f);
  const docWords = words(doc.lines.join(' '));
  const base = { move, kind: f.kind, text: f.text, apply: f.apply || null };

  if (f.kind === 'ממה נפשך') return { ...base, ruling: 'אין שאלה', decided: true, apply: null, basis: ['שתי הקריאות נותנות אותה בנייה — לא שואלים כלל'] };

  if (f.kind === 'מאי X') return { ...base, ruling: 'מכני — מוחל לבד', decided: true, basis: [`מציין-מקום בשורת תוכן בספק: «${f.apply.line.slice(0, 70)}»`] };
  if (f.kind === 'אין מערבין') return { ...base, ruling: 'מכני — מוחל לבד', decided: true, basis: [`כותרת בשורת תוכן בספק: «${f.apply.line.slice(0, 70)}»`] };

  if (f.kind === 'שיעור') return { ...base, ruling: 'סף — מוחל לבד', decided: true, basis: [`מספר עם יחידה במסמך: «${f.line ? f.line.trim().slice(0, 90) : f.text.slice(0, 90)}»`, 'ולא בספק — לכן סף שנשמט'] };

  if (f.kind === 'איכא דאמרי') return { ...base, ruling: 'enum — מוחל לבד', decided: true, basis: [`רשימת-מקרים במסמך: «${f.line ? f.line.trim().slice(0, 90) : ''}»`, `הערכים כתובים במסמך: ${f.apply.opts.map((o) => `«${o}»`).join(' · ')}`] };

  if (move === 'ורמינהו · חובה בפירוק' || move === 'ורמינהו · רשות בפירוק') {
    const side = move === 'ורמינהו · חובה בפירוק' ? 'חובה' : 'רשות';
    return { ...base, ruling: `פליגא — המסמך גובר (${side})`, decided: true,
      basis: [`מקור א (המסמך, מה שהבעלים כתב): «${f.doc_says}» תחת ${side}`, `מקור ב (הספק, מה ש-peruk.mjs גזר): «${f.apply.name}» ההפך`, 'הספק נגזר מהמסמך ⇒ המסמך גובר'] };
  }

  if (move === 'ייתור · חובה בלי שדה') {
    return { ...base, ruling: 'פליגא — המסמך גובר (חובה)', decided: true,
      basis: [`מקור א (המסמך): «${f.doc_says}» תחת חובה ב"מה שולחים"`, 'מקור ב (הספק): אין שדה כלל', 'הספק נגזר מהמסמך ⇒ השדה נכנס'] };
  }

  if (move === 'ורמינהו · שדות תאומים') {
    // מבחן הקריסה: המסמך מכריע אם השניים הם אחד בשתי לשונות, או שניים בכוונה.
    const { ent, a, b } = f.pair;
    const inA = namedIn(a, docWords), inB = namedIn(b, docWords);
    if (inA && !inB) return { ...base, ruling: 'חד שיעורא — הספק פיצל אחד לשניים', decided: true, apply: { type: 'dropField', ent, name: b }, basis: [`«${a}» נקוב במסמך`, `«${b}» אינו נקוב במסמך`, `הספק נגזר מהמסמך ⇒ «${b}» נשמט`] };
    if (inB && !inA) return { ...base, ruling: 'חד שיעורא — הספק פיצל אחד לשניים', decided: true, apply: { type: 'dropField', ent, name: a }, basis: [`«${b}» נקוב במסמך`, `«${a}» אינו נקוב במסמך`, `הספק נגזר מהמסמך ⇒ «${a}» נשמט`] };
    if (inA && inB) return { ...base, ruling: 'לא שייך — שניהם נקובים במסמך', decided: true, apply: null, basis: [`«${a}» נקוב במסמך`, `«${b}» נקוב במסמך`, 'שני דברים שהבעלים כתב, לא סתירה ⇒ אין שינוי'] };
    return { ...base, ruling: 'מתג', decided: false,
      basis: [`«${a}» אינו נקוב במסמך`, `«${b}» אינו נקוב במסמך`, 'אין עדות לאף צד — לא נופלים לברירה'],
      options: [{ label: `א · «${b}» יורד מ${ent}`, apply: { type: 'dropField', ent, name: b } }, { label: 'ב · שניהם נשארים', apply: null }] };
  }

  // ייתור · ציטוט — המסמך מצטט ואינו אומר מה תפקיד הציטוט. שלוש קריאות, אף לא אחת כתובה.
  return { ...base, ruling: 'מתג', decided: false,
    basis: ['הציטוט במסמך ואינו בספק', `המסמך אינו אומר איזה מן ${f.readings.map((r) => `«${r}»`).join(' / ')} הוא`],
    options: [{ label: `א · נכנס כשורת תוכן: «${f.apply.line}»`, apply: f.apply }, { label: 'ב · נשאר פרוזה במסמך בלבד', apply: null }] };
}

// ── ההחלה: הפסק ⇒ הספק המתוקן (נמל מ-live/index.html · applyAnswers) ──
//   שינוי אחד מההדמיה, במכוון: enum קורא את השורה המסומנת כמו שאר הסוגים. בדפדפן אדם עונה על
//   שאלה-שתיים והשורה נדרסה בלי היזק; כאן המנוע מחיל הכול בבת אחת, ודריסה הייתה מאבדת פסקים.
export function applyPsak(spec, rulings) {
  const lines = spec.raw.split('\n');
  const marks = new Map();
  const extra = [];
  const at = (i) => (marks.has(i) ? marks.get(i).txt : lines[i]);
  const mark = (i, cls, txt) => marks.set(i, { cls, txt });
  const insert = (l, add) => { const cut = l.indexOf(' | '); return cut > 0 ? l.slice(0, cut) + add + l.slice(cut) : l + add; };
  for (const r of rulings) {
    const ap = r.apply;
    if (!ap || !r.decided) continue;
    if (ap.type === 'enum' || ap.type === 'field') {
      const i = lines.findIndex((l) => /^ישות /.test(l)); if (i < 0) continue;
      const nm = ap.name || 'שדה';
      mark(i, 'mod', insert(at(i), ap.type === 'enum' ? `, ${nm}{${ap.opts.join('|')}}` : `, ${nm}*`));
    } else if (ap.type === 'dropField') {
      const i = lines.findIndex((l, k) => at(k).startsWith(`ישות ${ap.ent} `) && fieldSeg(at(k), ap.name)); if (i < 0) continue;
      const l = at(i), sg = fieldSeg(l, ap.name);
      const cutFrom = l[sg.start - 1] === ',' ? sg.start - 1 : sg.start;
      const cutTo = cutFrom === sg.start && l[sg.end] === ',' ? sg.end + 1 : sg.end;
      mark(i, 'mod', l.slice(0, cutFrom) + l.slice(cutTo));
    } else if (ap.type === 'require' || ap.type === 'unrequire') {
      const i = entLine(lines, at, ap.name); if (i < 0) continue;
      const l = at(i), sg = fieldSeg(l, ap.name);
      mark(i, 'mod', l.slice(0, sg.start) + (ap.type === 'require' ? addStar(sg.raw) : dropStar(sg.raw)) + l.slice(sg.end));
    } else if (ap.type === 'content') {
      extra.push(ap.line);
    } else if (ap.type === 'placeholder') {
      const i = lines.indexOf(ap.line); if (i < 0) continue;
      mark(i, 'mod', ap.line.replace(/(?<=^|[\s־\-–])(X|Y|Z|N)(?=$|[\s.,;:־\-–)])/g, '{שדה}'));
    } else if (ap.type === 'dropLine') {
      const i = lines.indexOf(ap.line); if (i >= 0) mark(i, 'del', lines[i]);
    }
  }
  const outLines = lines.map((l, i) => { const m = marks.get(i); if (!m) return l; return m.cls === 'del' ? null : m.txt; }).filter((l) => l !== null);
  return { text: outLines.concat(extra).join('\n'), changed: marks.size + extra.length };
}

// ── שתי האפשרויות של מתג, בנויות בפועל על הספק המוכרע ──
function buildOptions(sw, fixedText) {
  const base = parseSpec(fixedText);
  return sw.options.map((o) => {
    const built = o.apply ? applyPsak(base, [{ decided: true, apply: o.apply }]) : { text: fixedText, changed: 0 };
    const bl = fixedText.split('\n'), nl = built.text.split('\n');
    const diff = [];
    for (const l of nl) if (!bl.includes(l)) diff.push('+ ' + l);
    for (const l of bl) if (!nl.includes(l)) diff.push('- ' + l);
    return { label: o.label, diff: diff.length ? diff : ['(אין שינוי בספק)'] };
  });
}

// ── פנקס-הפסק ──
function renderPsak(name, doc, rulings, switches, fixedText, specPath) {
  const dec = rulings.filter((r) => r.decided);
  const L = [`# ${name} · ${doc.title}`, '',
    `פסק לבד: ${dec.length} · מתגים: ${switches.length} · סה"כ ממצאים: ${rulings.length}`,
    `ספק מתוקן: \`${path.relative(ROOT, specPath)}\` — נכתב לצד המקורי, המקורי לא נגע.`, ''];
  const byMove = {};
  for (const r of rulings) (byMove[r.move] = byMove[r.move] || []).push(r);
  for (const k of ORDER) for (const [mv, rs] of Object.entries(byMove)) {
    if (!mv.startsWith(k) || L.includes(`## ${mv}`)) continue;
    L.push(`## ${mv}`);
    for (const r of rs) {
      L.push(`- **${r.ruling}** — ${r.text}`);
      for (const b of r.basis) L.push(`  - על סמך: ${b}`);
      if (!r.decided) for (const o of buildOptions(r, fixedText)) { L.push(`  - ${o.label}`); for (const d of o.diff) L.push(`    - \`${d}\``); }
    }
    L.push('');
  }
  L.push('---', 'כל שורת פסק נושאת את המהלך שהכריע ואת הראיה. פסק בלי מהלך = באג.',
    'מתג = לא נשארה עדות מכריעה; שתי האפשרויות בנויות למעלה, ואין כאן שאלה פתוחה.',
    'קובץ זה נכתב מחדש בכל ריצה; לניתוק ראה DETACH.md.');
  return L.join('\n') + '\n';
}

function main(argv) {
  const all = argv.includes('--all') || !argv.some((a) => /^peruk-\d+$/.test(a));
  const json = argv.includes('--json');
  const names = fs.readdirSync(PERUKS).filter((f) => /^peruk-\d+\.md$/.test(f)).map((f) => f.replace(/\.md$/, '')).sort();
  const want = all ? names : names.filter((n) => argv.includes(n));
  fs.mkdirSync(OUT, { recursive: true });
  const summary = [], totals = {};
  for (const name of want) {
    const srcSpec = path.join(SPECS, name.replace('-', '') + '.txt');
    if (!fs.existsSync(srcSpec)) { summary.push({ name, skipped: 'אין ספק' }); continue; }
    const doc = parsePeruk(fs.readFileSync(path.join(PERUKS, name + '.md'), 'utf8'));
    const spec = parseSpec(fs.readFileSync(srcSpec, 'utf8'));
    const findings = check(doc, spec).sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.text.localeCompare(b.text));
    const rulings = findings.map((f) => pasak(f, doc, spec));
    const switches = rulings.filter((r) => !r.decided);
    const built = applyPsak(spec, rulings);
    const outSpec = path.join(OUT, name.replace('-', '') + '.spec.txt');
    fs.writeFileSync(outSpec, built.text.endsWith('\n') ? built.text : built.text + '\n');
    fs.writeFileSync(path.join(OUT, name + '.psak.md'), renderPsak(name, doc, rulings, switches, built.text, outSpec));
    const by = {};
    for (const r of rulings) { const k = r.move + (r.decided ? '' : ' → מתג'); by[k] = (by[k] || 0) + 1; totals[k] = (totals[k] || 0) + 1; }
    summary.push({ name, title: doc.title, findings: rulings.length, decided: rulings.length - switches.length, switches: switches.length, applied: built.changed, by });
  }
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({ per: summary, totals }, null, 1) + '\n');
  if (json) { console.log(JSON.stringify({ per: summary, totals })); return 0; }
  for (const s of summary) console.log(s.skipped ? `— ${s.name}: ${s.skipped}` : `${String(s.decided).padStart(3)} פסק לבד · ${String(s.switches).padStart(2)} מתגים · ${s.name} · ${s.title.slice(0, 38)}`);
  const td = summary.reduce((a, x) => a + (x.decided || 0), 0), ts = summary.reduce((a, x) => a + (x.switches || 0), 0);
  console.log('\nלפי מהלך:');
  for (const [k, v] of Object.entries(totals).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log(`\nסה"כ: ${summary.filter((s) => !s.skipped).length} פירוקים · ${td + ts} ממצאים · ${td} פסק המנוע לבד · ${ts} מתגים ⇒ ${path.relative(ROOT, OUT)}/`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
