#!/usr/bin/env node
/** 🔌 מחצב · מחווט-הקופסאות-מחדש (מבצע-המאה, פאזה 8) — מדפי-הטיהור עדכנו חתימות-אטומים
 *  (שקעי T/דאטה) אבל קופסאות-ה-Dart נשארו על ה-API הישן. המנוע, מונחה-CFE (dart run על
 *  קובץ-ההוכחה), מתקן בקופסה בלבד:
 *   · ייבוא-שעבר-שם: ‏X-terms.dart שנמחק ⇒ ‏X-sockets.dart (אותו alias).
 *   · ‏API-הגימטריה הישן: ‏g.gem(x, term: (k)=>td.kTerms[k]!) ⇒ ‏g.gem(x, td.gematria_U/T/H/T2).
 *   · קריאה-חסרת-ארגומנטים (Too few positional): שמות-הפרמטרים החסרים נקראים מחתימת-האטום
 *     (dart-maor/<kebab>.dart) ומוזנים מ-dart-data-maor/<kebab>-sockets.dart (‏<fn>_<param>).
 *   · פרמטר-שמי-חובה (Required named parameter 'P') ⇒ ‏P: sk.<fn>_P.
 *   · ‏tear-off שהתרחב (arg type 'R Function(a,b,…)' ⇒ param 'R Function(a)') ⇒ עטיפת-סגירה
 *     שמזינה את שקעי-הזנב: ‏(a0) => f(a0, sk…).
 *  ולידציה: ההוכחה (<box>-proof.dart) ירוקה ⇒ נשמר; אחרת ⇒ החזרה מלאה. קופסה שתלויה
 *  באטום-בהסגר (קובץ-חסר/Method-not-found מההסגר) מדולגת בכנות עם דוח.
 *  שימוש: node machtzev/rethread-boxes.mjs [--only <box>] [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('..', import.meta.url).pathname;
const BOXES = path.join(ROOT, 'new/dart-boxes');
const DM = path.join(ROOT, 'new/dart-maor');
const DD = path.join(ROOT, 'new/dart-data-maor');
const DART = process.env.DART_BIN || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const DRY = process.argv.includes('--dry');

const kebab = (fn) => fn.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// ── ריצת-הוכחה: [] = ירוק; אחרת שגיאות-CFE {file, line, col, msg} ──
function proofErrors(box) {
  const pf = path.join(BOXES, box + '-proof.dart');
  if (!fs.existsSync(pf)) return [{ file: '', line: 0, col: 0, msg: 'אין-הוכחה' }];
  try {
    execFileSync(DART, ['run', '--enable-asserts', pf], { cwd: BOXES, stdio: 'pipe', timeout: 120000 });
    return [];
  } catch (e) {
    const out = String(e.stderr || '') + String(e.stdout || '');
    const errs = [];
    for (const m of out.matchAll(/^([\w./-]+\.dart):(\d+):(\d+): Error: ([^\n]+)/gm))
      errs.push({ file: m[1], line: +m[2], col: +m[3], msg: m[4] });
    return errs.length ? errs : [{ file: '', line: 0, col: 0, msg: 'כשל-ריצה: ' + out.slice(0, 200).replace(/\n/g, ' ') }];
  }
}

// ── חתימת-אטום: איתור הקובץ-המייצא (שם-קובץ ≠ שם-פונקציה, למשל gem⇐gematria) ──
const DN = path.join(ROOT, 'new/dart');
const DND = path.join(ROOT, 'new/dart-data');
const snake = (fn) => fn.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
const sigCache = new Map();
function atomInfo(fn) {
  if (sigCache.has(fn)) return sigCache.get(fn);
  const cands = [
    { dir: DM, shelf: 'maor', f: kebab(fn) + '.dart' },
    { dir: DN, shelf: 'bs', f: snake(fn) + '.dart' },
    ...fs.readdirSync(DM).filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => ({ dir: DM, shelf: 'maor', f })),
    ...fs.readdirSync(DN).filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => ({ dir: DN, shelf: 'bs', f })),
  ];
  let out = null;
  for (const { dir: cdir, shelf, f: cand } of cands) {
    const fp = path.join(cdir, cand);
    if (!fs.existsSync(fp)) continue;
    const src = fs.readFileSync(fp, 'utf8');
    const re2 = new RegExp(`(?:^|\\n)([\\w<>,?\\[\\] ]+) ${fn}\\(`, 'g');
    let m = null, mm;
    while ((mm = re2.exec(src))) {
      // הגנה: 'return gem(' / 'await f(' אינם הגדרה — המילה האחרונה לפני-השם חייבת להיות טיפוס
      if (/(^|\s)(return|await|throw|yield|case|new|const|else|assert|print|if|for|while)$/.test(mm[1].trim())) continue;
      m = mm; break;
    }
    if (!m) continue;
    const start = m.index + m[0].length;
    let d = 1, j = start;
    for (; j < src.length && d; j++) { if (src[j] === '(') d++; else if (src[j] === ')') d--; }
    const raw = src.slice(start, j - 1).replace(/[\[\]{}]/g, '');
    const parts = [];
    let dep = 0, cur = '';
    for (const ch of raw) {
      if ('<('.includes(ch)) dep++;
      if ('>)'.includes(ch)) dep--;
      if (ch === ',' && !dep) { parts.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) parts.push(cur.trim());
    const base = cand.replace(/\.dart$/, '');
    out = { base, shelf, camel: base.replace(/-(\w)/g, (_, c) => c.toUpperCase()), params: parts.map(p => p.replace(/=.*$/, '').trim().split(/\s+/).pop()) };
    break;
  }
  sigCache.set(fn, out);
  return out;
}
const atomParams = (fn) => atomInfo(fn)?.params ?? null;

// ── שקע-דאטה עבור fn+param: {file, constName} או null ──
function socketFor(fn, param) {
  const info = atomInfo(fn);
  if (!info) return null;
  if (info.shelf === 'bs') {
    const sf2 = path.join(DND, info.base + '-data.dart');
    if (fs.existsSync(sf2) && fs.readFileSync(sf2, 'utf8').includes(`${param} =`)) return { shelf: 'bs', file: info.base + '-data.dart', constName: param };
    return null;
  }
  const sf = path.join(DD, info.base + '-sockets.dart');
  const cn = `${info.camel}_${param}`;
  if (fs.existsSync(sf) && fs.readFileSync(sf, 'utf8').includes(`${cn} =`)) return { file: info.base + '-sockets.dart', constName: cn };
  return null;
}

// alias-ייבוא לשקעים בתוך הקופסה (מוסיף import אם צריך)
function ensureSocketImport(src, sockFile, shelf) {
  const alias = (shelf === 'bs' ? 'tdb_' : 'skb_') + sockFile.replace(/-(sockets|data)\.dart$/, '').replace(/-/g, '_');
  const line = shelf === 'bs'
    ? `import '../dart-data/${sockFile}' as ${alias};`
    : `import '../dart-data-maor/${sockFile}' as ${alias};`;
  if (!src.includes(line)) {
    const fi = src.search(/^import /m);
    src = fi >= 0 ? src.slice(0, fi) + line + '\n' + src.slice(fi) : line + '\n' + src;
  }
  return { src, alias };
}

const offAt = (lines, line, col) => lines.slice(0, line - 1).reduce((a, l) => a + l.length + 1, 0) + col - 1;

function repairBox(box) {
  const bp = path.join(BOXES, box + '.dart');
  const orig = fs.readFileSync(bp, 'utf8');
  let src = orig;
  const notes = [];

  // (1) ייבוא-שעבר-שם + (2) ‏API-הגימטריה הישן — טקסטואלי, לפני הלולאה
  src = src.replace(/import '\.\.\/dart-data-maor\/([\w-]+)-terms\.dart' as (\w+);/g, (all, base, alias) => {
    if (fs.existsSync(path.join(DD, base + '-terms.dart'))) return all;
    if (fs.existsSync(path.join(DD, base + '-sockets.dart'))) { notes.push(`ייבוא: ${base}-terms ⇒ -sockets`); return `import '../dart-data-maor/${base}-sockets.dart' as ${alias};`; }
    return all;
  });
  src = src.replace(/(\w+)\.gem\(([^;]*?),\s*term:\s*\(k\)\s*=>\s*(\w+)\.kTerms\[k\]!\)/g,
    (_, a, arg, td) => { notes.push('gem: ‏API-ישן ⇒ שקעי U/T/H/T2'); return `${a}.gem(${arg}, ${td}.gematria_U, ${td}.gematria_T, ${td}.gematria_H, ${td}.gematria_T2)`; });

  fs.writeFileSync(bp, src);
  let rounds = 0, last = Infinity;
  while (rounds++ < 150) {
    const errs = proofErrors(box);
    if (!errs.length) { if (DRY) { fs.writeFileSync(bp, orig); } return { ok: true, notes }; }
    // תלות-הסגר ⇒ דילוג כן
    const qdep = errs.find(e => /Error when reading '\.\.\/dart-maor\/([\w-]+)\.dart'/.test(e.msg) &&
      fs.existsSync(path.join(DM, 'QUARANTINE', e.msg.match(/dart-maor\/([\w-]+)\.dart/)[1] + '.dart')));
    if (qdep) { fs.writeFileSync(bp, orig); return { ok: false, skip: true, notes: [`תלוי-הסגר: ${qdep.msg.match(/dart-maor\/([\w-]+)\.dart/)[1]}`] }; }
    const boxErrs = errs.filter(e => e.file.endsWith(box + '.dart'));
    if (!boxErrs.length || boxErrs.length > last) { fs.writeFileSync(bp, orig); return { ok: false, notes: [...notes, `לא-מתכנס: ${errs.slice(0, 3).map(e => e.msg).join(' · ')}`] }; }
    last = boxErrs.length;
    src = fs.readFileSync(bp, 'utf8');
    let lines = src.split('\n');
    // מהסוף-להתחלה — offsets לא זזים
    const jobs = boxErrs.map(e => ({ ...e, at: offAt(lines, e.line, e.col) })).sort((a, b) => b.at - a.at).slice(0, 1);
    let changed = false;
    for (const e of jobs) {
      let m;
      if ((m = e.msg.match(/^Too few positional arguments: (\d+) required, (\d+) given/))) {
        const need = +m[1], got = +m[2];
        // באופסט: '(' של הקריאה; שם-הפונקציה = הזיהוי שלפניו
        let p = e.at;
        while (p < src.length && src[p] !== '(') p++;
        let s = p - 1;
        while (s >= 0 && /[\w.$]/.test(src[s])) s--;
        const chain = src.slice(s + 1, p);
        const fn = chain.split('.').pop();
        const params = atomParams(fn);
        if (!params || params.length < need) { if (process.env.RBDBG) console.error('DBG too-few chain=', JSON.stringify(chain), 'fn=', fn, 'need=', need, 'got=', got, 'ctx=', JSON.stringify(src.slice(Math.max(0,e.at-40), e.at+40))); notes.push(`יד: ${fn} — אין-חתימה`); continue; }
        const missing = params.slice(got, need);
        const refs = [];
        let okAll = true;
        for (const pm of missing) {
          const sk = socketFor(fn, pm);
          if (!sk) { okAll = false; notes.push(`יד: ${fn} — אין שקע ל-${pm}`); break; }
          const r = ensureSocketImport(src, sk.file, sk.shelf);
          if (r.src !== src) { src = r.src; lines = src.split('\n'); }
          refs.push(`${r.alias}.${sk.constName}`);
        }
        if (!okAll) continue;
        // איזון-סוגריים למציאת ')' הסוגר; הזרקה לפניו (אופסטים חושבו-מחדש אחרי imports)
        const callAt = src.indexOf(chain + '(', Math.max(0, src.length === lines.join('\n').length ? offAt(lines, e.line, e.col) - chain.length : 0));
        let d = 0, j = callAt + chain.length;
        for (; j < src.length; j++) { if (src[j] === '(') d++; else if (src[j] === ')') { d--; if (!d) break; } }
        if (j >= src.length) { notes.push(`יד: ${fn} — איזון`); continue; }
        src = src.slice(0, j) + (got ? ', ' : '') + refs.join(', ') + src.slice(j);
        notes.push(`${fn}: +${missing.join(',')}`);
        changed = true;
      } else if ((m = e.msg.match(/^Required named parameter '(\w+)' must be provided/))) {
        const pm = m[1];
        let p = e.at;
        while (p < src.length && src[p] !== '(') p++;
        let s = p - 1;
        while (s >= 0 && /[\w.$]/.test(src[s])) s--;
        const fn = src.slice(s + 1, p).split('.').pop();
        const sk = socketFor(fn, pm);
        if (!sk) { notes.push(`יד: ${fn} — אין שקע שמי ${pm}`); continue; }
        const r = ensureSocketImport(src, sk.file, sk.shelf);
        src = r.src;
        const callAt2 = src.indexOf(src.slice(s + 1, p) + '(');
        let d = 0, j = callAt2 + (p - s - 1);
        for (; j < src.length; j++) { if (src[j] === '(') d++; else if (src[j] === ')') { d--; if (!d) break; } }
        const inner = src.slice(callAt2, j).includes('(') ? true : false;
        src = src.slice(0, j) + (src.slice(callAt2 + (p - s), j).trim() ? ', ' : '') + `${pm}: ${r.alias}.${sk.constName}` + src.slice(j);
        notes.push(`${fn}: +${pm}(שמי)`);
        changed = true;
      } else if ((m = e.msg.match(/^The argument type '[\w<>,? ]+ Function\(([^)]*)\)'? can't be assigned to the parameter type '[\w<>,? ]+ Function\(([^)]*)\)'/))) {
        const haveN = m[1].trim() ? m[1].split(',').length : 0;
        const wantN = m[2].trim() ? m[2].split(',').length : 0;
        if (haveN <= wantN) continue;
        // הארגומנט בנקודה: שרשרת-מזהים (tear-off)
        let s2 = e.at;
        while (s2 > 0 && /[\w.$]/.test(src[s2 - 1])) s2--;
        let epos = s2;
        while (epos < src.length && /[\w.$]/.test(src[epos])) epos++;
        const chain = src.slice(s2, epos);
        const fn = chain.split('.').pop();
        const params = atomParams(fn);
        if (!params || !/^[\w.$]+$/.test(chain)) { notes.push(`יד: tear-off ${chain}`); continue; }
        const missing = params.slice(wantN);
        const refs = [];
        let okAll = true;
        const preLen = src.length;
        for (const pm of missing) {
          const sk = socketFor(fn, pm);
          if (!sk) { okAll = false; notes.push(`יד: tear-off ${fn} — אין שקע ${pm}`); break; }
          const r = ensureSocketImport(src, sk.file, sk.shelf);
          if (r.src !== src) { src = r.src; }
          refs.push(`${r.alias}.${sk.constName}`);
        }
        if (!okAll) continue;
        const args = Array.from({ length: wantN }, (_, i) => 'a' + i);
        const pos = src.indexOf(chain, s2 + (src.length - preLen));
        if (pos < 0 || !/[\s,(]/.test(src[pos - 1] ?? ' ')) { notes.push(`יד: tear-off ${chain} — מיקום`); continue; }
        const info2 = atomInfo(fn);
        const feed = info2?.shelf === 'bs' ? refs.map((r2, ri) => `${missing[ri]}: ${r2}`) : refs;
        src = src.slice(0, pos) + `(${args.join(', ')}) => ${chain}(${[...args, ...feed].join(', ')})` + src.slice(pos + chain.length);
        notes.push(`${fn}: tear-off ⇒ סגירת-שקעים`);
        changed = true;
      }
    }
    if (!changed) { fs.writeFileSync(bp, orig); return { ok: false, notes: [...notes, `לא-טופל: ${boxErrs.slice(0, 3).map(x => x.msg).join(' · ')}`] }; }
    fs.writeFileSync(bp, src);
  }
  const fin = proofErrors(box);
  if (!fin.length) { if (DRY) fs.writeFileSync(bp, orig); return { ok: true, notes }; }
  fs.writeFileSync(bp, orig);
  return { ok: false, notes: [...notes, 'לא-הבריא אחרי 150 סבבים'] };
}

const boxes = fs.readdirSync(BOXES).filter(f => f.endsWith('.dart') && !f.endsWith('-proof.dart')).map(f => f.replace(/\.dart$/, ''))
  .filter(b => !ONLY || b === ONLY);
let ok = 0, skip = 0, bad = 0;
for (const b of boxes) {
  const pre = proofErrors(b);
  if (!pre.length) continue;                                       // כבר ירוקה
  const r = repairBox(b);
  if (r.ok) { ok++; console.log(`✅ ${b} — ${r.notes.join(' · ') || 'ירוקה'}`); }
  else if (r.skip) { skip++; console.log(`🏥 ${b} — ${r.notes.join(' · ')}`); }
  else { bad++; console.log(`🫱 ${b} — ${r.notes.join(' · ')}`); }
}
console.log(`\n🔌 מחווט-הקופסאות: ${ok} הבריאו · ${skip} תלויות-הסגר · ${bad} ליד`);
