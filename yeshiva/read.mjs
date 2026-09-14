#!/usr/bin/env node
// 🕯️ yeshiva-read — הקורא הישיבתי על מסמכי-הפירוק (שכבה 1: צופה בלבד · הפיך · נתיק).
//   קלט: generator/peruks/peruk-NN.md (מה שהבעלים כתב) + generator/specs-ds/perukNN.txt (מה ש-peruk.mjs גזר).
//   פלט: yeshiva/out/peruk-NN.yeshiva.md — מה בפירוק לא הגיע לספק, ומה הספק הניח במקומו. אפס נגיעה בספק, בפלט, ב-regen.
//   כל בדיקה = צורה, לא תוכן (עיוור-דומיין כמו המחצב): חלופות-בסלאש מול enum · מספרים בפירוק מול הספק · שדות-תאומים ·
//   מצייני-מקום בתוכן · כותרות שהפכו לתוכן · ציטוטים «…» שלא הגיעו · "רשות" מול שדות-חובה. אין מודל, אין רשת, דטרמיניסטי.
//   שימוש: node yeshiva/read.mjs [--all | peruk-04 …] [--json]     ניתוק: ראה DETACH.md (git rm -r yeshiva).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = (process.env.MACHTZEV_ROOT ? path.resolve(process.env.MACHTZEV_ROOT) : path.resolve(HERE, '..')) + '/';
const PERUKS = path.join(ROOT, 'machtzev/generator/peruks');
const SPECS = path.join(ROOT, 'machtzev/generator/specs-ds');
const OUT = path.join(HERE, 'out');

// ── לקסיקון (צורה בלבד) ──
const STOP = new Set(['את', 'של', 'על', 'עם', 'או', 'אם', 'כי', 'לא', 'כן', 'זה', 'זו', 'יש', 'אין', 'מה', 'מי', 'גם', 'רק', 'כל', 'עוד', 'כבר', 'בלי', 'עד', 'מול', 'ועד', 'ולא', 'הוא', 'היא', 'הם', 'לפי', 'בין', 'אחרי', 'לפני', 'מתי', 'איך', 'למה', 'אז', 'אבל']);
const PLACEHOLDER_RE = /(?:^|[\s־\-–])(?:X|Y|Z|N|XX|YY|NN|TBD|TODO|\?\?\?)(?=$|[\s.,;:־\-–)])/;
const HEADING_ONLY_RE = /^[א-ת״׳"' ]{1,20}:$/;
const NUM_RE = /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})*|\d+)(?:\s*[–\-]\s*(\d+))?\s*(%|₪|ימים?|יום|שבועות?|שבוע|חודשים?|חודש|שעות|שנים?|שנה)?/g;
const SLASH_LIST_RE = /([א-ת״׳"' ]{2,30})\s*\/\s*([א-ת״׳"' ]{2,30})(?:\s*\/\s*([א-ת״׳"' ]{2,30}))?/;
const QUOTE_RE = /«([^»]{3,80})»/g;

const words = (s) => [...String(s).matchAll(/[א-ת״׳"']{2,}/g)].map((m) => m[0]).filter((w) => !STOP.has(w));
const PREFIX = /^[ובלכמשה]/;
const sameWord = (a, b) => a === b || (PREFIX.test(a) && a.slice(1) === b) || (PREFIX.test(b) && b.slice(1) === a);   // בטוחות ≡ הבטוחות, לא ≡ טוחות
const norm = (s) => String(s).replace(/[״"'׳]/g, '').replace(/\s+/g, ' ').trim();

// ── קריאת הספק (מבנית, אותם מפרידים של peruk/app-ds) ──
function parseSpec(text) {
  const spec = { entities: [], fields: [], enums: [], required: new Set(), particles: [], contents: [], raw: text, lines: text.split('\n') };
  for (const line of spec.lines) {
    let m;
    if ((m = line.match(/^ישות (.+?) עם (.*?)(?: \| |$)/))) {
      const ent = m[1];
      spec.entities.push(ent);
      // «| שלבים: א, ב, ג» — השלבים הם מקרים-בשמם של הישות (כמו enum): «נפרע / חזר» בפירוק מכוסה בשלבים
      const st = line.match(/\|\s*שלבים\s*:?\s*([^|]+)/);
      if (st) spec.enums.push({ ent, name: 'שלבים', values: st[1].split(/[,،]/).map(norm).filter(Boolean) });
      for (const raw of m[2].split(',')) {
        const f = raw.trim(); if (!f) continue;
        const name = norm(f.replace(/[*{(].*$/, ''));
        const req = /\*/.test(f.replace(/\{[^}]*\}|\([^)]*\)/g, ''));
        const en = (f.match(/\{([^}]*)\}/) || [])[1];
        const range = (f.match(/\(([^)]*)\)/) || [])[1];
        spec.fields.push({ ent, name, req, en: en ? en.split('|').map(norm) : null, range: range || null });
        if (req) spec.required.add(name);
        if (en) spec.enums.push({ ent, name, values: en.split('|').map(norm) });
      }
    } else if (/^(חלקיק|דוח|לוח בקרה)/.test(line)) spec.particles.push(line);
    else if (/^תוכן /.test(line)) spec.contents.push(line);
  }
  return spec;
}

// ── קריאת הפירוק (מבנית: כותרות · רשימות · «ציטוטים» · סלאשים · מספרים) ──
function parsePeruk(text) {
  const lines = text.split('\n');
  const doc = { lines, title: (lines[0] || '').replace(/^#\s*/, ''), sections: {}, optional: [], mandatory: [] };
  let sec = '', sub = '';
  for (const l of lines) {
    if (/^## /.test(l)) { sec = l.replace(/^##\s*\d*\.?\s*/, '').trim(); sub = ''; doc.sections[sec] = []; continue; }
    if (/^### /.test(l)) { sub = l.replace(/^###\s*/, '').trim(); continue; }
    if (!sec) continue;
    doc.sections[sec].push(l);
    if (/^רשות/.test(l)) sub = 'רשות'; else if (/^חובה/.test(l)) sub = 'חובה';
    const item = l.match(/^\s*[-•]\s*(.+)$/);
    if (item && /[א-ת]/.test(item[1]) && sub === 'רשות') doc.optional.push(norm(item[1]));
    if (item && /[א-ת]/.test(item[1]) && sub === 'חובה') doc.mandatory.push(norm(item[1]));
  }
  return doc;
}

// ── הבדיקות ──
function check(doc, spec) {
  const out = [];
  const specText = norm(spec.raw);
  const specWords = new Set(words(specText));

  // איכא דאמרי · חלופות-בסלאש בפירוק ⇒ יש enum בספק?
  for (const [sec, ls] of Object.entries(doc.sections)) {
    if (!/פירוק|בלוק|המוצר/.test(sec)) continue;
    for (const l of ls) {
      const m = l.match(SLASH_LIST_RE); if (!m) continue;
      const opts = [m[1], m[2], m[3]].filter(Boolean).map(norm);
      if (opts.some((o) => o.split(' ').length > 3)) continue;                   // משפט עם סלאש, לא רשימת-מקרים
      if (/^\s*[-•\d.]*\s*(מתי|האם|מה|איך|למה|כמה)\b/.test(l)) continue;         // שאלה בפירוק, לא מקרים בשמם
      const covered = spec.enums.some((e) => opts.filter((o) => e.values.some((v) => v.includes(o) || o.includes(v))).length >= 2);
      if (!covered) out.push({ kind: 'איכא דאמרי', q: true, text: `«${norm(l.replace(/^\s*[-•\d.]+\s*/, ''))}» — מקרים בשמם בפירוק, ואין enum מתאים בספק. שדה {${opts.join('|')}}?` });
    }
  }

  // שיעור · מספרים בפירוק שלא הגיעו לספק
  const docNums = new Map();
  for (const [sec, ls] of Object.entries(doc.sections)) {
    if (/דוגמ/.test(sec)) continue;                                                 // דוגמת-פלט = נתוני-דמו, לא כלל
    for (const l of ls) for (const m of l.matchAll(NUM_RE)) {
      if (!m[3] && !m[2]) continue;                                                // מספר חשוף בלי יחידה ובלי טווח — לא שיעור
      const key = m[0].trim(); if (!docNums.has(key)) docNums.set(key, norm(l).slice(0, 90));
    }
  }
  for (const [k, ctx] of docNums) if (!specText.includes(norm(k)) && !specText.includes(k.replace(/\s+/g, ''))) out.push({ kind: 'שיעור', q: true, text: `«${k}» בפירוק («${ctx}») — לא בספק. סף/שיעור שנשמט, או טקסט בלבד?` });

  // ורמינהו · שני שדות באותה ישות עם מילת-תוכן משותפת ואותו סוג
  for (const ent of spec.entities) {
    const fs_ = spec.fields.filter((f) => f.ent === ent);
    for (let i = 0; i < fs_.length; i++) for (let j = i + 1; j < fs_.length; j++) {
      const a = fs_[i], b = fs_[j];
      const shared = words(a.name).filter((w) => w.length >= 3 && words(b.name).some((v) => sameWord(w, v)));
      const sameKind = (!!a.en === !!b.en) && (!!a.range === !!b.range);
      const paired = spec.particles.some((pl) => pl.includes(a.name) && pl.includes(b.name));   // «דיף: ישן ← חדש» — זוג מכוון
      if (shared.length && sameKind && a.name !== b.name && !paired) out.push({ kind: 'ורמינהו', q: true, text: `«${a.name}»${a.req ? '*' : ''} ו«${b.name}»${b.req ? '*' : ''} ב${ent} — מילה משותפת «${shared[0]}», אותו סוג. אחד מהם, או שניהם בכוונה?` });
    }
  }

  // מאי X · מצייני-מקום בתוכן
  for (const c of spec.contents) if (PLACEHOLDER_RE.test(c)) out.push({ kind: 'מאי X', q: false, text: `${c.slice(0, 80)} — מציין-מקום מהדוגמה הפך לטקסט. להחליף ב{שדה}.` });

  // אין מערבין · כותרת-דוגמה שהפכה לשורת-תוכן
  for (const c of spec.contents) { const body = c.replace(/^תוכן [^:]*:\s*/, '').trim(); if (HEADING_ONLY_RE.test(body)) out.push({ kind: 'אין מערבין', q: false, text: `${c.slice(0, 60)} — כותרת, לא תוכן. להשמיט.` }); }

  // ייתור = מידע · ציטוט «…» בפירוק שלא הגיע לספק
  for (const [sec, ls] of Object.entries(doc.sections)) {
    if (!/פירוק|בלוק|אדום|צהוב|ירוק|סיווג|המוצר|אסור|חובה/.test(sec)) continue;
    for (const l of ls) for (const m of l.matchAll(QUOTE_RE)) { const qn = norm(m[1]); if (!specText.includes(qn)) out.push({ kind: 'ייתור', q: true, text: `«${qn}» — מצוטט בפירוק (${sec}) ולא בספק. תוכן בדיקה? אסור? הודעה?` }); }
  }

  // ממה נפשך · "רשות" ⇒ לא-חובה בספק (הערה, לא שאלה); "חובה" ⇒ חובה
  for (const o of doc.optional) { const f = spec.fields.find((x) => words(x.name).some((w) => words(o).some((v) => sameWord(w, v)))); if (f && f.req) out.push({ kind: 'ורמינהו', q: true, text: `«${o}» רשות בפירוק, אבל «${f.name}»* חובה בספק.` }); }
  for (const o of doc.mandatory) { const f = spec.fields.find((x) => words(x.name).some((w) => words(o).some((v) => sameWord(w, v)))); if (f && !f.req) out.push({ kind: 'ורמינהו', q: true, text: `«${o}» חובה בפירוק, אבל «${f.name}» לא חובה בספק.` }); if (!f) out.push({ kind: 'ייתור', q: true, text: `«${o}» חובה ב"מה שולחים" — אין שדה בספק שמכיל מילה ממנו.` }); }

  // ממה נפשך · שדות-רשות שנבנו כרשות — שתי הקריאות שוות, לא שואלים
  const mn = doc.optional.filter((o) => spec.fields.some((x) => !x.req && words(x.name).some((w) => words(o).some((v) => sameWord(w, v)))));
  if (mn.length) out.push({ kind: 'ממה נפשך', q: false, text: `רשות בפירוק ורשות בספק: ${mn.map((x) => `«${x}»`).join(', ')} — נבנה כך, אין שאלה.` });

  return out;
}

// ── פלט ──
const ORDER = ['איכא דאמרי', 'שיעור', 'ורמינהו', 'ייתור', 'מאי X', 'אין מערבין', 'ממה נפשך'];
function render(name, doc, findings) {
  const qs = findings.filter((f) => f.q), fixes = findings.filter((f) => !f.q && f.kind !== 'ממה נפשך'), notes = findings.filter((f) => f.kind === 'ממה נפשך');
  const lines = [`# ${name} · ${doc.title}`, '', `שאלות לבעלים: ${qs.length} · תיקונים מכניים: ${fixes.length} · הערות: ${notes.length}`, ''];
  for (const k of ORDER) {
    const fs_ = findings.filter((f) => f.kind === k); if (!fs_.length) continue;
    lines.push(`## ${k}`);
    for (const f of fs_) lines.push(`- ${f.text}`);
    lines.push('');
  }
  if (!findings.length) lines.push('אין פערים: כל מה שבפירוק הגיע לספק, ואין הצבה שקטה.');
  lines.push('---', 'תשובה: שורה לכל שאלה תחת `## הצבות` בפירוק (שכבה 2). קובץ זה נכתב מחדש בכל ריצה; לניתוק ראה DETACH.md.');
  return lines.join('\n') + '\n';
}

function main(argv) {
  const all = argv.includes('--all') || !argv.some((a) => /^peruk-\d+$/.test(a));
  const json = argv.includes('--json');
  const names = fs.readdirSync(PERUKS).filter((f) => /^peruk-\d+\.md$/.test(f)).map((f) => f.replace(/\.md$/, '')).sort();
  const want = all ? names : names.filter((n) => argv.includes(n));
  fs.mkdirSync(OUT, { recursive: true });
  const summary = [];
  for (const name of want) {
    const specPath = path.join(SPECS, name.replace('-', '') + '.txt');
    if (!fs.existsSync(specPath)) { summary.push({ name, skipped: 'אין ספק' }); continue; }
    const doc = parsePeruk(fs.readFileSync(path.join(PERUKS, name + '.md'), 'utf8'));
    const spec = parseSpec(fs.readFileSync(specPath, 'utf8'));
    const findings = check(doc, spec).sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.text.localeCompare(b.text));
    fs.writeFileSync(path.join(OUT, name + '.yeshiva.md'), render(name, doc, findings));
    const by = {}; for (const f of findings) by[f.kind] = (by[f.kind] || 0) + 1;
    summary.push({ name, title: doc.title, questions: findings.filter((f) => f.q).length, fixes: findings.filter((f) => !f.q && f.kind !== 'ממה נפשך').length, by });
  }
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1) + '\n');
  if (json) { console.log(JSON.stringify(summary)); return 0; }
  const tq = summary.reduce((s, x) => s + (x.questions || 0), 0), tf = summary.reduce((s, x) => s + (x.fixes || 0), 0);
  for (const s of summary) console.log(s.skipped ? `— ${s.name}: ${s.skipped}` : `${String(s.questions).padStart(2)} שאלות · ${String(s.fixes).padStart(2)} תיקונים · ${s.name} · ${s.title.slice(0, 40)}`);
  console.log(`\nסה"כ: ${summary.filter((s) => !s.skipped).length} פירוקים · ${tq} שאלות · ${tf} תיקונים ⇒ ${path.relative(ROOT, OUT)}/`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
